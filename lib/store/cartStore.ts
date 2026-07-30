import { create } from 'zustand';
import { toast } from '@/components/ui/toast';

export interface CartItem {
  cartItemId: string; // Unique ID for the instance in the cart
  id: string; // The gear ID
  name: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  addToCart: (gear: any) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setDates: (start?: Date, end?: Date) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  startDate: undefined,
  endDate: undefined,

  addToCart: (gear) => {
    const { items } = get();
    // Count how many of this specific gear item are already in the cart
    const currentCount = items.filter(item => item.id === gear.id).length;
    
    if (currentCount >= (gear.stock || 1)) {
      toast.add({
        type: 'error',
        title: 'Stock Limit Reached',
        description: `You cannot add more than ${gear.stock} of ${gear.name} to your trip.`
      });
      return;
    }

    const newItem: CartItem = {
      cartItemId: crypto.randomUUID(),
      id: gear.id,
      name: gear.name,
      price: gear.price,
      imageUrl: gear.imageUrl,
      brand: gear.brand,
      stock: gear.stock || 1,
    };

    set({ items: [...items, newItem], isCartOpen: true });
    
    toast.add({
      type: 'success',
      title: 'Added to Trip',
      description: `${gear.name} has been added to your rental bag.`
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.cartItemId !== cartItemId)
    }));
  },

  clearCart: () => {
    set({ items: [], startDate: undefined, endDate: undefined });
  },

  setIsCartOpen: (isOpen) => {
    set({ isCartOpen: isOpen });
  },

  setDates: (start, end) => {
    set({ startDate: start, endDate: end });
  },
}));
