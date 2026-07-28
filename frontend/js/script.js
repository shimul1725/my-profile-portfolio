const API_BASE_URL = 'https://my-profile-portfolio.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api';

/* ============================================================
   SKILLS 3D CUBE
   ============================================================ */
async function loadSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    const skills = await response.json();

    const categories = ['Backend', 'Frontend', 'Database', 'Tools', 'Other'];

    categories.forEach(cat => {
      const container = document.getElementById(`face-${cat}`);
      if (container) {
        const items = skills.filter(s => s.category === cat);
        container.innerHTML = items.length
          ? items.map(s => `<span>${s.name}</span>`).join('')
          : '<span>No skills yet</span>';
      }
    });

    const bottomContainer = document.getElementById('face-bottom-summary');
    if (bottomContainer) {
      // Unique skill list for bottom summary
      const uniqueSkills = Array.from(new Set(skills.map(s => s.name)));
      bottomContainer.innerHTML = uniqueSkills.length
        ? uniqueSkills.map(name => `<span>${name}</span>`).join('')
        : '<span>No skills yet</span>';
    }

  } catch (error) {
    console.error('Error loading skills:', error);
  }
}

/* Cube rotation state — সবসময় একটা হালকা isometric tilt রাখা হয় */
const cube = document.getElementById('skillsCube');
const BASE_TILT = { x: -12, y: -25 };
let rotX = BASE_TILT.x;
let rotY = BASE_TILT.y;
let autoRotateInterval = null;

function applyCubeRotation() {
  if (cube) {
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
}

const faceRotations = {
  front:  { x: BASE_TILT.x + 0,   y: BASE_TILT.y + 0 },
  right:  { x: BASE_TILT.x + 0,   y: BASE_TILT.y - 90 },
  back:   { x: BASE_TILT.x + 0,   y: BASE_TILT.y + 180 },
  left:   { x: BASE_TILT.x + 0,   y: BASE_TILT.y + 90 },
  top:    { x: BASE_TILT.x - 90,  y: BASE_TILT.y + 0 },
  bottom: { x: BASE_TILT.x + 90,  y: BASE_TILT.y + 0 }
};

/* Tab click → rotate to that face */
const cubeTabs = document.querySelectorAll('.cube-tab[data-face]');
const autoRotateBtn = document.getElementById('cubeAutoRotate');

cubeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    stopAutoRotate();
    const face = tab.getAttribute('data-face');
    if (faceRotations[face]) {
      rotX = faceRotations[face].x;
      rotY = faceRotations[face].y;
      applyCubeRotation();

      cubeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    }
  });
});

/* Reset button */
document.getElementById('cubeReset')?.addEventListener('click', () => {
  stopAutoRotate();
  rotX = BASE_TILT.x;
  rotY = BASE_TILT.y;
  applyCubeRotation();
  cubeTabs.forEach(t => t.classList.remove('active'));
  if (cubeTabs[0]) cubeTabs[0].classList.add('active');
});

/* Auto rotate toggle */
function startAutoRotate() {
  stopAutoRotate();
  if (autoRotateBtn) autoRotateBtn.textContent = 'Pause Rotation';
  autoRotateInterval = setInterval(() => {
    rotY += 1;
    applyCubeRotation();
  }, 30);
}

function stopAutoRotate() {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
  if (autoRotateBtn) autoRotateBtn.textContent = 'Auto Rotate';
}

if (autoRotateBtn) {
  autoRotateBtn.addEventListener('click', () => {
    if (autoRotateInterval) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  });
}

/* Drag to rotate */
let isDragging = false;
let startX = 0;
let startY = 0;
let startRotX = 0;
let startRotY = 0;

function dragStart(clientX, clientY) {
  stopAutoRotate();
  isDragging = true;
  startX = clientX;
  startY = clientY;
  startRotX = rotX;
  startRotY = rotY;
  cube?.classList.add('dragging');
}

function dragMove(clientX, clientY) {
  if (!isDragging) return;
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;
  rotY = startRotY + deltaX * 0.4;
  rotX = startRotX - deltaY * 0.4;
  applyCubeRotation();
}

function dragEnd() {
  isDragging = false;
  cube?.classList.remove('dragging');
}

if (cube) {
  cube.addEventListener('mousedown', (e) => dragStart(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => dragMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', dragEnd);

  cube.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    dragStart(touch.clientX, touch.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      dragMove(touch.clientX, touch.clientY);
    }
  });
  window.addEventListener('touchend', dragEnd);
}

/* ============================================================
   PROJECTS
   ============================================================ */
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const projects = await response.json();

    const container = document.getElementById('projectsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!projects || projects.length === 0) {
      container.innerHTML = '<p>No projects added yet.</p>';
      return;
    }

    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.classList.add('project-card');

      const techList = Array.isArray(project.techStack)
        ? project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')
        : '';

      projectCard.innerHTML = `
        <div class="project-thumbnail">
          <img src="${project.thumbnail || 'assets/placeholder.jpg'}" alt="${project.title}">
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tech-stack">${techList}</div>
          <div class="project-links">
            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo</a>` : ''}
            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">GitHub</a>` : ''}
          </div>
        </div>
      `;
      container.appendChild(projectCard);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

/* ============================================================
   EXPERIENCE & EDUCATION
   ============================================================ */
async function loadExperience() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`);
    const experiences = await response.json();

    const educationContainer = document.getElementById('educationContainer');
    if (educationContainer) {
      educationContainer.innerHTML = '';
      const educationItems = experiences.filter(exp => exp.type === 'Education');

      if (educationItems.length === 0) {
        educationContainer.innerHTML = '<p>No education added yet.</p>';
      } else {
        educationItems.forEach(exp => {
          educationContainer.appendChild(createTimelineItem(exp));
        });
      }
    }

    const experienceItems = experiences.filter(exp => exp.type === 'Experience');
    renderExpBook(experienceItems);

  } catch (error) {
    console.error('Error loading experience:', error);
  }
}

function createTimelineItem(exp) {
  const startYear = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
  const endYear = exp.currentlyActive
    ? 'Present'
    : (exp.endDate ? new Date(exp.endDate).getFullYear() : '');

  let descriptionHTML = '';
  if (Array.isArray(exp.description) && exp.description.length > 0) {
    const bulletPoints = exp.description.map(point => `<li>${point}</li>`).join('');
    descriptionHTML = `<ul class="timeline-desc-list">${bulletPoints}</ul>`;
  }

  const item = document.createElement('div');
  item.classList.add('timeline-item');
  item.innerHTML = `
    <h3>${exp.title}</h3>
    <h4>${exp.organization}</h4>
    <p class="timeline-date">${startYear} ${endYear ? '- ' + endYear : ''}</p>
    ${descriptionHTML}
  `;
  return item;
}

/* ============================================================
   EXPERIENCE (ACCORDION STYLE)
   ============================================================ */
async function loadExperience() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`);
    const experiences = await response.json();

    // 1. Render Education Timeline
    const educationContainer = document.getElementById('educationContainer');
    if (educationContainer) {
      educationContainer.innerHTML = '';
      const educationItems = experiences.filter(exp => exp.type === 'Education');

      if (educationItems.length === 0) {
        educationContainer.innerHTML = '<p>No education added yet.</p>';
      } else {
        educationItems.forEach(exp => {
          educationContainer.appendChild(createTimelineItem(exp));
        });
      }
    }

    // 2. Render Experience Accordion
    const experienceItems = experiences.filter(exp => exp.type === 'Experience');
    renderExpAccordion(experienceItems);

  } catch (error) {
    console.error('Error loading experience:', error);
  }
}

function renderExpAccordion(experiences) {
  const container = document.getElementById('experienceContainer') || document.getElementById('expTrack');
  if (!container) return;

  container.innerHTML = '';

  if (!experiences || experiences.length === 0) {
    container.innerHTML = '<p style="color:#999; padding:20px;">No experience added yet.</p>';
    return;
  }

  experiences.forEach((exp, index) => {
    const startYear = exp.startDate ? formatDate(exp.startDate) : '';
    const endYear = exp.currentlyActive
      ? 'Present'
      : (exp.endDate ? formatDate(exp.endDate) : '');

    const dateRange = `${startYear} to ${endYear}`;

    let descHTML = '';
    if (Array.isArray(exp.description) && exp.description.length > 0) {
      descHTML = `<ul class="exp-desc-list">${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>`;
    }

    const card = document.createElement('div');
    card.classList.add('exp-accordion-card');
    
    // প্রথম কার্ডটি বাই-ডিফল্ট ওপেন থাকবে (আপনার স্ক্রিনশটের মতো)
    if (index === 0) {
      card.classList.add('active');
    }

    card.innerHTML = `
      <div class="exp-accordion-header">
        <div class="exp-header-info">
          <h3>${exp.title} | ${exp.organization}</h3>
          <p class="exp-date">${dateRange}</p>
        </div>
        <div class="exp-accordion-controls">
          <span class="exp-toggle-text">${index === 0 ? 'Hide' : 'Details'}</span>
          <button class="exp-toggle-btn" aria-label="Toggle details">
            <svg class="exp-arrow-icon" viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="exp-accordion-body">
        ${descHTML}
      </div>
    `;

    // Click event handler for Expand/Collapse
    const header = card.querySelector('.exp-accordion-header');
    header.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      
      // অপশনাল: একটি কার্ড ওপেন করলে বাকিগুলো বন্ধ করতে চাইলে নিচের লাইনটি আনকমেন্ট করুন
      // document.querySelectorAll('.exp-accordion-card').forEach(c => c.classList.remove('active'));

      if (isActive) {
        card.classList.remove('active');
        card.querySelector('.exp-toggle-text').textContent = 'Details';
      } else {
        card.classList.add('active');
        card.querySelector('.exp-toggle-text').textContent = 'Hide';
      }
    });

    container.appendChild(card);
  });
}

// তারিখ ফরম্যাট করার ছোট হেলপার (e.g., Sep 2025)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // যদি স্ট্রিং ফরম্যাটে ইয়ার থাকে
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    const testimonials = await response.json();

    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!testimonials || testimonials.length === 0) {
      container.innerHTML = '<p>No testimonials yet.</p>';
      return;
    }

    testimonials.forEach(test => {
      const card = document.createElement('div');
      card.classList.add('testimonial-card');
      card.innerHTML = `
        <p class="testimonial-message">"${test.message}"</p>
        <div class="testimonial-author">
          <h4>${test.name}</h4>
          <p>${test.role}</p>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const statusEl = document.getElementById('contactStatus');

    if (statusEl) {
      statusEl.textContent = 'Sending...';
      statusEl.style.color = '#ccc';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error sending message');
      }

      if (statusEl) {
        statusEl.textContent = "Message sent successfully! I'll get back to you soon.";
        statusEl.style.color = 'var(--accent-olive)';
      }
      contactForm.reset();

    } catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Something went wrong. Please try again.';
        statusEl.style.color = '#e5484d';
      }
      console.error(error);
    }
  });
}

/* ============================================================
   UI INTERACTIONS & WEATHER CANVAS
   ============================================================ */

/* Active Navbar Link on Scroll (Scrollspy) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNavLink() {
  let currentSectionId = '';
  const scrollPosition = window.scrollY + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

/* Copy Email Button */
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('shimul.tu.dortmund@gmail.com');
    copyEmailBtn.textContent = '✅';
    setTimeout(() => {
      copyEmailBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>`;
    }, 1500);
  });
}

/* Back to Top Floating Action Button */
const fabBackToTop = document.getElementById('fabBackToTop');
const backToTopBtn = document.getElementById('backToTopBtn');

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
if (fabBackToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      fabBackToTop.classList.remove('fab-hidden');
    } else {
      fabBackToTop.classList.add('fab-hidden');
    }
  });
  fabBackToTop.addEventListener('click', scrollToTop);
}

/* Effects Menu Toggle */
const fabEffectsToggle = document.getElementById('fabEffectsToggle');
const effectsMenu = document.getElementById('effectsMenu');
const effectsOptions = document.querySelectorAll('.effects-option');

if (fabEffectsToggle && effectsMenu) {
  fabEffectsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = effectsMenu.classList.toggle('open');
    fabEffectsToggle.classList.toggle('menu-open');
    fabEffectsToggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!effectsMenu.contains(e.target) && e.target !== fabEffectsToggle) {
      effectsMenu.classList.remove('open');
      fabEffectsToggle.classList.remove('menu-open');
      fabEffectsToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Theme + Weather Effect Canvas Engine */
const weatherCanvas = document.getElementById('weatherCanvas');
const ctx = weatherCanvas ? weatherCanvas.getContext('2d') : null;
let particles = [];
let weatherAnimId = null;
let currentEffect = localStorage.getItem('siteEffect') || 'dark';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  if (!weatherCanvas) return;
  weatherCanvas.width = window.innerWidth;
  weatherCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

function createParticles(type) {
  particles = [];
  if (!weatherCanvas) return;
  const count = type === 'rain' ? 120 : 90;
  for (let i = 0; i < count; i++) {
    if (type === 'rain') {
      particles.push({
        x: Math.random() * weatherCanvas.width,
        y: Math.random() * weatherCanvas.height,
        length: Math.random() * 18 + 10,
        speed: Math.random() * 6 + 8
      });
    } else {
      particles.push({
        x: Math.random() * weatherCanvas.width,
        y: Math.random() * weatherCanvas.height,
        radius: Math.random() * 3 + 1.5,
        speed: Math.random() * 1.5 + 0.6,
        drift: Math.random() * 1 - 0.5
      });
    }
  }
}

function drawRain() {
  if (!ctx || !weatherCanvas) return;
  ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
  ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
  ctx.lineWidth = 1.2;
  particles.forEach(p => {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y + p.length);
    ctx.stroke();
    p.y += p.speed;
    if (p.y > weatherCanvas.height) {
      p.y = -p.length;
      p.x = Math.random() * weatherCanvas.width;
    }
  });
  weatherAnimId = requestAnimationFrame(drawRain);
}

function drawSnow() {
  if (!ctx || !weatherCanvas) return;
  ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.speed;
    p.x += p.drift;
    if (p.y > weatherCanvas.height) {
      p.y = -5;
      p.x = Math.random() * weatherCanvas.width;
    }
  });
  weatherAnimId = requestAnimationFrame(drawSnow);
}

function stopWeather() {
  if (weatherAnimId) cancelAnimationFrame(weatherAnimId);
  weatherAnimId = null;
  if (weatherCanvas) {
    weatherCanvas.style.display = 'none';
    if (ctx) ctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
  }
}

function applyEffect(effect) {
  stopWeather();

  if ((effect === 'rain' || effect === 'snow') && !prefersReducedMotion && weatherCanvas) {
    weatherCanvas.style.display = 'block';
    createParticles(effect);
    effect === 'rain' ? drawRain() : drawSnow();
  }

  if (effect === 'light') {
    document.body.classList.add('light-theme');
    localStorage.setItem('siteTheme', 'light-theme');
  } else {
    document.body.classList.remove('light-theme');
    localStorage.setItem('siteTheme', 'dark-theme');
  }

  effectsOptions.forEach(opt => {
    const isActive = opt.getAttribute('data-effect') === effect;
    opt.classList.toggle('active', isActive);
    opt.setAttribute('aria-checked', isActive);
  });

  currentEffect = effect;
  localStorage.setItem('siteEffect', effect);
}

effectsOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    applyEffect(opt.getAttribute('data-effect'));
    effectsMenu?.classList.remove('open');
    fabEffectsToggle?.classList.remove('menu-open');
    fabEffectsToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* INITIAL SETUP ON PAGE LOAD */
document.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  loadSkills();
  loadProjects();
  loadExperience();
  loadTestimonials();
  applyCubeRotation();
  applyEffect(currentEffect);
});