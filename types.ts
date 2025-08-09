
export interface Product {
  id: string;
  name: string;
  description: string; // for card
  longDescription: string; // for modal
  price: number; // The actual, potentially discounted price
  originalPrice: number; // The price before discount
  imageUrl: string;
  timesOrdered?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

export interface Testimonial {
  name: string;
  location: string;
  stars: number;
  feedback: string;
  imageUrl: string;
}

export interface DeliveryDetails {
  firstName: string;
  lastName:string;
  phone: string;
  email: string;
  location: string;
  locationDetails: string;
}

export interface Order {
  id:string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
}

export interface LiveSale {
  productName: string;
  location: string;
  imageUrl: string;
}

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}