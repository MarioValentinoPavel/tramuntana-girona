// Tramuntana · «Ventada»: cada letra del nombre es un muelle; el viento (la velocidad del cursor, o una ráfaga suave
// cuando nadie lo mueve) las estrecha, las inclina y las empuja con la fuente variable Noto Sans Display (anchura 62,5–100 %)
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wind() {
    const el = document.getElementById('wind'), hero = document.getElementById('hero');
    const txt = el.textContent.trim(); el.textContent = '';
    const L = [...txt].map((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; el.appendChild(s); return { s, sk: 0, vsk: 0, w: 100, vw: 0, x: 0, vx: 0 }; });
    if (reduce) return;
    let px = -1, lastX = 0, gust = 0, idle = 0, t0 = performance.now();
    hero.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; gust += (e.clientX - lastX) * .04; lastX = e.clientX; px = x; idle = 0; });
    hero.addEventListener('pointerleave', () => { px = -1; });
    // entrada: las letras llegan de la derecha empujadas por la tramuntana
    L.forEach((l, i) => { l.x = innerWidth * (.6 + i * .04); l.sk = -35; l.w = 62.5; });
    const loop = (now) => {
      const t = (now - t0) / 1000; idle += 1;
      gust *= .93; gust = Math.max(-14, Math.min(14, gust));
      const auto = idle > 90 ? Math.sin(t * .9) * 2.2 + Math.sin(t * 2.3) * .8 : 0;
      L.forEach((l, i) => {
        const pos = i / (L.length - 1);
        const near = px < 0 ? .5 : Math.max(0, 1 - Math.abs(pos - px) * 2.2);
        const wave = Math.sin(t * 2.2 - pos * 5) * auto;
        const g = gust * (.35 + near) + wave;
        const tSk = -g * 2.4, tW = Math.max(62.5, 100 - Math.abs(g) * 3.2), tX = g * 3;
        l.vsk += (tSk - l.sk) * .08; l.vsk *= .78; l.sk += l.vsk;
        l.vw += (tW - l.w) * .07; l.vw *= .78; l.w += l.vw;
        l.vx += (tX - l.x) * .06; l.vx *= .8; l.x += l.vx;
        l.s.style.fontStretch = l.w.toFixed(1) + '%';
        l.s.style.transform = `translateX(${l.x.toFixed(1)}px) skewX(${l.sk.toFixed(2)}deg)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function shapes() {
    if (reduce || typeof gsap === 'undefined') return;
    gsap.fromTo('.sh', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 1.4, ease: 'expo.out', stagger: .07, delay: .1 });
    const sp = { '.s-red': -30, '.s-blue': 50, '.s-yel': -60, '.s-pink': 40, '.s-photo': -80, '.s-photo2': 70 };
    Object.entries(sp).forEach(([s, y]) => gsap.to(s, { y, rotate: y / 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
    gsap.to('.wind', { yPercent: 30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function init() { wind(); shapes(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
