import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

// Import images
import ganeshImg from './assets/IMGGANESH.jpg';
import bakeryProjectImg from './assets/bakery-project.png';
import eduLearningImg from './assets/edu-learning.png';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'midnight');
  const [navScrolled, setNavScrolled] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const form = useRef();
  const [emailStatus, setEmailStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setEmailStatus('sending');

    // TODO: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    // You can find it in your EmailJS dashboard: Account > API Keys > Public Key
    emailjs.sendForm('service_i4a0crd', 'template_znkzbw3', form.current, '1FZsHBkDovtiihoQg')
      .then((result) => {
          console.log(result.text);
          setEmailStatus('success');
          e.target.reset();
          setTimeout(() => setEmailStatus(''), 5000);
      }, (error) => {
          console.log(error.text);
          setEmailStatus('error');
          setTimeout(() => setEmailStatus(''), 5000);
      });
  };

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar scrolled state
      setNavScrolled(window.scrollY > 50);

      // Back to top button visibility
      setShowBackToTop(window.scrollY > 500);

      // Scroll progress calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Scroll Spy logic
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Increased threshold for better visual impact
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          
          // If it's a section-title, reveal its children with slight delay
          if (entry.target.classList.contains('section-title')) {
            const children = entry.target.querySelectorAll('.underline, h2');
            children.forEach(child => child.classList.add('reveal'));
          }
        }
      });
    }, observerOptions);

    revealRefs.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'midnight') return 'cyber';
      if (prev === 'cyber') return 'arctic';
      return 'midnight';
    });
  };

  const getThemeIcon = () => {
    if (theme === 'midnight') return 'fa-moon';
    if (theme === 'cyber') return 'fa-bolt';
    return 'fa-sun';
  };

  const getThemeName = () => {
    if (theme === 'midnight') return 'Midnight';
    if (theme === 'cyber') return 'Cyber';
    return 'Arctic';
  };

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  const closeNav = () => {
    setNavActive(false);
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    closeNav();
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Navigation */}
      <nav id="navbar" className={navScrolled ? 'nav-scrolled' : ''}>
        <div className="container">
          <div className="logo">
            <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>
              <span>Ganesh</span>Jadhav
            </a>
          </div>
          
          <ul className={`nav-links ${navActive ? 'nav-active' : ''}`}>
            <li><a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'home'); setNavActive(false); }}>Home</a></li>
            <li><a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'about'); setNavActive(false); }}>About</a></li>
            <li><a href="#skills" className={activeSection === 'skills' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'skills'); setNavActive(false); }}>Skills</a></li>
            <li><a href="#experience" className={activeSection === 'experience' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'experience'); setNavActive(false); }}>Experience</a></li>
            <li><a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'projects'); setNavActive(false); }}>Projects</a></li>
            <li><a href="#certifications" className={activeSection === 'certifications' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'certifications'); setNavActive(false); }}>Certifications</a></li>
            <li><a href="#education" className={activeSection === 'education' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'education'); setNavActive(false); }}>Education</a></li>
            <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => { scrollToSection(e, 'contact'); setNavActive(false); }}>Contact</a></li>
            <li>
              <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${getThemeName()} Theme`}>
                <i className={`fas ${getThemeIcon()}`}></i>
                <span className="theme-name">{getThemeName()}</span>
              </button>
            </li>
          </ul>

          <div className={`burger ${navActive ? 'toggle' : ''}`} onClick={toggleNav}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero centered-hero">
        <div className="hero-bg-elements">
          <div className="hero-circle circle-1"></div>
          <div className="hero-circle circle-2"></div>
          <div className="hero-circle circle-3"></div>
        </div>
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-content">
              <div className="hero-badge hero-reveal">
                <span className="pulse"></span> Open for DevOps Roles
              </div>
              <h1 className="hero-reveal">
                Engineering Scalable <br />
                <span className="text-gradient">Cloud & DevOps</span> <br />
                Architectures
              </h1>
              <p className="hero-reveal">
                I'm <span className="highlight">Ganesh Jadhav</span>, a Cloud Engineer specializing in high-availability infrastructure, CI/CD automation, and container orchestration.
              </p>
              <div className="hero-btns hero-reveal">
                <a href="#projects" className="btn btn-primary" onClick={(e) => scrollToSection(e, 'projects')}>
                  <span>Explore Projects</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="/resume.pdf" className="btn btn-secondary" download>
                  <i className="fas fa-download"></i>
                  <span>Download CV</span>
                </a>
              </div>
              
              <div className="tech-stack-minimal hero-reveal">
                <span>Core Stack:</span>
                <div className="minimal-icons">
                  <i className="fab fa-aws" title="AWS"></i>
                  <i className="fab fa-docker" title="Docker"></i>
                  <i className="fas fa-dharmachakra" title="Kubernetes"></i>
                  <i className="fab fa-linux" title="Linux"></i>
                  <i className="fas fa-infinity" title="CI/CD"></i>
                </div>
              </div>
            </div>

            <div className="hero-visual hero-reveal">
              <div className="visual-card glass-effect">
                <div className="card-header">
                  <div className="dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="title">cloud-terminal</div>
                </div>
                <div className="card-body">
                  <div className="terminal-line"><span className="cmd">$</span> terraform init</div>
                  <div className="terminal-line success"><span className="check">✔</span> Initializing provider plugins...</div>
                  <div className="terminal-line"><span className="cmd">$</span> kubectl get pods</div>
                  <div className="terminal-line"><span className="dim">NAME</span> <span className="dim">READY</span> <span className="dim">STATUS</span></div>
                  <div className="terminal-line">api-v2-84b <span className="status-run">Running</span></div>
                  <div className="terminal-line">auth-svc-6j2 <span className="status-run">Running</span></div>
                  <div className="terminal-line cursor">_</div>
                </div>
              </div>
              {/* <div className="visual-stats glass-effect">
                <div className="stat">
                  <span className="label">Uptime</span>
                </div>
                <div className="stat">
                  <span className="label">Latency</span>
                  <span className="value">12ms</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>Scroll to Explore</span>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section bg-alt">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>About Me</h2>
            <div className="underline"></div>
          </div>
          <div className="about-wrapper">
            <div className="about-image fade-in" ref={addToRefs}>
              <div className="image-wrapper glass-effect">
                <img src={ganeshImg} alt="Ganesh Jadhav" />
              </div>
            </div>
            <div className="about-text fade-in" ref={addToRefs}>
              <p>I am a passionate Cloud & DevOps Engineer focused on building and optimizing scalable cloud infrastructure. My expertise lies in AWS, containerization with Docker and Kubernetes, and building robust CI/CD pipelines.</p>
              <p>I thrive on solving complex infrastructure challenges and implementing automation that improves development efficiency and system reliability. Currently, I'm working as a DevOps Intern, further refining my skills in real-world production environments.</p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-num">1+</span>
                  <span className="stat-label">Year Learning</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">10+</span>
                  <span className="stat-label">Projects Built</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">5+</span>
                  <span className="stat-label">Certifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Technical <span className="text-gradient">Expertise</span></h2>
            <div className="underline"></div>
            <p className="section-subtitle">A comprehensive overview of my technical stack and tools I use to build scalable infrastructure.</p>
          </div>
          
          <div className="skills-grid-new">
            <SkillCard 
              category="Cloud Platforms" 
              icon="fa-cloud"
              refCallback={addToRefs}
              skills={[
                { name: "AWS", icon: "fab fa-aws", color: "#FF9900" },
                { name: "Azure", icon: "fab fa-microsoft", color: "#0089D6" },
                { name: "Google Cloud", icon: "fab fa-google", color: "#4285F4" }
              ]}
              tools={["EC2", "S3", "VPC", "IAM", "Route53", "CloudWatch", "Lambda"]}
            />

            <SkillCard 
              category="DevOps & Automation" 
              icon="fa-cogs"
              refCallback={addToRefs}
              skills={[
                { name: "Docker", icon: "fab fa-docker", color: "#2496ED" },
                { name: "Kubernetes", icon: "fas fa-dharmachakra", color: "#326CE5" },
                { name: "Jenkins", icon: "fab fa-jenkins", color: "#D24939" }
              ]}
              tools={["Terraform", "Ansible", "Git", "GitHub Actions", "Shell Scripting"]}
            />

            <SkillCard 
              category="Systems & Networking" 
              icon="fa-network-wired"
              refCallback={addToRefs}
              skills={[
                { name: "Linux", icon: "fab fa-linux", color: "#FCC624" },
                { name: "Ubuntu", icon: "fab fa-ubuntu", color: "#E95420" },
                { name: "Nginx", icon: "fas fa-server", color: "#009639" }
              ]}
              tools={["Apache", "SSL/TLS", "DNS", "Networking", "Security", "Monitoring"]}
            />

            <SkillCard 
              category="Languages & Web" 
              icon="fa-code"
              refCallback={addToRefs}
              skills={[
                { name: "Python", icon: "fab fa-python", color: "#3776AB" },
                { name: "JavaScript", icon: "fab fa-js", color: "#F7DF1E" },
                { name: "React", icon: "fab fa-react", color: "#61DAFB" }
              ]}
              tools={["HTML5", "CSS3", "SQL", "Bash", "Node.js", "REST APIs"]}
            />
          </div>
        </div>
      </section>

      {/* Professional Course Section */}
      <section id="professional-course" className="section">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Professional <span className="text-gradient">Course</span></h2>
            <div className="underline"></div>
          </div>
          <div className="course-card fade-in" ref={addToRefs}>
            <div className="course-card-inner glass-effect">
              <div className="course-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="course-content">
                <h3>DevOps and Cloud Using AI</h3>
                <span className="institute">CloudBlitz Institute, Pune</span>
                <p>Comprehensive training in modern DevOps practices, cloud infrastructure management, and AI integration for automated operations.</p>
                <div className="course-tags">
                  <span className="tag">DevOps</span>
                  <span className="tag">Cloud Computing</span>
                  <span className="tag">AI Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section bg-alt">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Work Experience</h2>
            <div className="underline"></div>
          </div>
          <div className="timeline">
            <TimelineItem date="2025 - Present" title="DevOps & Cloud Engineer Intern" company="Hishan Lab Pvt. Ltd." desc="Managing AWS cloud infrastructure and implementing automated CI/CD pipelines using Jenkins and GitHub Actions. Responsible for containerizing applications with Docker and orchestration with Kubernetes." refCallback={addToRefs} />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Featured <span className="text-gradient">Projects</span></h2>
            <div className="underline"></div>
            <p className="section-subtitle">A showcase of my recent work in cloud architecture, DevOps automation, and scalable systems.</p>
          </div>
          <div className="projects-grid-new">
            <ProjectCard 
              className="project-bakery" 
              title="Bakery Management Application" 
              desc="High-availability deployment on AWS EKS with automated scaling and secure microservices orchestration." 
              tags={["AWS EKS", "Docker", "Kubernetes", "Jenkins"]} 
              link="https://github.com/GANESH560-w"
              bgImg={bakeryProjectImg}
              refCallback={addToRefs}
              onOpen={() => openProjectModal({
                title: "Bakery Management Application",
                desc: "A high-availability deployment on AWS EKS featuring automated scaling, secure microservices orchestration, and persistent storage management. Managed with Terraform and Jenkins.",
                tags: ["AWS EKS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
                link: "https://github.com/GANESH560-w",
                img: bakeryProjectImg
              })}
            />
            <ProjectCard 
              className="project-edu" 
              title="Edu-Learning Platform" 
              desc="Microservices-based education platform containerized with Docker for consistent multi-environment deployment." 
              tags={["Docker", "Microservices", "Nginx", "GitHub Actions"]} 
              link="https://github.com/GANESH560-w"
              bgImg={eduLearningImg}
              refCallback={addToRefs}
              onOpen={() => openProjectModal({
                title: "Edu-Learning Platform",
                desc: "A microservices education platform containerized with Docker for consistency. Utilizes Nginx as a reverse proxy and automated GitHub Actions workflows.",
                tags: ["Docker", "Microservices", "Linux", "Nginx", "GitHub Actions"],
                link: "https://github.com/GANESH560-w",
                img: eduLearningImg
              })}
            />
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen} 
        project={selectedProject} 
        onClose={closeProjectModal} 
      />

      {/* Education Section */}
      <section id="education" className="section bg-alt">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Education</h2>
            <div className="underline"></div>
          </div>
          <div className="education-grid">
            <div className="edu-card fade-in" ref={addToRefs}>
              <div className="edu-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>B.Sc. in Computer Science</h3>
              <p>Savitribai Phule Pune University</p>
              <span className="edu-date">2018 - 2021</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Certifications</h2>
            <div className="underline"></div>
          </div>
          <div className="cert-grid">
            <CertCard 
              title="Introduction to Cloud Security"
              company="Coursera"
              year="2025"
              icon="fas fa-shield-alt"
              refCallback={addToRefs}
            />
            <CertCard 
              title="Introduction to Cloud Computing"
              company="Coursera"
              year="2025"
              icon="fas fa-cloud"
              refCallback={addToRefs}
            />
            <CertCard 
              title="Job Simulation Solution Architecture"
              company="The Forage"
              year="2025"
              icon="fas fa-project-diagram"
              refCallback={addToRefs}
            />
            <CertCard 
              title="Introduction to Docker & Microservices"
              company="Udemy"
              year="2025"
              icon="fab fa-docker"
              refCallback={addToRefs}
            />
            <CertCard 
              title="Linux Bash Shell Scripting"
              company="Udemy"
              year="2025"
              icon="fab fa-linux"
              refCallback={addToRefs}
            />
            <CertCard 
              title="Python Certification"
              company="HackerRank"
              year="2025"
              icon="fab fa-python"
              refCallback={addToRefs}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-title fade-in" ref={addToRefs}>
            <h2>Get In <span className="text-gradient">Touch</span></h2>
            <div className="underline"></div>
          </div>
          <div className="contact-container">
             <div className="contact-card glass-effect fade-in" ref={addToRefs}>
                <div className="contact-header">
                    <h3>Let's Collaborate</h3>
                    <p>Ready to automate your infrastructure? Drop me a message.</p>
                </div>
                <form ref={form} onSubmit={sendEmail} className="modern-form">
                    <div className="input-group">
                        <input type="text" name="name" required placeholder=" " />
                        <label>Your Name</label>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" required placeholder=" " />
                        <label>Your Email</label>
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="input-group">
                        <input type="text" name="subject" required placeholder=" " />
                        <label>Subject</label>
                        <i className="fas fa-tag"></i>
                    </div>
                    <div className="input-group textarea-group">
                        <textarea name="message" rows="5" required placeholder=" "></textarea>
                        <label>Message</label>
                        <i className="fas fa-comment-alt"></i>
                    </div>
                    <button type="submit" className="submit-btn" disabled={emailStatus === 'sending'}>
                        {emailStatus === 'sending' ? 'Sending...' : 'Send Message'}
                        <i className="fas fa-paper-plane"></i>
                    </button>
                    {emailStatus === 'success' && <p className="status-msg success">Message sent successfully!</p>}
                    {emailStatus === 'error' && <p className="status-msg error">Failed to send. Please try again.</p>}
                </form>
             </div>
             
             <div className="contact-visual fade-in" ref={addToRefs}>
                <div className="info-box">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                        <h4>Location</h4>
                        <p>Pune, Maharashtra, India</p>
                    </div>
                </div>
                <div className="info-box">
                    <i className="fas fa-envelope"></i>
                    <div>
                        <h4>Email</h4>
                        <a href="mailto:ganeshajadhav108@gmail.com">ganeshajadhav108@gmail.com</a>
                    </div>
                </div>
                <div className="social-connect">
                    <h4>Connect Socially</h4>
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/in/ganesh-jadhav-1616" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                        <a href="https://github.com/GANESH560-w" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 Ganesh Jadhav. Built with passion and code.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`} 
        onClick={(e) => scrollToSection(e, 'home')}
        aria-label="Back to Top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
}

function SkillCard({ category, icon, skills, tools, refCallback }) {
  return (
    <div className="skill-card fade-in" ref={refCallback}>
      <div className="skill-card-inner glass-effect">
        <div className="skill-card-header">
          <div className="category-icon">
            <i className={`fas ${icon}`}></i>
          </div>
          <h3>{category}</h3>
        </div>
        
        <div className="skill-items-primary">
          {skills.map(skill => (
            <div key={skill.name} className="skill-item-primary" title={skill.name}>
              <div className="skill-icon-wrapper" style={{ '--icon-color': skill.color }}>
                <i className={skill.icon}></i>
              </div>
              <span className="skill-name">{skill.name}</span>
            </div>
          ))}
        </div>

        <div className="skill-divider"></div>
        
        <div className="skill-tools-secondary">
          {tools.map(tool => (
            <span key={tool} className="tool-tag">{tool}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillCategory({ title, icon, skills, refCallback }) {
  return (
    <div className="skills-category fade-in" ref={refCallback}>
      <h3><i className={`fas ${icon}`}></i> {title}</h3>
      <div className="skills-grid">
        {skills.map(skill => (
          <div key={skill} className="skill-tag">
            {skill === "AWS EC2" && <i className="fab fa-aws"></i>}
            {skill === "Git" && <i className="fab fa-git-alt"></i>}
            {skill === "GitHub" && <i className="fab fa-github"></i>}
            {skill === "Docker" && <i className="fab fa-docker"></i>}
            {skill === "Python" && <i className="fab fa-python"></i>}
            {skill === "HTML" && <i className="fab fa-html5"></i>}
            {skill === "CSS" && <i className="fab fa-css3-alt"></i>}
            {skill === "JavaScript" && <i className="fab fa-js"></i>}
            {skill === "Linux" && <i className="fab fa-linux"></i>}
            {skill === "Ubuntu" && <i className="fab fa-ubuntu"></i>}
            {skill === "Kubernetes" && <i className="fas fa-dharmachakra"></i>}
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ date, title, company, desc, refCallback }) {
  return (
    <div className="timeline-item fade-in" ref={refCallback}>
      <div className="timeline-dot"></div>
      <div className="timeline-date">{date}</div>
      <div className="timeline-content">
        <h3>{title}</h3>
        <span className="company">{company}</span>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function CertCard({ title, company, year, icon, refCallback }) {
  return (
    <div className="cert-card fade-in" ref={refCallback}>
      <div className="cert-icon">
        <i className={icon || 'fas fa-certificate'}></i>
      </div>
      <div className="cert-info">
        <h3>{title}</h3>
        <p>{company}</p>
        <span className="cert-year">{year}</span>
      </div>
    </div>
  );
}

function ProjectCard({ className, title, desc, tags, link, bgImg, refCallback, onOpen }) {
  return (
    <div 
      className={`project-card-new fade-in ${className}`} 
      ref={refCallback}
      onClick={onOpen}
    >
      <div className="project-card-inner glass-effect">
        <div className="project-image-container">
          <img src={bgImg} alt={title} className="project-img" />
          <div className="project-overlay">
            <div className="project-actions">
              <button className="action-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                <i className="fas fa-eye"></i>
              </button>
              <a href={link} target="_blank" rel="noopener noreferrer" className="action-btn" onClick={(e) => e.stopPropagation()}>
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="project-details">
          <div className="project-tags">
            {tags.slice(0, 3).map(tag => <span key={tag} className="project-tag">{tag}</span>)}
            {tags.length > 3 && <span className="project-tag">+{tags.length - 3}</span>}
          </div>
          <h3>{title}</h3>
          <p>{desc}</p>
          <div className="project-footer">
            <button className="btn-details" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
              Explore Case Study <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ isOpen, project, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <i className="fas fa-times"></i>
        </button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={project.img} alt={project.title} />
          </div>
          <div className="modal-info">
            <div className="modal-header">
              <h2>{project.title}</h2>
              <div className="modal-tags">
                {project.tags.map(tag => <span key={tag} className="modal-tag">{tag}</span>)}
              </div>
            </div>
            <div className="modal-description">
              <p>{project.desc}</p>
            </div>
            <div className="modal-actions">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="fab fa-github"></i>
                <span>Source Code</span>
              </a>
              <button className="btn btn-secondary" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
