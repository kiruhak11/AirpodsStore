import { defineStore } from 'pinia';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const cart = ref<CartItem[]>([]);
    const totalPrice = computed(() => {
      return cart.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
    });

    const addToCart = (product: Product) => {
      const existingItem = cart.value.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.value.push({ product, quantity: 1 });
      }
    };

    const removeFromCart = (productId: number) => {
      const itemIndex = cart.value.findIndex((item) => item.product.id === productId);
      if (itemIndex !== -1) {
        if (cart.value[itemIndex].quantity > 1) {
          cart.value[itemIndex].quantity = 0;
          cart.value.splice(itemIndex, 1);
        } else {
          cart.value.splice(itemIndex, 1);
        }
      }
    };

    const clearCart = () => {
      cart.value = [];
    };

    const increaseQuantity = (productId: number) => {
      const item = cart.value.find((item) => item.product.id === productId);
      if (item) {
        item.quantity++;
      }
    };

    const decreaseQuantity = (productId: number) => {
      const item = cart.value.find((item) => item.product.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
      } else if (item) {
        const itemIndex = cart.value.findIndex((item) => item.product.id === productId);
        cart.value.splice(itemIndex, 1);
      }
    };

    return { cart, totalPrice, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity };
  },
  { persist: true },
);
