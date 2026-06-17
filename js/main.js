// Fekra Shop - Main Layout & UI Controller (ES Module)
import { getCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } from './cart-helper.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initCartDrawer();
  initMobileMenu();
  updateHeaderCartCount();
});

// 1. Navbar Scroll Effect
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'var(--color-black)';
        navMenu.style.borderBottom = '1px solid var(--color-border)';
        navMenu.style.padding = '20px';
        navMenu.style.zIndex = '999';
      }
    });
  }
}

// 3. Cart Drawer Functionality
function initCartDrawer() {
  const cartIcon = document.getElementById('cart-icon-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-drawer-close');

  if (!cartDrawer || !cartOverlay) return;

  // Toggle drawer open
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Close drawer
  const closeDrawer = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  };

  if (cartClose) cartClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  // Listen to cart update event
  window.addEventListener('cartUpdated', () => {
    updateHeaderCartCount();
    renderCartDrawerItems();
  });

  // Initial render inside drawer
  renderCartDrawerItems();
}

export function openCartDrawer() {
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    renderCartDrawerItems();
  }
}

// 4. Update Cart Badge Count in Header
function updateHeaderCartCount() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    if (count === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }
}

// 5. Render Cart Items inside Drawer
function renderCartDrawerItems() {
  const container = document.getElementById('cart-drawer-items');
  const totalPriceEl = document.getElementById('cart-drawer-total');
  const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-message">
        <svg style="width: 48px; height: 48px; fill: var(--color-border); margin-bottom: 15px;" viewBox="0 0 24 24">
          <path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.44-.83-.44-.32 0-.64.16-.83.44L6.79 9H2c-1.1 0-2 .9-2 2v2c0 .55.45 1 1 1h.09l1.97 8.22c.21.86 1 1.48 1.94 1.48h14c.94 0 1.73-.62 1.94-1.48L20.91 14h.09c.55 0 1-.45 1-1v-2c0-1.1-.9-2-2-2h-2.79zM9 9l3-4.5L15 9H9zm10 5.12L17.58 20H6.42L5 14.12h14zM12 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <p>سلتك فارغة حالياً</p>
      </div>
    `;
    if (totalPriceEl) totalPriceEl.textContent = '0.00';
    if (checkoutBtn) {
      checkoutBtn.classList.add('btn-disabled');
      checkoutBtn.removeAttribute('href');
    }
    return;
  }

  // Cart has items
  container.innerHTML = '';
  cart.forEach(item => {
    const card = document.createElement('div');
    card.className = 'cart-item-card';
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <a href="product.html?id=${item.id}" class="cart-item-title">${item.title}</a>
        <div class="cart-item-price-row">
          <span class="cart-item-price price">${(item.price * item.quantity).toFixed(2)} EGP</span>
          
          <div class="quantity-control">
            <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
          
          <button class="cart-item-remove-btn" data-id="${item.id}" style="cursor:pointer; color:var(--text-muted); background:none; border:none;">
            <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Update total price
  if (totalPriceEl) {
    totalPriceEl.textContent = getCartTotal().toFixed(2);
  }

  if (checkoutBtn) {
    checkoutBtn.classList.remove('btn-disabled');
    checkoutBtn.setAttribute('href', 'checkout.html');
  }

  // Setup Event Listeners inside drawer
  setupDrawerListeners(container);
}

function setupDrawerListeners(container) {
  // Decrement button
  container.querySelectorAll('.dec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cart = getCart();
      const item = cart.find(item => item.id === id);
      if (item) {
        updateQuantity(id, item.quantity - 1);
      }
    });
  });

  // Increment button
  container.querySelectorAll('.inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cart = getCart();
      const item = cart.find(item => item.id === id);
      if (item) {
        updateQuantity(id, item.quantity + 1);
      }
    });
  });

  // Delete button
  container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
    });
  });
}
