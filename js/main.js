/**
 * Adobe Ingeniería — main.js
 * Lógica interactiva de la landing page
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Año dinámico en footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Navbar: fondo al hacer scroll ── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });

  /* ── Lazy loading de videos (IntersectionObserver) ── */
  const videoObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const video = e.target;
        // Cargar src solo cuando el video entra en viewport
        video.querySelectorAll('source[data-src]').forEach(source => {
          source.src = source.dataset.src;
        });
        video.load();
        video.play().catch(() => {}); // ignorar rechazo por política del navegador
        videoObserver.unobserve(video);
      }
    }),
    { rootMargin: '200px 0px' }
  );
  document.querySelectorAll('video[data-lazy]').forEach(v => videoObserver.observe(v));

  /* ── Formulario → WhatsApp ── */
  const sendBtn = document.getElementById('sendForm');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const nom = document.getElementById('f-nom')?.value.trim() || '-';
      const tel = document.getElementById('f-tel')?.value.trim() || '-';
      const srv = document.getElementById('f-srv')?.value || '-';
      const msg = document.getElementById('f-msg')?.value.trim() || '-';

      const texto =
        'Hola Adobe Ingeniería, vi su página web y quisiera solicitar un presupuesto.\n\n' +
        'Nombre: '   + nom + '\n' +
        'Teléfono: ' + tel + '\n' +
        'Servicio: ' + srv + '\n' +
        'Mensaje: '  + msg;

      window.open(
        'https://wa.me/5493875739888?text=' + encodeURIComponent(texto),
        '_blank'
      );
    });
  }

});
