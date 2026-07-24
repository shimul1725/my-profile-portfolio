import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';

function Dashboard() {
  const navigate = useNavigate();

  /* ============================================================
     SKILLS - state variables
     ============================================================ */
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Backend');
  const [proficiency, setProficiency] = useState(70);

  /* ============================================================
     PROJECTS - state variables
     ============================================================ */
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [techStack, setTechStack] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [featured, setFeatured] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  // Thumbnail upload-এর জন্য আলাদা state
  const [thumbnailFile, setThumbnailFile] = useState(null);       // user-এর select করা raw file
  const [thumbnailPreview, setThumbnailPreview] = useState('');    // preview দেখানোর জন্য URL
  const [uploading, setUploading] = useState(false);               // upload চলাকালীন বাটন disable রাখতে

  /* ============================================================
     EXPERIENCE & EDUCATION - state variables
     ============================================================ */
  const [experiences, setExperiences] = useState([]);
  const [expType, setExpType] = useState('Experience'); // 'Experience' অথবা 'Education'
  const [expTitle, setExpTitle] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expCurrentlyActive, setExpCurrentlyActive] = useState(false); // true হলে "Present" দেখাবে
  const [expDesc, setExpDesc] = useState('');
  const [editingExpId, setEditingExpId] = useState(null);

  /* ============================================================
     TESTIMONIALS - state variables
     ============================================================ */
  const [testimonials, setTestimonials] = useState([]);
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [editingTestId, setEditingTestId] = useState(null);

  // সব section-এর জন্য common error message state
  const [error, setError] = useState('');

  // Component প্রথমবার mount হওয়ার সাথে সাথে সব data একবার fetch করে আনা
  useEffect(() => {
    fetchSkills();
    fetchProjects();
    fetchExperiences();
    fetchTestimonials();
  }, []);

  /* ============================================================
     SKILLS - API functions
     ============================================================ */

  // সব skill backend থেকে নিয়ে আসা
  const fetchSkills = async () => {
    try {
      const data = await apiRequest('/skills');
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  // নতুন skill add করা (form submit হলে)
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiRequest('/skills', 'POST', { name, category, proficiency: Number(proficiency) });
      setName('');
      setProficiency(70);
      fetchSkills(); // list আবার refresh করা, যাতে নতুনটাও দেখা যায়
    } catch (err) {
      setError(err.message);
    }
  };

  // skill delete করা (confirm popup দেখিয়ে)
  const handleDeleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await apiRequest(`/skills/${id}`, 'DELETE');
      fetchSkills();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ============================================================
     PROJECTS - API functions
     ============================================================ */

  const fetchProjects = async () => {
    try {
      const data = await apiRequest('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  // user file select করলে এটা চলে - preview URL বানানো হয়
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); // browser-এ local preview দেখানোর জন্য
    }
  };

  // Cloudinary-তে ছবি আপলোড করা (multipart/form-data দিয়ে, তাই apiRequest ব্যবহার করা যাবে না, আলাদা fetch লাগবে)
  const uploadThumbnail = async () => {
    const formData = new FormData();
    formData.append('image', thumbnailFile);

    const token = localStorage.getItem('adminToken');

    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }, // Content-Type ইচ্ছাকৃতভাবে বসানো হয়নি, browser নিজে বসাবে
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.imageUrl; // Cloudinary-র URL ফেরত আসবে
  };

  // Project form clear করা (submit-এর পরে বা cancel করলে)
  const resetProjectForm = () => {
    setProjectTitle('');
    setProjectDesc('');
    setTechStack('');
    setLiveLink('');
    setGithubLink('');
    setFeatured(false);
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

  // Project add অথবা update করা (editingProjectId থাকলে update, না থাকলে নতুন add)
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      const projectData = {
        title: projectTitle,
        description: projectDesc,
        techStack: techStack.split(',').map(t => t.trim()).filter(t => t), // "React, Node" -> ["React", "Node"]
        liveLink,
        githubLink,
        featured
      };

      // যদি নতুন thumbnail select করা থাকে, প্রথমে সেটা upload করে URL নিয়ে projectData-তে বসানো
      if (thumbnailFile) {
        const imageUrl = await uploadThumbnail();
        projectData.thumbnail = imageUrl;
      }

      if (editingProjectId) {
        await apiRequest(`/projects/${editingProjectId}`, 'PUT', projectData);
        setEditingProjectId(null);
      } else {
        await apiRequest('/projects', 'POST', projectData);
      }
      resetProjectForm();
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // "Edit" বাটনে ক্লিক করলে form-এ পুরনো data ভরে দেওয়া
  const handleEditProject = (project) => {
    setEditingProjectId(project._id);
    setProjectTitle(project.title);
    setProjectDesc(project.description);
    setTechStack(project.techStack.join(', '));
    setLiveLink(project.liveLink || '');
    setGithubLink(project.githubLink || '');
    setFeatured(project.featured);
    setThumbnailFile(null); // নতুন file select না করলে পুরনো thumbnail-ই থেকে যাবে
    setThumbnailPreview(project.thumbnail || ''); // পুরনো thumbnail preview হিসেবে দেখানো
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await apiRequest(`/projects/${id}`, 'DELETE');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ============================================================
     EXPERIENCE & EDUCATION - API functions
     ============================================================ */

  const fetchExperiences = async () => {
    try {
      const data = await apiRequest('/experience');
      setExperiences(data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetExpForm = () => {
    setExpType('Experience');
    setExpTitle('');
    setExpOrg('');
    setExpStartDate('');
    setExpEndDate('');
    setExpCurrentlyActive(false);
    setExpDesc('');
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const expData = {
      type: expType,
      title: expTitle,
      organization: expOrg,
      startDate: expStartDate,
      endDate: expCurrentlyActive ? null : expEndDate, // "Currently active" টিক দেওয়া থাকলে endDate পাঠানো হবে না
      currentlyActive: expCurrentlyActive,
      description: expDesc
    };

    try {
      if (editingExpId) {
        await apiRequest(`/experience/${editingExpId}`, 'PUT', expData);
        setEditingExpId(null);
      } else {
        await apiRequest('/experience', 'POST', expData);
      }
      resetExpForm();
      fetchExperiences();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditExp = (exp) => {
    setEditingExpId(exp._id);
    setExpType(exp.type);
    setExpTitle(exp.title);
    setExpOrg(exp.organization);
    // MongoDB থেকে ISO date format আসে, HTML date input শুধু YYYY-MM-DD বোঝে, তাই slice করা হচ্ছে
    setExpStartDate(exp.startDate?.slice(0, 10) || '');
    setExpEndDate(exp.endDate?.slice(0, 10) || '');
    setExpCurrentlyActive(exp.currentlyActive);
    setExpDesc(exp.description || '');
  };

  const handleDeleteExp = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await apiRequest(`/experience/${id}`, 'DELETE');
      fetchExperiences();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ============================================================
     TESTIMONIALS - API functions
     ============================================================ */

  const fetchTestimonials = async () => {
    try {
      const data = await apiRequest('/testimonials');
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetTestForm = () => {
    setTestName('');
    setTestRole('');
    setTestMessage('');
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const testData = { name: testName, role: testRole, message: testMessage };

    try {
      if (editingTestId) {
        await apiRequest(`/testimonials/${editingTestId}`, 'PUT', testData);
        setEditingTestId(null);
      } else {
        await apiRequest('/testimonials', 'POST', testData);
      }
      resetTestForm();
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTest = (test) => {
    setEditingTestId(test._id);
    setTestName(test.name);
    setTestRole(test.role);
    setTestMessage(test.message);
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await apiRequest(`/testimonials/${id}`, 'DELETE');
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  /* ============================================================
     LOGOUT
     ============================================================ */
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/');
  };

  // Skill category অনুযায়ী রঙিন dot-এর class name বানানোর helper
  const categoryClass = (cat) => `dot dot-${cat.toLowerCase()}`;

  /* ============================================================
     JSX (UI)
     ============================================================ */
  return (
    <div className="dashboard-container">

      {/* ---------- Header ---------- */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Portfolio Control Panel</p>
          <h1>Admin Dashboard</h1>
          <p className="header-subtitle">Manage your skills and projects in one place</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {/* ---------- Skills Section ---------- */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Manage Skills</h2>
          <span className="count-chip">{skills.length} skills</span>
        </div>

        <form onSubmit={handleAddSkill} className="skill-form">
          <input
            type="text"
            placeholder="Skill name (e.g. React)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Tools">Tools</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            min="0"
            max="100"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          />
          <button type="submit" className="btn-primary">Add Skill</button>
        </form>

        <div className="skill-list">
          {skills.length === 0 && <p className="empty-state">No skills yet. Add your first one above.</p>}
          {skills.map(skill => (
            <div key={skill._id} className="skill-list-item">
              <span className={categoryClass(skill.category)}></span>
              <div className="skill-info">
                <strong>{skill.name}</strong>
                <span className="skill-meta">{skill.category} · {skill.proficiency}%</span>
              </div>
              <button onClick={() => handleDeleteSkill(skill._id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Projects Section ---------- */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Manage Projects</h2>
          <span className="count-chip">{projects.length} projects</span>
        </div>

        <form onSubmit={handleProjectSubmit} className="project-form">
          <input
            type="text"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tech Stack (comma separated: React, Node.js, MongoDB)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            required
          />

          <div className="thumbnail-upload">
            <label>Project Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Preview" className="thumbnail-preview" />
            )}
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Live Demo Link (optional)"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
            />
            <input
              type="text"
              placeholder="GitHub Link"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured Project
          </label>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : (editingProjectId ? 'Update Project' : 'Add Project')}
            </button>
            {editingProjectId && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => { setEditingProjectId(null); resetProjectForm(); }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="project-list">
          {projects.length === 0 && <p className="empty-state">No projects yet. Add your first one above.</p>}
          {projects.map(project => (
            <div key={project._id} className="project-list-item">
              <div className="project-info">
                <div className="project-title-row">
                  <strong>{project.title}</strong>
                  {project.featured && <span className="featured-badge">★ Featured</span>}
                </div>
                <div className="tech-pills">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="project-actions">
                <button onClick={() => handleEditProject(project)} className="btn-ghost">Edit</button>
                <button onClick={() => handleDeleteProject(project._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Experience & Education Section ---------- */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Manage Experience & Education</h2>
          <span className="count-chip">{experiences.length} entries</span>
        </div>

        <form onSubmit={handleExpSubmit} className="project-form">
          <div className="form-row">
            <select value={expType} onChange={(e) => setExpType(e.target.value)}>
              <option value="Experience">Experience</option>
              <option value="Education">Education</option>
            </select>
            <input
              type="text"
              placeholder="Title (e.g. Backend Developer Intern)"
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Organization / Institution"
            value={expOrg}
            onChange={(e) => setExpOrg(e.target.value)}
            required
          />

          <div className="form-row">
            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={expStartDate}
                onChange={(e) => setExpStartDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>End Date</label>
              <input
                type="date"
                value={expEndDate}
                onChange={(e) => setExpEndDate(e.target.value)}
                disabled={expCurrentlyActive}
              />
            </div>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={expCurrentlyActive}
              onChange={(e) => setExpCurrentlyActive(e.target.checked)}
            />
            Currently active (Present)
          </label>

          <textarea
            placeholder="Description (optional)"
            value={expDesc}
            onChange={(e) => setExpDesc(e.target.value)}
          />

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingExpId ? 'Update Entry' : 'Add Entry'}
            </button>
            {editingExpId && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => { setEditingExpId(null); resetExpForm(); }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="project-list">
          {experiences.length === 0 && <p className="empty-state">No entries yet. Add your first one above.</p>}
          {experiences.map(exp => (
            <div key={exp._id} className="project-list-item">
              <div className="project-info">
                <div className="project-title-row">
                  <strong>{exp.title}</strong>
                  <span className="tech-pill">{exp.type}</span>
                </div>
                <p className="skill-meta">
                  {exp.organization} · {new Date(exp.startDate).getFullYear()} - {exp.currentlyActive ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                </p>
              </div>
              <div className="project-actions">
                <button onClick={() => handleEditExp(exp)} className="btn-ghost">Edit</button>
                <button onClick={() => handleDeleteExp(exp._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials Section ---------- */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Manage Testimonials</h2>
          <span className="count-chip">{testimonials.length} testimonials</span>
        </div>

        <form onSubmit={handleTestSubmit} className="project-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Name (e.g. John Doe)"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Role (e.g. Senior Developer at XYZ)"
              value={testRole}
              onChange={(e) => setTestRole(e.target.value)}
              required
            />
          </div>

          <textarea
            placeholder="Testimonial message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            required
          />

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingTestId ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
            {editingTestId && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => { setEditingTestId(null); resetTestForm(); }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="project-list">
          {testimonials.length === 0 && <p className="empty-state">No testimonials yet. Add your first one above.</p>}
          {testimonials.map(test => (
            <div key={test._id} className="project-list-item">
              <div className="project-info">
                <strong>{test.name}</strong>
                <p className="skill-meta">{test.role}</p>
                <p className="skill-meta" style={{ marginTop: '6px' }}>"{test.message}"</p>
              </div>
              <div className="project-actions">
                <button onClick={() => handleEditTest(test)} className="btn-ghost">Edit</button>
                <button onClick={() => handleDeleteTest(test._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;