/* ==========================================================================
   UrbanNest Shopping Cart & Interactive Checkout Drawer
   ========================================================================== */

let cart = [];
let appliedDiscount = 0;

function toggleCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (overlay && drawer) {
    overlay.classList.toggle('open');
    drawer.classList.toggle('open');
  }
}

function addToCart(productId) {
  const product = catalogProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  toggleCartDrawer();
  showToast(`Added ${product.name} to your cart!`, 'success');
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadgeCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const freeShippingBar = document.getElementById('freeShippingBar');

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  if (cartBadge) cartBadge.textContent = totalCount;

  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <span style="font-size: 3rem;">🛒</span>
        <h4 style="margin: 1rem 0 0.5rem;">Your cart is empty</h4>
        <p style="font-size: 0.85rem;">Discover our lifestyle collections to add items.</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
    if (cartTotalEl) cartTotalEl.textContent = '$0.00';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  // Free shipping bar logic ($50 threshold)
  if (freeShippingBar) {
    const remaining = Math.max(0, 50 - subtotal);
    const percentage = Math.min(100, (subtotal / 50) * 100);
    freeShippingBar.innerHTML = remaining === 0 
      ? `🎉 You've unlocked <strong>Free Standard Shipping</strong>!`
      : `Add <strong>$${remaining.toFixed(2)}</strong> more for FREE Shipping! <div style="height:4px; background:var(--border-subtle); border-radius:2px; margin-top:4px;"><div style="width:${percentage}%; height:100%; background:var(--accent-secondary); border-radius:2px;"></div></div>`;
  }

  cartItemsList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div style="flex: 1;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem;">${item.name}</h4>
        <div style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 700; margin-bottom: 0.5rem;">
          $${item.price.toFixed(2)}
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem;" onclick="updateCartQuantity(${item.id}, -1)">-</button>
          <span style="font-weight: 700; font-size: 0.9rem;">${item.quantity}</span>
          <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem;" onclick="updateCartQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button style="background: none; border: none; cursor: pointer; color: var(--text-muted);" onclick="updateCartQuantity(${item.id}, -${item.quantity})">
        🗑️
      </button>
    </div>
  `).join('');

  if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

function applyCouponCode() {
  const codeInput = document.getElementById('couponInput');
  const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

  if (code === 'URBAN10') {
    appliedDiscount = 0.10;
    updateCartUI();
    showToast('Coupon URBAN10 applied! 10% Discount unlocked.', 'success');
  } else {
    showToast('Invalid coupon code. Try URBAN10', 'error');
  }
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  showToast('Simulating Express Checkout...', 'info');
  setTimeout(() => {
    cart = [];
    appliedDiscount = 0;
    updateCartUI();
    toggleCartDrawer();
    showQuerySuccessModal('ORD-' + Math.floor(100000 + Math.random() * 900000), 'Thank you for your simulated order! Our UrbanNest shop team will pack it with care.');
  }, 1000);
}

window.toggleCartDrawer = toggleCartDrawer;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.applyCouponCode = applyCouponCode;
window.checkoutCart = checkoutCart;
