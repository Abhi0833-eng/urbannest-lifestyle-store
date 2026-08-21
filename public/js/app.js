/* ==========================================================================
   UrbanNest Main Application Script - Theme, Spotlight & Interface Setup
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMouseSpotlight();
  fetchProducts();

  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
});

// Interactive Mouse Spotlight Tracker
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  });
}

// Dark / Light Theme Handler
function initTheme() {
  const savedTheme = localStorage.getItem('urbannest-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const target = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('urbannest-theme', target);
  updateThemeIcon(target);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

function copyCoupon(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Copied code "${code}" to clipboard!`, 'success');
  }).catch(() => {
    showToast(`Coupon code is ${code}`, 'info');
  });
}

window.toggleTheme = toggleTheme;
window.copyCoupon = copyCoupon;
