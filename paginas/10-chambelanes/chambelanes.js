/* ================================================================
   CHAMBELANES.JS — Partículas + Navegación
   ================================================================ */

/* ── PARTÍCULAS CANVAS ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  /* Ajusta el canvas al viewport */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* Crea una partícula con propiedades aleatorias */
  function createParticle() {
    const types = ['circle', 'star', 'diamond'];
    const colors = [
      'rgba(212,175,55,',   // dorado
      'rgba(255,215,0,',    // amarillo
      'rgba(249,229,150,',  // crema
      'rgba(255,120,170,',  // rosa
      'rgba(255,255,255,',  // blanco
    ];
    return {
      x:    Math.random() * W,
      y:    Math.random() * H + H,          // empieza debajo
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   -(Math.random() * 0.8 + 0.3),  // sube
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      opacityTarget: Math.random() * 0.7 + 0.3,
      opacitySpeed: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      type:  types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    };
  }

  /* Dibuja una estrella de n puntas */
  function drawStar(cx, cy, spikes, outerR, innerR) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
  }

  /* Renderiza una partícula */
  function renderParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const fill = p.color + p.opacity + ')';

    if (p.type === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      /* Halo */
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
      grad.addColorStop(0, p.color + (p.opacity * 0.5) + ')');
      grad.addColorStop(1, p.color + '0)');
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (p.type === 'star') {
      drawStar(0, 0, 4, p.size * 1.5, p.size * 0.6);
      ctx.fillStyle = fill;
      ctx.fill();
    } else {
      /* diamond */
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 1.4);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(0, p.size * 1.4);
      ctx.lineTo(-p.size, 0);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.restore();
  }

  /* Bucle de animación */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      /* Movimiento */
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      /* Parpadeo de opacidad */
      p.opacity += p.opacitySpeed;
      if (p.opacity > 0.85 || p.opacity < 0.1) p.opacitySpeed *= -1;

      /* Reciclar si sale por arriba */
      if (p.y < -20) {
        particles[i] = createParticle();
        particles[i].y = H + 10;
      }

      renderParticle(p);
    });

    requestAnimationFrame(animate);
  }

  /* Inicializar */
  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 8000), 90);
    particles = Array.from({ length: count }, () => {
      const p = createParticle();
      p.y = Math.random() * H; // distribución inicial por toda la pantalla
      return p;
    });
    animate();
  }

  window.addEventListener('resize', () => { resize(); });
  init();
})();

/* ── EFECTO PARALLAX SUAVE EN SCROLL ──────────────── */
(function initParallax() {
  const section = document.querySelector('.chambelanes-section');
  const flowers = document.querySelector('.flowers-top');
  const crown   = document.querySelector('.crown-display');

  if (!section) return;

  document.getElementById('pageFlip').addEventListener('scroll', function () {
    const scrollY = this.scrollTop;
    if (flowers) flowers.style.transform = `translate(${scrollY * 0.06}px, ${scrollY * 0.04}px)`;
    if (crown)   crown.style.transform   = `translateY(${scrollY * -0.05}px)`;
  }, { passive: true });
})();

/* ── EFECTO HOVER 3D EN LA TARJETA ───────────────── */
(function initCard3D() {
  const card = document.querySelector('.glass-card');
  if (!card) return;

  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const maxTilt = 8;
    card.style.transform = `perspective(600px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg) translateY(-4px) scale(1.02)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(.2,.9,.3,1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
})();

/* ── NAVEGACIÓN ───────────────────────────────────── */
window.InvitacionNav.init(
  "../09-teesperamos/teesperamos.html",
  null
);

console.log('✅ chambelanes.js cargado');
