// Reading progress bar
function updateReadingProgress() {
  const article = document.querySelector('article');
  if (!article) return;
  
  const scrolled = window.scrollY;
  const height = article.offsetHeight - window.innerHeight;
  const progress = (scrolled / height) * 100;
  
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    progressBar.style.width = Math.min(progress, 100) + '%';
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Dark mode toggle
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Typing animation for hero text
function initTypingAnimation() {
  const texts = [
    "Welcome to My Digital Universe 🌟",
    "Where Code Meets Creativity ✨",
    "Learning Never Stops Here 🚀"
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  const typingElement = document.querySelector('.typing-text');
  
  if (!typingElement) return;
  
  function type() {
    if (charIndex < texts[textIndex].length) {
      typingElement.textContent += texts[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else {
      setTimeout(deleteText, 2000);
    }
  }
  
  function deleteText() {
    if (charIndex > 0) {
      typingElement.textContent = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(deleteText, 50);
    } else {
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    }
  }
  
  type();
}

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.post-card, .learning-card, .feature-card').forEach(el => {
    observer.observe(el);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add reading progress bar
  document.body.insertAdjacentHTML('afterbegin', '<div class="reading-progress"></div>');
  
  // Add theme toggle
  document.body.insertAdjacentHTML('beforeend', `
    <div class="theme-toggle" title="Toggle theme">
      <span>🌙</span>
    </div>
  `);
  
  // Initialize all features
  initSmoothScrolling();
  initThemeToggle();
  initTypingAnimation();
  initScrollAnimations();
  
  // Update reading progress on scroll
  window.addEventListener('scroll', updateReadingProgress);
  
  // Add some particle effects
  createParticles();
});

// Simple particle system
function createParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particles';
  document.body.appendChild(particleContainer);
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(255,255,255,0.5);
      border-radius: 50%;
      pointer-events: none;
      animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
      left: ${Math.random() * 100}vw;
      animation-delay: ${Math.random() * 5}s;
    `;
    particleContainer.appendChild(particle);
  }
}