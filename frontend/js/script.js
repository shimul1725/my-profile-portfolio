const API_BASE_URL = 'http://localhost:5000/api';

async function loadSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    const skills = await response.json();

    const container = document.getElementById('skillsContainer');
    container.innerHTML = ''; // আগে কিছু থাকলে খালি করো

    if (skills.length === 0) {
      container.innerHTML = '<p>No skills added yet.</p>';
      return;
    }

    skills.forEach(skill => {
      const skillCard = document.createElement('div');
      skillCard.classList.add('skill-card');
      skillCard.innerHTML = `
        <h4>${skill.name}</h4>
        <span class="skill-category">${skill.category}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${skill.proficiency}%"></div>
        </div>
      `;
      container.appendChild(skillCard);
    });
  } catch (error) {
    console.error('Error loading skills:', error);
  }
}
/*Porject*/
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
/*Experience  */
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

  const item = document.createElement('div');
  item.classList.add('timeline-item');
  item.innerHTML = `
    <h3>${exp.title}</h3>
    <h4>${exp.organization}</h4>
    <p class="timeline-date">${startYear} - ${endYear}</p>
    <p class="timeline-desc">${exp.description || ''}</p>
  `;
  return item;
}

loadSkills();
loadProjects();
loadExperience();

/*Scroll Listener for transparent */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/*contactForm */
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

/*testimonials */

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