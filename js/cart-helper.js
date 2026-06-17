// Fekra Shop - Shopping Cart Helper (ES Module)

const CART_STORAGE_KEY = 'fekra_shop_cart';

/**
 * Get current cart items from LocalStorage
 * @returns {Array}
 */
export function getCart() {
  const cartData = localStorage.getItem(CART_STORAGE_KEY);
  return cartData ? JSON.parse(cartData) : [];
}

/**
 * Save cart items to LocalStorage and dispatch global update event
 * @param {Array} cart 
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  // Dispatch custom event to notify other scripts of cart change
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

/**
 * Add a product to the cart
 * @param {Object} product - Product data { id, title, price, image, category }
 * @param {number} qty - Quantity to add
 */
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      quantity: qty
    });
  }

  saveCart(cart);
  showToast(`تم إضافة "${product.title}" إلى السلة`);
}

/**
 * Remove an item from the cart by its ID
 * @param {string} productId 
 */
export function removeFromCart(productId) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  if (item) {
    showToast(`تم إزالة "${item.title}" من السلة`, 'error');
  }
}

/**
 * Update the quantity of a specific product in the cart
 * @param {string} productId 
 * @param {number} qty 
 */
export function updateQuantity(productId, qty) {
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity = qty;
    saveCart(cart);
  }
}

/**
 * Clear the entire cart
 */
export function clearCart() {
  saveCart([]);
}

/**
 * Calculate the total price of all items in the cart
 * @returns {number}
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get total item count in the cart
 * @returns {number}
 */
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Shows a beautiful toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}
