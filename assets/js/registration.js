// Paste your deployed Google Apps Script Web App URL here.
// Deploy: script.google.com → Deploy → New deployment → Web app → Execute as: Me → Anyone
const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/paloaltonetworks.com/s/AKfycbzq4TVyn_nE0Fyu93qIRxwxQ7fIV_lv6RF15gLq8fiKDY1n2grPkFLJxZQ6EpQ4mGRJ/exec';

const form = document.getElementById('registration-form');
const errorMsg = document.getElementById('form-error');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying…';

  const name  = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();

  // Validation temporarily disabled — all registrants are allowed through
  sessionStorage.setItem('registeredName', name);
  window.location.href = 'menu.html';
});

function reset() {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Continue';
}
