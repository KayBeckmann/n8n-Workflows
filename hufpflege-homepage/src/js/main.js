// ============================================================
// KONFIGURATION
// ============================================================

// n8n-Webhook-URL hier eintragen (nach Erstellen des Workflows)
const N8N_WEBHOOK_URL = 'DEINE_N8N_WEBHOOK_URL_HIER_EINTRAGEN';

// ============================================================
// NAVIGATION – Mobile Toggle
// ============================================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Menü schließen bei Link-Klick
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// FOOTER – Aktuelles Jahr
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// FORMULAR – Validierung & Einreichung
// ============================================================
const form       = document.getElementById('booking-form');
const statusEl   = document.getElementById('form-status');
const submitBtn  = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('', '');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet …';

    const payload = buildPayload();

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus(
        'success',
        'Vielen Dank! Deine Terminanfrage ist eingegangen. Ich melde mich schnellstmöglich bei dir.'
      );
      form.reset();

    } catch (err) {
      console.error('Fehler beim Senden:', err);
      setStatus(
        'error',
        'Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere mich direkt per E-Mail.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Terminanfrage absenden';
    }
  });
}

// ============================================================
// HILFSFUNKTIONEN
// ============================================================

function buildPayload() {
  const data = new FormData(form);

  // Mehrfach-Checkboxen (Tierart) als Array sammeln
  const tierarten = Array.from(
    form.querySelectorAll('input[name="tierart"]:checked')
  ).map(cb => cb.value);

  return {
    vorname:  data.get('vorname')?.trim(),
    nachname: data.get('nachname')?.trim(),
    email:    data.get('email')?.trim(),
    telefon:  data.get('telefon')?.trim() || null,
    plz:      data.get('plz')?.trim(),
    ort:      data.get('ort')?.trim(),
    tierarten,
    anzahl:   parseInt(data.get('anzahl'), 10),
    zeitraum: data.get('zeitraum')?.trim() || null,
    nachricht: data.get('nachricht')?.trim() || null,
  };
}

function validateForm() {
  let valid = true;

  // Pflichtfelder zurücksetzen
  form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));

  // Textfelder
  ['vorname', 'nachname', 'email', 'plz', 'ort', 'anzahl'].forEach(name => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el || !el.value.trim()) {
      el?.classList.add('invalid');
      valid = false;
    }
  });

  // PLZ-Format (5 Ziffern)
  const plzEl = form.querySelector('[name="plz"]');
  if (plzEl && !/^\d{5}$/.test(plzEl.value.trim())) {
    plzEl.classList.add('invalid');
    valid = false;
  }

  // E-Mail-Format
  const emailEl = form.querySelector('[name="email"]');
  if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    emailEl.classList.add('invalid');
    valid = false;
  }

  // Mindestens eine Tierart ausgewählt
  const tierarten = form.querySelectorAll('input[name="tierart"]:checked');
  if (tierarten.length === 0) {
    valid = false;
    setStatus('error', 'Bitte wähle mindestens eine Tierart aus.');
    return false;
  }

  // Datenschutz-Checkbox
  const datenschutz = form.querySelector('[name="datenschutz"]');
  if (!datenschutz?.checked) {
    valid = false;
    setStatus('error', 'Bitte stimme der Datenschutzerklärung zu.');
    return false;
  }

  if (!valid) {
    setStatus('error', 'Bitte fülle alle Pflichtfelder korrekt aus.');
  }

  return valid;
}

function setStatus(type, message) {
  if (!statusEl) return;
  statusEl.className = 'form-status';
  statusEl.textContent = message;
  if (type) {
    statusEl.classList.add(type);
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
