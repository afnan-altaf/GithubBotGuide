/* ═══════════════════════════════════════════════════
   JT GitHub Bot — 3D Guide Website Main Script
   Copyright © 2025 JT. All rights reserved.
═══════════════════════════════════════════════════ */

// ═══════════ THREE.JS PARTICLE BACKGROUND ═══════════
(function initThree() {
  const canvas = document.getElementById('bg');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // Particles
  const count = 3000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    [0.23, 0.51, 0.96],  // blue
    [0.49, 0.23, 0.93],  // purple
    [0.02, 0.71, 0.83],  // cyan
    [0.06, 0.73, 0.51],  // green
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Torus rings
  const ringGeo1 = new THREE.TorusGeometry(30, 0.08, 8, 120);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.15 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(50, 0.06, 8, 160);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.1 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.z = Math.PI / 6;
  scene.add(ring2);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;

    particles.rotation.y = t * 0.05 + mouseX;
    particles.rotation.x = mouseY * 0.5;

    ring1.rotation.z = t * 0.08;
    ring2.rotation.y = t * 0.04;

    // Scroll influence
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.005;

    renderer.render(scene, camera);
  }
  animate();
})();


// ═══════════ PROGRESS BAR ═══════════
(function initProgress() {
  const fill = document.getElementById('progress-fill');
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    fill.style.width = pct + '%';
  });
})();


// ═══════════ REVEAL ON SCROLL ═══════════
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


// ═══════════ ACTIVE SIDEBAR TRACKING ═══════════
(function initSidebar() {
  const sections = document.querySelectorAll('.section');
  const sbItems = document.querySelectorAll('.sb-item');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        const stepNum = id.replace('step-', '');
        sbItems.forEach(item => {
          item.classList.toggle('active', item.dataset.step === stepNum);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


// ═══════════ SCROLL TO STEP ═══════════
function scrollToStep(n) {
  const el = document.getElementById('step-' + n);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ═══════════ COPY CODE ═══════════
function copyCode(btn) {
  const pre = btn.closest('.code-box').querySelector('pre');
  const text = pre.innerText || pre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.style.background = 'var(--green)';
    btn.style.color = 'white';
    btn.style.borderColor = 'var(--green)';
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}


// ═══════════ ERROR ACCORDION ═══════════
function toggleErr(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.err-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}


// ═══════════ GSAP HERO ANIMATIONS ═══════════
(function initGsap() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Floating cards random animation
  gsap.utils.toArray('.floating-card').forEach((card, i) => {
    gsap.to(card, {
      y: -15 + Math.random() * 30,
      x: -8 + Math.random() * 16,
      rotation: -3 + Math.random() * 6,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.5,
    });
  });

  // Orbs animation
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      x: -30 + Math.random() * 60,
      y: -30 + Math.random() * 60,
      duration: 5 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.5,
    });
  });

  // Step sections parallax on scroll
  gsap.utils.toArray('.step-number-bg').forEach(el => {
    gsap.fromTo(el,
      { y: 0 },
      {
        y: -80,
        scrollTrigger: {
          trigger: el.closest('.section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  });

  // Info cards stagger
  gsap.utils.toArray('.step-section').forEach(section => {
    const cards = section.querySelectorAll('.info-card, .platform-card, .cmd-card');
    if (cards.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          }
        }
      );
    }
  });

  // Steps list items
  gsap.utils.toArray('.steps-list').forEach(list => {
    const items = list.querySelectorAll('.sl-item');
    gsap.fromTo(items,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: list,
          start: 'top 80%',
        }
      }
    );
  });

  // Final section
  gsap.fromTo('.final-icon',
    { scale: 0, rotation: -180 },
    {
      scale: 1, rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.final-section',
        start: 'top 80%',
      }
    }
  );

})();


// ═══════════ KEYBOARD NAV ═══════════
document.addEventListener('keydown', (e) => {
  const sections = document.querySelectorAll('.section');
  const visible = [...sections].findIndex(s => {
    const r = s.getBoundingClientRect();
    return r.top >= -100 && r.top < window.innerHeight / 2;
  });
  if (e.key === 'ArrowDown' && visible < sections.length - 1) {
    sections[visible + 1]?.scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'ArrowUp' && visible > 0) {
    sections[visible - 1]?.scrollIntoView({ behavior: 'smooth' });
  }
});


// ═══════════ CURSOR GLOW ═══════════
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.3s ease, top 0.3s ease;
    left: -200px; top: -200px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();
