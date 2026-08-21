/* ==========================================================================
   UrbanNest Customer Query Form - N8N Integration Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const queryForm = document.getElementById('customerQueryForm');
  if (queryForm) {
    queryForm.addEventListener('submit', handleQueryFormSubmit);
  }
});

async function handleQueryFormSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('querySubmitBtn');
  const originalText = submitBtn.innerHTML;

  const name = document.getElementById('qName').value.trim();
  const email = document.getElementById('qEmail').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const category = document.getElementById('qCategory').value;
  const message = document.getElementById('qMessage').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill out all required fields.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Submitting to N8N...';

  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, category, message })
    });

    const data = await res.json();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    if (data.success) {
      document.getElementById('customerQueryForm').reset();
      showQuerySuccessModal(data.trackingId, data.message);
      showToast('Query submitted successfully to N8N!', 'success');
    } else {
      showToast(data.message || 'Submission failed.', 'error');
    }
  } catch (err) {
    console.error('Query Submission Error:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    showToast('Failed to submit query. Please try again.', 'error');
  }
}

function showQuerySuccessModal(trackingId, msg) {
  const modal = document.createElement('div');
  modal.className = 'cart-drawer-overlay open';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.innerHTML = `
    <div style="background: var(--bg-surface); padding: 2.5rem; border-radius: var(--radius-lg); max-width: 480px; width: 90%; text-align: center; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);">
      <div style="font-size: 3.5rem; margin-bottom: 1rem;">✅</div>
      <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Query Received!</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${msg}</p>
      
      <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; border: 1px dashed var(--accent-primary);">
        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">N8N Tracking Reference</span>
        <h4 style="color: var(--accent-primary); font-size: 1.4rem; font-family: monospace;">${trackingId}</h4>
      </div>

      <button class="btn btn-primary" onclick="this.closest('.cart-drawer-overlay').remove()">
        Done & Continue Shopping
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✨' : 'ℹ️'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.showToast = showToast;
