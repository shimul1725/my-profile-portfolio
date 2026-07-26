const API_BASE_URL = 'https://my-profile-portfolio.onrender.com/api';
//const API_BASE_URL = 'http://localhost:5000/api';

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
      const items = skills.filter(s => s.category === cat);
      container.innerHTML = items.length
        ? items.map(s => `<span>${s.name}</span>`).join('')
        : '<span>No skills yet</span>';
    });

    const bottomContainer = document.getElementById('face-bottom-summary');
    bottomContainer.innerHTML = skills.map(s => `<span>${s.name}</span>`).join('');

  } catch (error) {
    console.error('Error loading skills:', error);
  }
}

/* Cube rotation state — সবসময় একটা হালকা isometric tilt রাখা হয় */
const cube = document.getElementById('skillsCube');
const BASE_TILT = { x: -12, y: -25 };
let rotX = BASE_TILT.x;
let rotY = BASE_TILT.y;
let autoRotateInterval = null;

function applyCubeRotation() {
  cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
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
cubeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    stopAutoRotate();
    autoRotateBtn.textContent = 'Auto Rotate';
    const face = tab.getAttribute('data-face');
    rotX = faceRotations[face].x;
    rotY = faceRotations[face].y;
    applyCubeRotation();

    cubeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* Reset button */
document.getElementById('cubeReset').addEventListener('click', () => {
  stopAutoRotate();
  autoRotateBtn.textContent = 'Auto Rotate';
  rotX = BASE_TILT.x;
  rotY = BASE_TILT.y;
  applyCubeRotation();
  cubeTabs.forEach(t => t.classList.remove('active'));
  cubeTabs[0].classList.add('active');
});

/* Auto rotate toggle (with button text change) */
function startAutoRotate() {
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
}

const autoRotateBtn = document.getElementById('cubeAutoRotate');
autoRotateBtn.addEventListener('click', () => {
  if (autoRotateInterval) {
    stopAutoRotate();
    autoRotateBtn.textContent = 'Auto Rotate';
  } else {
    startAutoRotate();
    autoRotateBtn.textContent = 'Pause Rotation';
  }
});

/* Drag to rotate */
let isDragging = false;
let startX = 0;
let startY = 0;
let startRotX = 0;
let startRotY = 0;

function dragStart(clientX, clientY) {
  stopAutoRotate();
  autoRotateBtn.textContent = 'Auto Rotate';
  isDragging = true;
  startX = clientX;
  startY = clientY;
  startRotX = rotX;
  startRotY = rotY;
  cube.classList.add('dragging');
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
  cube.classList.remove('dragging');
}

cube.addEventListener('mousedown', (e) => dragStart(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => dragMove(e.clientX, e.clientY));
window.addEventListener('mouseup', dragEnd);

cube.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  dragStart(touch.clientX, touch.clientY);
});
window.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  dragMove(touch.clientX, touch.clientY);
});
window.addEventListener('touchend', dragEnd);

/*Project*/
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    const projects = await response.json();

    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';

    if (projects.length === 0) {
      container.innerHTML = '<p>No projects added yet.</p>';
      return;
    }

    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.classList.add('project-card');

      const techList = project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('');

      projectCard.innerHTML = `
        <div class="project-thumbnail">
          <img src="${project.thumbnail || 'assets/placeholder.jpg'}" alt="${project.title}">
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tech-stack">${techList}</div>
          <div class="project-links">
            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" class="btn btn-primary">Live Demo</a>` : ''}
            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="btn btn-secondary">GitHub</a>` : ''}
          </div>
        </div>
      `;
      container.appendChild(projectCard);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

/*Experience*/
async function loadExperience() {
  try {
    const response = await fetch(`${API_BASE_URL}/experience`);
    const experiences = await response.json();

    const experienceContainer = document.getElementById('experienceContainer');
    const educationContainer = document.getElementById('educationContainer');

    experienceContainer.innerHTML = '';
    educationContainer.innerHTML = '';

    const experienceItems = experiences.filter(exp => exp.type === 'Experience');
    const educationItems = experiences.filter(exp => exp.type === 'Education');

    if (experienceItems.length === 0) {
      experienceContainer.innerHTML = '<p>No experience added yet.</p>';
    } else {
      experienceItems.forEach(exp => {
        experienceContainer.appendChild(createTimelineItem(exp));
      });
    }

    if (educationItems.length === 0) {
      educationContainer.innerHTML = '<p>No education added yet.</p>';
    } else {
      educationItems.forEach(exp => {
        educationContainer.appendChild(createTimelineItem(exp));
      });
    }

  } catch (error) {
    console.error('Error loading experience:', error);
  }
}

function createTimelineItem(exp) {
  const startYear = new Date(exp.startDate).getFullYear();
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
    <p class="timeline-date">${startYear} - ${endYear}</p>
    ${descriptionHTML}
  `;
  return item;
}

/* Initial load */
loadSkills();
loadProjects();
loadExperience();
applyCubeRotation();

/*Scroll Listener for transparent navbar (kept for future use if needed)*/
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar-header');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

/*contactForm*/
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const statusEl = document.getElementById('contactStatus');

    statusEl.textContent = 'Sending...';
    statusEl.style.color = '#ccc';

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      statusEl.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      statusEl.style.color = 'var(--accent-olive)';
      contactForm.reset();

    } catch (error) {
      statusEl.textContent = 'Something went wrong. Please try again.';
      statusEl.style.color = '#e5484d';
      console.error(error);
    }
  });
}

/*testimonials*/
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    const testimonials = await response.json();

    const container = document.getElementById('testimonialsContainer');
    container.innerHTML = '';

    if (testimonials.length === 0) {
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
loadTestimonials();

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