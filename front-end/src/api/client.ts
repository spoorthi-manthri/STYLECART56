// STYLECART API client: all persistent operations go through Java Spring Boot.
// Configure VITE_API_BASE_URL in .env.local when the backend URL changes.
import type { Order, TailorRequest, Product } from '@/types';
import { sampleProducts } from '@/data/products';

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export interface ApiUser { id: number | string; email: string; name?: string; }
export interface AuthResult { user: ApiUser; token?: string; }

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.message || body.error || body.detail || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('stylecart_token') ? { Authorization: `Bearer ${localStorage.getItem('stylecart_token')}` } : {}), ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

// Converts the existing Spring Boot Product entity shape into the UI's shape.
function normalizeProduct(raw: Record<string, unknown>, index: number): Product {
  const price = toNumber(raw.price, 0);
  const discountPercentage = toNumber(raw.discountPercentage ?? raw.discount_percentage, 0);
  const discounted = raw.discountPrice ?? raw.discountedPrice ?? raw.discounted_price;
  const discountPrice = discounted != null
    ? toNumber(discounted, price)
    : discountPercentage > 0 ? Math.round(price * (1 - discountPercentage / 100) * 100) / 100 : undefined;
  const rawSizes = raw.sizes ?? raw.size;
  const rawColors = raw.colors ?? raw.color;
  const sizes = Array.isArray(rawSizes) ? rawSizes.map(String) : rawSizes ? String(rawSizes).split(/[,/|]/).map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL'];
  const colors = Array.isArray(rawColors) ? rawColors.map(String) : rawColors ? String(rawColors).split(/[,/|]/).map(s => s.trim()).filter(Boolean) : ['As shown'];
  const category = String(raw.category ?? 'Dresses');
  const fabric = String(raw.fabric ?? 'Cotton');
  const validCategories = ['Dresses', 'Tops', 'Jeans', 'Sarees', 'Kurtis', 'Shirts', 'Trousers'];
  const validFabrics = ['Silk', 'Cotton', 'Linen', 'Chiffon', 'Georgette', 'Denim'];
  return {
    id: toNumber(raw.id, index + 1),
    name: String(raw.name ?? 'Clothing item'),
    brand: String(raw.brand ?? 'STYLECART'),
    category: (validCategories.find(c => c.toLowerCase() === category.toLowerCase()) ?? category) as Product['category'],
    fabric: (validFabrics.find(f => f.toLowerCase() === fabric.toLowerCase()) ?? fabric) as Product['fabric'],
    price,
    ...(discountPrice != null && discountPrice < price ? { discountPrice } : {}),
    image: String(raw.image ?? raw.imageUrl ?? raw.image_url ?? ''),
    sizes: sizes.length ? sizes : ['Free Size'],
    colors: colors.length ? colors : ['As shown'],
    description: String(raw.description ?? `${fabric} ${category}`),
    rating: toNumber(raw.rating, 4.5),
    tailorAvailable: raw.tailorAvailable == null ? true : Boolean(raw.tailorAvailable),
    deliveryDays: toNumber(raw.deliveryDays, 5),
  };
}

// Product browsing works with the Java API; sample items keep the storefront visible offline.

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await request<unknown>('/products');

    console.log('STYLECART backend response:', data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Backend returned no products. Using sample products.');
      return sampleProducts;
    }

    const products = data.map((item, index) =>
        normalizeProduct(item as Record<string, unknown>, index)
    );

    console.log('STYLECART normalized products:', products);

    // ADDITION: Show sample products plus products from the backend.
    return [
      ...sampleProducts,
      ...products,
    ];

  } catch (error) {
    console.error('STYLECART backend request failed:', error);
    return sampleProducts;
  }
}


// Spring Boot endpoints expected by this frontend:
// POST /api/auth/register { name, email, password }
// POST /api/auth/login { email, password }
export async function registerUser(name: string, email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function submitOrder(
  order: Omit<Order, 'id' | 'user_id' | 'status' | 'created_at'>
): Promise<{ data: Order | null; error: string | null }> {
  const payload = {
    customerName: order.customer_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    pincode: order.pincode,
    deliveryDate: order.delivery_date ?? null,
    deliveryTime: order.delivery_time ?? null,
    items: order.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      unitPrice: item.product.discountPrice ?? item.product.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor,
    })),
    total: order.total,
    paymentMethod: order.payment_method,
  };
  try {
    const data = await request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Could not place order. Check that the Java backend is running.' };
  }
}

export async function submitTailorRequest(
  tailorRequest: Omit<TailorRequest, 'id' | 'user_id' | 'status' | 'created_at'>
): Promise<{ data: TailorRequest | null; error: string | null }> {
  const payload = {
    customerName: tailorRequest.customer_name,
    phone: tailorRequest.phone,
    garmentType: tailorRequest.garment_type,
    serviceType: tailorRequest.service_type,
    description: tailorRequest.description,
    measurements: tailorRequest.measurements ?? null,
    budget: tailorRequest.budget ?? null,
    preferredDate: tailorRequest.preferred_date ?? null,
    contactPreference: tailorRequest.contact_preference,
    imageUrl: tailorRequest.image_url ?? null,
  };
  try {
    const data = await request<TailorRequest>('/tailor-requests', { method: 'POST', body: JSON.stringify(payload) });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Could not submit tailor request. Check that the Java backend is running.' };
  }
}
