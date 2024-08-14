import React, { useState, useEffect } from 'react';
import ProjectItem from './ProjectItem';
import './ProjectItem.css'

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    languages: [],
    authors: [],
    image: '',
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching project data:', error));
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const regex = /^[a-zA-Z0-9]+$/;

    if (regex.test(username) && regex.test(password)) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password. Please use only letters and numbers.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
};

  const handleInputChange = (event) => {
    setNewProject({ ...newProject, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:4000/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then(response => response.json())
      .then(data => {
        setProjects([...projects, data]);
        setNewProject({
          name: '',
          description: '',
          languages: [],
          authors: [],
          image: '',
        });
      })
      .catch(error => console.error('Error posting project:', error));
  };

  return (
    <div className='project-list'>
      <h2>Our recent Projects</h2>
      <div className='project-items'>
        {projects.map((project) => (
          <ProjectItem  project={project} />
        ))}
      </div>

      {!isLoggedIn ? (
        <div className="login-section">
          <h3>Login to Add a Project</h3>
          <form onSubmit={handleLogin}>
            <div>
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
    ) : (
      <>
        <button onClick={handleLogout}>Logout</button>
        <form className='project-form' onSubmit={handleSubmit}>
          <h3>Add a New Project</h3>
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={newProject.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Project Description"
            value={newProject.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="image"
            placeholder="Project Image URL"
            value={newProject.image}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="languages"
            placeholder="Languages (comma-separated)"
            value={newProject.languages.join(', ')}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="authors"
            placeholder="Authors (comma-separated)"
            value={newProject.authors.join(', ')}
            onChange={handleInputChange}
          />
          <button type="submit">Add Project</button>
        </form>
      </>
    )}
    </div>
  );
};

export default ProjectList;