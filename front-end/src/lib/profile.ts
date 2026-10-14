// ===== User Profile Helper =====
// Saves delivery/profile details to localStorage so they can be
// pre-filled across checkout and tailor service pages.
// When a user logs in, their email is automatically included.

export interface UserProfile {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

const STORAGE_KEY = 'stylecart_profile';

// Load the saved profile from localStorage (returns empty values if none saved)
export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserProfile;
  } catch {
    // ignore parse errors
  }
  return { customerName: '', email: '', phone: '', address: '', city: '', pincode: '' };
}

// Save profile details to localStorage
export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}
