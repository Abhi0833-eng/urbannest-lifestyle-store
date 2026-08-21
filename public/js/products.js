/* ==========================================================================
   UrbanNest Products Engine - Catalog Data, Filtering, Search & Quick View
   ========================================================================== */

let catalogProducts = [];
let currentCategory = 'all';
let searchQuery = '';

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      catalogProducts = data.data;
      renderProducts();
    }
  } catch (err) {
    console.error('Failed to load catalog products:', err);
  }
}

function renderProducts() {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  const filtered = catalogProducts.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
        <span style="font-size: 3rem;">🔍</span>
        <h3 style="margin: 1rem 0 0.5rem;">No products found</h3>
        <p style="color: var(--text-muted);">Try adjusting your category filter or search keywords.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-image-box">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';">
        <span class="product-badge">${product.tag}</span>
      </div>
      <div class="product-info">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 700; text-transform: uppercase;">
            ${product.category.replace('-', ' ')}
          </span>
          <span style="font-size: 0.85rem; font-weight: 700; color: #eab308;">
            ★ ${product.rating} <span style="color: var(--text-muted); font-weight: 400;">(${product.reviewsCount})</span>
          </span>
        </div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, element) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  renderProducts();
}

function handleSearchInput(e) {
  searchQuery = e.target.value;
  renderProducts();
}

window.fetchProducts = fetchProducts;
window.filterCategory = filterCategory;
window.handleSearchInput = handleSearchInput;
