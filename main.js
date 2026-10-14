// Emilia — kwiatowe boxy
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Okazy w hero ---------- */
  const boxes = [
    { name: 'Len i koronka', tint: 'jute', img: 'assets/img/box-len-i-koronka.jpg',
      fact: 'Kremowy welur, juta z koronką, róże i chryzantemy · Ø 18 cm',
      alt: 'Box „Len i koronka”: kremowe welurowe pudełko z jutową kokardą, różowe róże i fioletowe chryzantemy' },
    { name: 'Pudrowy róż', tint: 'blush', img: 'assets/img/box-pudrowy-roz.jpg',
      fact: 'Różowy welur, lilie, róże i brzoskwiniowe chryzantemy · Ø 18 cm',
      alt: 'Box „Pudrowy róż” w różowym welurowym pudełku z liliami i różami' },
    { name: 'Wrzos', tint: 'heather', img: 'assets/img/box-wrzos.jpg',
      fact: 'Kremowy welur, ranunkulusy i wrzosowe liście · Ø 20 cm',
      alt: 'Box „Wrzos” z ranunkulusami i wrzosowymi liśćmi w kremowym pudełku' },
    { name: 'Brzoskwinia', tint: 'blush', img: 'assets/img/box-brzoskwinia.jpg',
      fact: 'Kremowy welur, róże, pompony i jagody eukaliptusa · Ø 18 cm',
      alt: 'Box „Brzoskwinia” z różami, pomponami i jagodami eukaliptusa' },
    { name: 'Oliwka', tint: 'sage', img: 'assets/img/box-oliwka.jpg',
      fact: 'Kremowy welur, liście oliwki, sukulent i juta z koronką · Ø 18 cm',
      alt: 'Box „Oliwka” z liśćmi oliwki, fioletowym sukulentem i jutową kokardą' },
  ];
  boxes.forEach((b) => { const i = new Image(); i.src = b.img; });

  const tile = document.querySelector('.specimen');
  const imgs = tile ? tile.querySelectorAll('.specimen-img') : [];
  const fact = document.querySelector('.specimen-fact');
  const buttons = [...document.querySelectorAll('.specimen-names button')];
  let current = 0;
  let front = 0;
  let timer = null;
  let userChose = false;

  function markDistance() {
    buttons.forEach((btn, i) => {
      const d = Math.abs(i - current);
      btn.dataset.d = String(d);
      btn.setAttribute('aria-pressed', d === 0 ? 'true' : 'false');
    });
  }

  function show(index) {
    if (index === current || !tile) return;
    current = index;
    const box = boxes[index];
    const next = imgs[1 - front];
    const prev = imgs[front];
    next.src = box.img;
    next.alt = box.alt;
    next.removeAttribute('aria-hidden');
    prev.alt = '';
    prev.setAttribute('aria-hidden', 'true');
    next.classList.add('is-on');
    prev.classList.remove('is-on');
    front = 1 - front;
    tile.dataset.tint = box.tint;
    fact.textContent = box.fact;
    markDistance();
    setBoxName(box.name);
  }

  // Nazwa wybranego boxa trafia na paragon i do kuponu
  const rName = document.querySelector('[data-r-name]');
  function setBoxName(name) { if (rName) rName.textContent = name; }

  buttons.forEach((btn, i) => btn.addEventListener('click', () => {
    userChose = true;
    stop();
    show(i);
  }));
  markDistance();

  // Sygnatura: powolne przenikanie okazów, dopóki ktoś nie wybierze sam
  function start() {
    if (reduce || userChose || timer) return;
    timer = setInterval(() => show((current + 1) % boxes.length), 5600);
  }
  function stop() { clearInterval(timer); timer = null; }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if (tile && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(tile);
  } else {
    start();
  }

  /* ---------- Paragon ---------- */
  const form = document.getElementById('options');
  const zl = (n) => `${n} zł`;
  function receipt() {
    if (!form) return;
    const size = form.querySelector('input[name="size"]:checked');
    const box = form.querySelector('input[name="box"]:checked');
    let total = Number(size.dataset.price);
    document.querySelector('[data-r-size]').textContent = size.dataset.label;
    document.querySelector('[data-r-size-p]').textContent = zl(size.dataset.price);
    document.querySelector('[data-r-box]').textContent = box.dataset.label;
    form.querySelectorAll('input[name="extra"]').forEach((x) => {
      const row = document.querySelector(`[data-r-extra="${x.value}"]`);
      row.hidden = !x.checked;
      if (x.checked) total += Number(x.dataset.price);
    });
    const t = document.querySelector('[data-r-total]');
    if (t.textContent !== zl(total)) {
      t.textContent = zl(total);
      if (!reduce) { t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump'); }
    }
    return total;
  }
  form && form.addEventListener('change', receipt);
  receipt();

  function summary() {
    const size = form.querySelector('input[name="size"]:checked').dataset.label;
    const box = form.querySelector('input[name="box"]:checked').dataset.label;
    const extras = [...form.querySelectorAll('input[name="extra"]:checked')].map((x) => x.dataset.label.toLowerCase());
    return `${boxes[current].name}, ${size.charAt(0).toLowerCase() + size.slice(1)}, ${box.toLowerCase()}${extras.length ? ', ' + extras.join(', ') : ''} (${receipt()} zł)`;
  }

  const fBox = document.getElementById('f-box');
  document.querySelector('[data-order-current]')?.addEventListener('click', () => {
    if (fBox) fBox.value = `${boxes[current].name}`;
  });
  document.querySelector('[data-order-receipt]')?.addEventListener('click', () => {
    if (fBox) fBox.value = summary();
  });

  /* ---------- Kupon → e-mail ---------- */
  const coupon = document.getElementById('coupon');
  coupon?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (id) => document.getElementById(id).value.trim();
    const body = [
      'Dzień dobry,',
      '',
      'chciał(a)bym zamówić kwiatowy box.',
      '',
      `Imię: ${v('f-name')}`,
      `Kontakt: ${v('f-contact')}`,
      `Box i kolory: ${v('f-box') || 'do ustalenia'}`,
      `Okazja i termin: ${v('f-when') || 'do ustalenia'}`,
    ].join('\n');
    const to = coupon.getAttribute('action').replace('mailto:', '');
    window.location.href = `mailto:${to}?subject=${encodeURIComponent('Zamówienie boxa — ' + v('f-name'))}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Wejścia sekcji ---------- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach((el) => el.classList.add('in'));
    return;
  }
  // Opóźnienie liczone w obrębie sekcji: nagłówek, tekst, obraz po kolei
  document.querySelectorAll('section').forEach((sec) => {
    sec.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 5) * 80}ms`));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
})();
