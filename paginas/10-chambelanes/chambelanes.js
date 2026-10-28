/* ================================================================
   CHAMBELANES.JS — Ligero y coherente con invitacion2
   ================================================================ */

/* ── PÉTALOS (igual que invitacion2, versión ligera) ── */
(function initPetalos() {
  const cont = document.getElementById('petalos-chambelanes');
  if (!cont) return;

  const imgs = ['../../img/petBla.png', '../../img/pe1.png', '../../img/pe2.png'];
  const total = 10; // ligero — suficiente movimiento sin saturar el GPU

  for (let i = 0; i < total; i++) {
    const el = document.createElement('img');
    el.className = 'petalo-ch';
    el.src = imgs[i % imgs.length];
    el.setAttribute('aria-hidden', 'true');

    const size  = 14 + Math.random() * 16;
    const left  = Math.random() * 100;
    const dur   = 7  + Math.random() * 7;
    const delay = Math.random() * dur;
    const dx    = (Math.random() - 0.5) * 100;
    const rot   = Math.random() * 540 - 270;

    el.style.cssText = `width:${size}px;left:${left}%;animation-duration:${dur}s;animation-delay:-${delay}s;--dx:${dx}px;--rot:${rot}deg;`;
    cont.appendChild(el);
  }
})();

/* ── PARALLAX SUAVE ─────────────────────────────────── */
(function initParallax() {
  const flowers = document.querySelector('.flowers-top');
  const crown   = document.querySelector('.crown-display');
  document.getElementById('pageFlip').addEventListener('scroll', function () {
    const s = this.scrollTop;
    if (flowers) flowers.style.transform = `translate(${s*.06}px,${s*.04}px)`;
    if (crown)   crown.style.transform   = `translateY(${s*-.05}px)`;
  }, { passive: true });
})();

/* ── EFECTO 3D EN MARCOS ────────────────────────────── */
(function init3D() {
  document.querySelectorAll('.glass-card, .dress-code-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2))  / (r.width/2);
      const dy = (e.clientY - (r.top  + r.height/2)) / (r.height/2);
      card.style.transform = `perspective(600px) rotateY(${dx*6}deg) rotateX(${-dy*6}deg) translateY(-4px) scale(1.02)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(.2,.9,.3,1)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
})();

/* ── MARIPOSAS EXTRA AL TOCAR ────────────────────────── */
(function initTapButterfly() {
  const section = document.querySelector('.chambelanes-section');
  if (!section) return;
  const bflies = section.querySelectorAll('.bfly');

  // Al tocar la sección, acelera las mariposas por 1s
  section.addEventListener('pointerdown', () => {
    bflies.forEach(b => {
      b.style.animationDuration = '2s';
      b.style.filter = 'drop-shadow(0 0 14px rgba(255,215,0,1)) drop-shadow(0 0 28px rgba(212,175,55,.8))';
      setTimeout(() => {
        b.style.animationDuration = '';
        b.style.filter = '';
      }, 1200);
    });
  });
})();

/* ── NAVEGACIÓN ──────────────────────────────────────── */
window.InvitacionNav.init(
  "../09-teesperamos/teesperamos.html",
  null
);

console.log('✅ chambelanes.js cargado');
