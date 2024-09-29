import { defineStore } from "pinia";

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

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [] as CartItem[],
  }),
  getters: {
    totalPrice: (state) => {
      return state.cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    },
  },
  actions: {
    addToCart(product: Product) {
      const existingItem = this.cart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ product, quantity: 1 });
      }
      this.saveCart();
    },
    removeFromCart(productId: number) {
      const itemIndex = this.cart.findIndex(
        (item) => item.product.id === productId
      );
      if (itemIndex !== -1) {
        if (this.cart[itemIndex].quantity > 1) {
          this.cart[itemIndex].quantity = 0;
          this.cart.splice(itemIndex, 1);
        } else {
          this.cart.splice(itemIndex, 1);
        }
      }
      this.saveCart();
    },
    clearCart() {
      this.cart = [];
      this.saveCart();
    },
    increaseQuantity(productId: number) {
      const item = this.cart.find((item) => item.product.id === productId);
      if (item) {
        item.quantity++;
        this.saveCart();
      }
    },
    decreaseQuantity(productId: number) {
      const item = this.cart.find((item) => item.product.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      } else if (item) {
        const itemIndex = this.cart.findIndex(
          (item) => item.product.id === productId
        );
        this.cart.splice(itemIndex, 1);
        this.saveCart();
      }
    },
    saveCart() {
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },
    loadCart() {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          this.cart = JSON.parse(storedCart);
        }
      }
    },
  },
});
