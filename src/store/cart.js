import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isCartOpen: false
  }),

  getters: {
    totalItems: (state) => state.items.length,
    
    totalAmount: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.giaSp * item.quantity);
      }, 0);
    },

    cartItems: (state) => state.items
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          ...product,
          quantity: 1
        });
      }

      // Lưu giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          localStorage.setItem('cart', JSON.stringify(this.items));
        }
      }
    },

    clearCart() {
      this.items = [];
      localStorage.removeItem('cart');
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },

    initializeCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    }
  }
}); 