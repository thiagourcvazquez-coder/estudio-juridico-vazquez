// ─────────────────────────────────────────────────────────
//  EMAILJS CONFIG
//  1. Crear cuenta en https://www.emailjs.com (gratis)
//  2. Crear un "Email Service" conectado al Gmail → copiar Service ID
//  3. Crear un "Email Template" con variables: {{nombre}}, {{email}},
//     {{telefono}}, {{asunto}}, {{mensaje}} → copiar Template ID
//  4. Copiar tu Public Key (Account → API Keys)
//  5. Reemplazar los tres valores de abajo
// ─────────────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';   // ← reemplazar
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';   // ← reemplazar
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';  // ← reemplazar

// Mensaje genérico WhatsApp (el flotante y el botón inline ya lo tienen en el href)
// Si querés cambiarlo en un solo lugar, podés generarlo acá:
// const WPP_MSG = encodeURIComponent('Hola, me comunico desde el sitio web y quisiera obtener información sobre sus servicios legales. Muchas gracias.');

// ─────────────────────────────────────────────────────────
//  FORMULARIO DE CONTACTO
// ─────────────────────────────────────────────────────────
function enviarFormulario() {
  const nombre   = document.getElementById('cf-nombre').value.trim();
  const email    = document.getElementById('cf-email').value.trim();
  const telefono = document.getElementById('cf-telefono').value.trim();
  const asunto   = document.getElementById('cf-asunto').value;
  const mensaje  = document.getElementById('cf-mensaje').value.trim();

  // Validación básica
  if (!nombre || !email || !mensaje) {
    alert('Por favor completá los campos obligatorios (Nombre, Email y Mensaje).');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Por favor ingresá un email válido.');
    return;
  }

  const btn     = document.getElementById('btn-enviar');
  const btnText = document.getElementById('btn-text');
  btn.disabled  = true;
  btnText.textContent = 'Enviando…';

  // Inicializar EmailJS y enviar
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    nombre, email, telefono: telefono || '—',
    asunto:  asunto || 'Consulta general',
    mensaje
  }).then(() => {
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('form-error').style.display   = 'none';
    document.getElementById('consultaForm').style.opacity = '0.4';
    document.getElementById('consultaForm').style.pointerEvents = 'none';
    btn.disabled = false;
    btnText.textContent = 'Enviado ✓';
  }).catch((err) => {
    console.error('EmailJS error:', err);
    document.getElementById('form-error').style.display   = 'block';
    document.getElementById('form-success').style.display = 'none';
    btn.disabled  = false;
    btnText.textContent = 'Enviar Consulta';
  });
}

// ─────────────────────────────────────────────────────────
//  NOVEDADES PÚBLICAS — lee desde storage compartido
// ─────────────────────────────────────────────────────────
async function cargarNovedades() {
  const grid = document.getElementById('novedades-grid');
  if (!grid) return;

  try {
    const r = await window.storage.get('novedades', true);
    const data = r ? JSON.parse(r.value) : {};
    const lista = Object.values(data).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (lista.length === 0) {
      grid.innerHTML = '<div class="novedades-empty">No hay novedades publicadas por el momento.</div>';
      return;
    }

    grid.innerHTML = lista.map(n => {
      const fecha = new Date(n.fecha).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      const imgHtml = n.imagen
        ? `<img class="nov-pub-card-img" src="${n.imagen}" alt="${n.titulo}"/>`
        : '';
      return `
        <article class="nov-pub-card">
          ${imgHtml}
          <div class="nov-pub-card-body">
            <div class="nov-pub-cat">${n.categoria}</div>
            <h3 class="nov-pub-titulo">${n.titulo}</h3>
            <p class="nov-pub-texto">${n.texto}</p>
            <div class="nov-pub-fecha">${fecha}</div>
          </div>
        </article>
      `;
    }).join('');
  } catch {
    grid.innerHTML = '<div class="novedades-empty">No hay novedades publicadas por el momento.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNovedades();
});