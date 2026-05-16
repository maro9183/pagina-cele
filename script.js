/**
 * LÓGICA DE LA PÁGINA — CELESTE IRISARRI
 */

// MODALES: Datos de las tarjetas
const modales = [
  {
    tag: 'Previsional',
    titulo: 'Planificá tu jubilación<br/><em>varios años antes</em>',
    cuerpo: 'La jubilación no se gestiona de un día para el otro. Planificar con anticipación puede marcar la diferencia entre acceder a tiempo a tu beneficio o perder años de cobro. Te orientamos según tu historial laboral, aportes y opciones disponibles.',
    lista: ['Análisis de tu historial de aportes ante ANSES','Opciones con moratorias vigentes','Planificación de tiempos y estrategia para el trámite','Asesoramiento sobre regímenes especiales si aplica','Acompañamiento desde el inicio hasta el cobro']
  },
  {
    tag: 'Reajuste de haberes',
    titulo: '¿Tu jubilación está<br/><em>mal calculada?</em>',
    cuerpo: 'Muchos jubilados cobran menos de lo que les corresponde porque su haber fue mal calculado al otorgarse o porque los ajustes posteriores no fueron aplicados correctamente. Esto tiene solución judicial.',
    lista: ['Revisamos el cálculo original de tu beneficio','Determinamos si existe diferencia reclamable','Iniciamos juicio de reajuste ante la justicia federal','Reclamamos retroactivos desde el inicio de la mora','Ejecutamos la sentencia para que cobres efectivamente']
  },
  {
    tag: 'Acceso a la salud',
    titulo: '¿Tu obra social o prepaga<br/><em>rechaza tu cobertura?</em>',
    cuerpo: 'La negativa, demora o prestación defectuosa de cobertura médica viola tus derechos. Ante una denegatoria, existe una herramienta jurídica rápida y efectiva: la acción de amparo.',
    lista: ['Medicamentos de alto costo no cubiertos','Tratamientos rechazados sin fundamento','Internaciones o cirugías demoradas','Prestaciones para personas con discapacidad','Cualquier servicio que no te brindan en tiempo y forma']
  },
  {
    tag: 'Discapacidad · CUD',
    titulo: 'Si tenés CUD,<br/><em>tenés que saber esto</em>',
    cuerpo: 'El Certificado Único de Discapacidad (CUD) te da acceso a un conjunto de derechos que muchas veces las obras sociales y prepagas no reconocen espontáneamente. Conocerlos es el primer paso para exigirlos.',
    lista: ['Cobertura del 100% en medicamentos para tu patología','Prestaciones de rehabilitación y apoyo','Educación especial y estimulación temprana','Transporte y traslados para tratamientos','Pensión por invalidez si no podés trabajar']
  },
  {
    tag: 'Pensiones',
    titulo: 'Pensión por fallecimiento<br/>o <em>discapacidad</em>',
    cuerpo: 'Si perdiste a un familiar que estaba en actividad o jubilado, o si una discapacidad te impide trabajar, podés tener derecho a una pensión. Te orientamos y gestionamos el beneficio.',
    lista: ['Pensión por fallecimiento del cónyuge o conviviente','Pensión para hijos con discapacidad','Pensión por invalidez laboral','Evaluación de requisitos y documentación','Gestión ante ANSES y representación judicial si es necesario']
  },
  {
    tag: 'Ejecución de sentencia',
    titulo: 'Tenés sentencia favorable:<br/><em>¿y ahora qué?</em>',
    cuerpo: 'Ganar un juicio es el primer paso. Cobrar lo que te corresponde puede requerir una etapa de ejecución con sus propias complejidades. Te acompañamos hasta el final del proceso.',
    lista: ['Liquidación de los montos correspondientes','Notificación e intimación al organismo deudor','Seguimiento de los plazos de pago','Acciones ante incumplimientos de la sentencia','Sin honorarios hasta que cobres vos']
  }
];

// FUNCIONES DEL MODAL
function abrirModal(idx) {
  const m = modales[idx];
  const overlay = document.getElementById('modal-overlay');
  
  document.getElementById('modal-tag').textContent = m.tag;
  document.getElementById('modal-titulo').innerHTML = m.titulo;
  document.getElementById('modal-cuerpo').textContent = m.cuerpo;
  document.getElementById('modal-lista').innerHTML = m.lista.map(i=>`<li>${i}</li>`).join('');
  
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Trap focus (accesibilidad)
  overlay.querySelector('.modal-cerrar').focus();
}

function cerrarModal(e, forzar) {
  const overlay = document.getElementById('modal-overlay');
  if (forzar || (e && e.target === overlay)) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// CERRAR MODAL CON ESCAPE
document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') {
    cerrarModal(null, true);
    if (document.querySelector('.nav-links').classList.contains('active')) {
      toggleMobileMenu();
    }
  }
});

// MENU HAMBURGUESA
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');

function toggleMobileMenu() {
  navLinks.classList.toggle('active');
  const isOpen = navLinks.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  
  // Cambiar icono
  menuToggle.innerHTML = isOpen 
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Cerrar menu al clickear un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) toggleMobileMenu();
  });
});

// CARRUSEL
// ⏱️ Cambiá este valor para modificar el tiempo entre slides (en milisegundos)
const CARRUSEL_INTERVALO_MS = 4000; // 8000 = 8 segundos

const track = document.getElementById('carrusel-track');
const slides = track.querySelectorAll('.carrusel-slide');
const dotsContainer = document.getElementById('carrusel-dots');
const progressBar = document.getElementById('progress-bar');
const total = slides.length;
let current = 0;
let autoTimer;
let startX, moveX;
let isDragging = false;

function visiblesCount() {
  return window.innerWidth <= 900 ? 1 : 3;
}

// Crear dots dinámicamente según la cantidad de posiciones reales
function crearDots() {
  dotsContainer.innerHTML = '';
  const vis = visiblesCount();
  const posiciones = total - vis + 1; // Desktop: 4, Mobile: 6
  for (let i = 0; i < posiciones; i++) {
    const d = document.createElement('button');
    d.className = 'carrusel-dot' + (i === current ? ' active' : '');
    d.setAttribute('aria-label', 'Ver tema ' + (i + 1));
    d.onclick = () => irA(i);
    dotsContainer.appendChild(d);
  }
}
crearDots();

function irA(n) {
  const vis = visiblesCount();
  const max = total - vis;
  current = Math.max(0, Math.min(n, max));
  
  const slideW = track.parentElement.offsetWidth / vis;
  track.style.transform = `translateX(-${current * slideW}px)`;
  
  // Actualizar dots
  dotsContainer.querySelectorAll('.carrusel-dot').forEach((d,i) => {
    d.classList.toggle('active', i === current);
  });
  
  reiniciarProgress();
}

function reiniciarProgress() {
  const segundos = CARRUSEL_INTERVALO_MS / 1000;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  
  // Forzar reflow
  progressBar.offsetHeight; 
  
  progressBar.style.transition = `width ${segundos}s linear`;
  progressBar.style.width = '100%';
  
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    const vis = visiblesCount();
    const max = total - vis;
    irA(current >= max ? 0 : current + 1);
  }, CARRUSEL_INTERVALO_MS);
}

// TOUCH SUPPORT PARA CARRUSEL
track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
  clearTimeout(autoTimer);
}, { passive: true });

track.addEventListener('touchmove', e => {
  if (!isDragging) return;
  moveX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', () => {
  if (!isDragging) return;
  const diff = startX - moveX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) document.getElementById('btn-next').click();
    else document.getElementById('btn-prev').click();
  }
  isDragging = false;
  reiniciarProgress();
});

// CONTROLES
document.getElementById('btn-next').onclick = () => {
  const vis = visiblesCount(); const max = total - vis;
  irA(current >= max ? 0 : current + 1);
};
document.getElementById('btn-prev').onclick = () => {
  const vis = visiblesCount(); const max = total - vis;
  irA(current <= 0 ? max : current - 1);
};

// PAUSA AUTOPLAY AL HOVER O VISIBILIDAD
track.addEventListener('mouseenter', () => clearTimeout(autoTimer));
track.addEventListener('mouseleave', () => reiniciarProgress());

document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearTimeout(autoTimer);
  else reiniciarProgress();
});

// RESPONSIVE RESIZE — recrea dots al cambiar de vista
let resizeTimer;
let lastVis = visiblesCount();
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newVis = visiblesCount();
    if (newVis !== lastVis) {
      lastVis = newVis;
      crearDots();
    }
    irA(current);
  }, 100);
});

// SCROLL REVEAL (Intersection Observer)
const revealOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('visible'); 
      observer.unobserve(e.target); 
    } 
  });
}, revealOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// NAV SHADOW & SCROLL PERF
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const nav = document.getElementById('main-nav');
      if (window.scrollY > 40) {
        nav.style.boxShadow = '0 1px 24px rgba(44,36,32,0.07)';
        nav.style.padding = '1rem 4rem';
      } else {
        nav.style.boxShadow = 'none';
        nav.style.padding = '1.4rem 4rem';
      }
      
      // Ajuste para mobile padding
      if (window.innerWidth <= 900) {
        nav.style.padding = window.scrollY > 40 ? '0.8rem 2rem' : '1.2rem 2rem';
      }
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// FORMULARIO DESACOPLADO
async function enviarFormulario(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const originalText = btn.textContent;
  
  // 1. Capturar datos
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  console.log('Datos capturados para envío:', data);
  
  // 2. Feedback visual inmediato
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // ... (bloque de fetch comentado omitido para brevedad) ...
  
  // SIMULACIÓN
  setTimeout(() => {
    btn.textContent = '¡Consulta recibida!';
    btn.style.background = 'var(--acento)';
    form.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1000);
}

// LÓGICA WHATSAPP DESDE FORMULARIO
function enviarWhatsAppForm(e) {
  e.preventDefault();
  const form = document.getElementById('form-contacto');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.nombre || !data.telefono) {
    alert('Por favor, completá al menos tu nombre y teléfono.');
    return;
  }

  // Armar el mensaje elegante
  const mensaje = `Hola Celeste! 👋 
Mi nombre es ${data.nombre} ${data.apellido || ''}. 
Mi teléfono es: ${data.telefono}. 

Asunto: ${data.tema || 'Consulta General'}
Consulta: ${data.mensaje || 'Sin mensaje adicional'}.`;

  const url = `https://wa.me/5492216238900?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  reiniciarProgress();
  
  // Actualizar año footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
});
