// Kwiatboxy
(() => {
  /* ---------- Link do OLX ----------
     Wklej tutaj adres profilu Emilii na OLX (albo konkretnego ogłoszenia).
     Wszystkie przyciski „OLX” na stronie użyją tego adresu. */
  const OLX_URL = 'https://www.olx.pl/';

  document.querySelectorAll('[data-olx]').forEach((a) => {
    a.href = a.dataset.olx || OLX_URL;
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu: cień po przewinięciu, chowanie przy przewijaniu w dół ---------- */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  let ticking = false;
  const parallax = reduce ? [] : [...document.querySelectorAll('[data-parallax]')];

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    nav.classList.toggle('is-hidden', y > 480 && y > lastY + 4);
    if (y < lastY - 4 || y < 480) nav.classList.remove('is-hidden');
    lastY = y;

    // Delikatny paralaksa dekoracji z kwiatów
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const speed = Number(el.dataset.parallax) || 0;
      el.style.translate = `0 ${(-(r.top) * speed).toFixed(1)}px`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Wejścia sekcji ---------- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
    return;
  }
  document.querySelectorAll('section').forEach((sec) => {
    sec.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 5) * 90}ms`));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
  reveals.forEach((el) => io.observe(el));
})();
