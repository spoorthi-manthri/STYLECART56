// ===== STYLECART Type Definitions =====
// Shared TypeScript interfaces for products, cart, auth, orders, and tailor requests

// Clothing garment categories available in the shop
export type GarmentCategory =
  | 'Dresses'
  | 'Tops'
  | 'Jeans'
  | 'Sarees'
  | 'Kurtis'
  | 'Shirts'
  | 'Trousers';

// Fabric / material categories that customers can browse by cloth type
export type FabricCategory = 'Silk' | 'Cotton' | 'Linen' | 'Chiffon' | 'Georgette' | 'Denim';

// A single product listed in the shop
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: GarmentCategory;
  fabric: FabricCategory;
  price: number;          // original price in Rs.
  discountPrice?: number; // optional discounted price
  image: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  tailorAvailable: boolean; // whether tailor service is offered for this product
  deliveryDays: number;     // estimated delivery time in days
}

// An item placed in the shopping cart — retains chosen size and color
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

// Delivery details collected at checkout
export interface DeliveryDetails {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  deliveryDate: string;   // preferred delivery date
  deliveryTime: string;   // preferred delivery time slot
}

// An order placed by a customer
export interface Order {
  id?: string;
  user_id?: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  delivery_date?: string;
  delivery_time?: string;
  items: CartItem[];
  total: number;
  payment_method: string;
  status?: string;
  created_at?: string;
}

// A tailor / alteration service request
export interface TailorRequest {
  id?: string;
  user_id?: string;
  customer_name: string;
  phone: string;
  garment_type: string;
  service_type: 'alteration' | 'stitching';
  description: string;
  measurements?: string;
  budget?: number;
  preferred_date?: string;
  contact_preference: 'meet' | 'call';
  image_url?: string;
  status?: string;
  created_at?: string;
}

// Authentication user returned by the Spring Boot API
export interface AuthUser {
  id: string;
  email: string;
}
