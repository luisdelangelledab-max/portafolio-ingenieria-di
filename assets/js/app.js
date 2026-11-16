/**
 * PORTAFOLIO DIGITAL B2B — APP.JS
 * Lógica interactiva: Filtrado, Modales de Casos de Estudio, Visor PDF,
 * Control Deslizante de Comparación de Imágenes y Copia al Portapapeles.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFiltering();
  initModals();
  initImageSlider();
  initSmoothScroll();
});

// 1. Filtrado de Proyectos por Categoría
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  const countIndicator = document.getElementById('visible-count');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      let visible = 0;

      caseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countIndicator) {
        countIndicator.textContent = `Mostrando ${visible} de ${caseCards.length} casos`;
      }
    });
  });
}

// 2. Sistema de Ventanas Modales (Casos de Estudio y Visor PDF)
function initModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtns = document.querySelectorAll('[data-modal-close]');

  // Abrir modal de caso
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal && backdrop) {
        // Ocultar todos los diálogos abiertos primero
        document.querySelectorAll('.modal-dialog').forEach(d => d.style.display = 'none');
        targetModal.style.display = 'flex';
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Cerrar modal
  const closeModal = () => {
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      // Limpiar iframe PDF para pausar descargas en segundo plano
      const pdfFrame = document.getElementById('pdf-frame');
      if (pdfFrame) pdfFrame.src = 'about:blank';
    }
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

// 3. Función global para abrir el Visor de Planos PDF
window.openPdfViewer = function(pdfUrl, pdfTitle) {
  const backdrop = document.getElementById('modal-backdrop');
  const pdfModal = document.getElementById('pdf-viewer-modal');
  const pdfFrame = document.getElementById('pdf-frame');
  const pdfTitleEl = document.getElementById('pdf-modal-title');
  const pdfDownloadBtn = document.getElementById('pdf-download-btn');

  if (pdfModal && backdrop && pdfFrame) {
    document.querySelectorAll('.modal-dialog').forEach(d => d.style.display = 'none');
    pdfFrame.src = pdfUrl;
    if (pdfTitleEl) pdfTitleEl.textContent = pdfTitle || 'Plano de Taller Vectorial';
    if (pdfDownloadBtn) pdfDownloadBtn.href = pdfUrl;

    pdfModal.style.display = 'flex';
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

// 4. Control Deslizante de Comparación de Imágenes (Render vs Plano)
function initImageSlider() {
  const container = document.getElementById('comparison-slider');
  const overlay = document.getElementById('comparison-overlay');
  const handle = document.getElementById('comparison-handle');

  if (!container || !overlay || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  const startDrag = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  const stopDrag = () => {
    isDragging = false;
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX) updateSlider(clientX);
  };

  handle.addEventListener('mousedown', startDrag);
  container.addEventListener('mousedown', (e) => {
    startDrag(e);
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  // Soporte táctil móvil
  handle.addEventListener('touchstart', startDrag, { passive: false });
  container.addEventListener('touchstart', (e) => {
    startDrag(e);
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: false });

  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
}

// 5. Copia Rápida de Correo Electrónico al Portapapeles con Toast
window.copyContactEmail = function(emailStr) {
  navigator.clipboard.writeText(emailStr).then(() => {
    const toast = document.getElementById('toast-notification');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }
  }).catch(() => {
    window.location.href = `mailto:${emailStr}`;
  });
};

// 6. Desplazamiento Suave de Enlaces
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}