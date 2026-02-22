const yearEl = document.getElementById("current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("open");
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && navLinks) {
    navLinks.classList.remove("open");
  }
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = contactForm.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput && !emailRegex.test(emailInput.value)) {
      alert("Please enter a valid email address.");
      return;
    }

    const btn = contactForm.querySelector("button");
    const originalText = btn.textContent;

    btn.textContent = "Sending...";
    btn.disabled = true;

    setTimeout(() => {
      alert("Message sent successfully!");
      contactForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });
}

const scrollTopBtn = document.getElementById("scrollTopBtn");
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (scrollTopBtn) {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }

  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (window.scrollY > 100) {
    document.body.classList.add('is-scrolling');
  } else {
    document.body.classList.remove('is-scrolling');
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const heroH1 = document.querySelector(".hero h1");
const eyebrow = document.querySelector(".eyebrow");

if (eyebrow) {
  const originalText = eyebrow.textContent;
  const phrases = [originalText, "Full Stack Developer", "Creative Coder", "Tech Enthusiast"];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  eyebrow.textContent = "";
  const textSpan = document.createElement("span");
  eyebrow.appendChild(textSpan);
  
  const cursor = document.createElement("span");
  cursor.classList.add("typing-cursor");
  eyebrow.appendChild(cursor);

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      textSpan.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      textSpan.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      cursor.classList.remove("typing");
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      cursor.classList.remove("typing");
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before typing next
    } else {
      cursor.classList.add("typing");
    }

    setTimeout(typeWriter, typeSpeed);
  }
  
  setTimeout(typeWriter, 500);
}

if (heroH1) {
  let clickCount = 0;
  let clickTimer;
  heroH1.addEventListener("click", () => {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount === 5) {
      alert("🖱️ Secret Clicker! Game Mode Activated! 🖱️");
      launchEasterEggGame();
      clickCount = 0;
    }
    clickTimer = setTimeout(() => clickCount = 0, 500);
  });
}

const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.speedX = Math.random() * 1 - 0.5; // Drift
      this.speedY = Math.random() * 2 + 1;   // Fall
      this.size = Math.random() * 3 + 1;
      this.color = "rgba(255, 255, 255, 0.6)";
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > canvas.height) {
        this.y = 0 - this.size;
        this.x = Math.random() * canvas.width;
      }
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 5000;
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  initParticles();
  animateParticles();
}

/* Modal Logic */
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalTags = document.getElementById("modal-tags");
const modalLinks = document.getElementById("modal-links");
const closeModal = document.querySelector(".close-modal");

if (modal) {
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Prevent modal if clicking a link directly inside the card
      if (e.target.tagName === 'A') return;

      const title = card.querySelector("h3").textContent;
      const desc = card.querySelector("p").textContent;
      const tags = card.querySelector(".tags").innerHTML;
      const links = card.querySelector(".project-links").innerHTML;

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalTags.innerHTML = tags;
      modalLinks.innerHTML = links;

      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      hideModal();
    }
  });
}

/* Spotlight Effect for Glass Cards */
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transition = "transform 0s, border-color 0.22s ease";
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s ease, border-color 0.22s ease";
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  });
});

/* Video Frame Tilt Effect */
const videoFrame = document.querySelector(".video-frame");
if (videoFrame) {
  videoFrame.addEventListener("mousemove", (e) => {
    const rect = videoFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    videoFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  videoFrame.addEventListener("mouseleave", () => {
    videoFrame.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });
}

/* 3D Tag Cloud Logic */
const skills = [
  "Python", "C++", "C", "Java", "SQL",
  "NumPy", "Pandas", "Scikit-learn", "TensorFlow",
  "HTML", "CSS", "JavaScript", "React.js", "MongoDB",
  "Node.js", "Express", "Git", "Tableau", "AWS"
];

const tagCloudContainer = document.getElementById("tag-cloud-container");

if (tagCloudContainer) {
  const radius = Math.min(tagCloudContainer.offsetWidth, 400) / 2 * 0.8;
  const tags = [];

  // Create tags
  skills.forEach(skill => {
    const tag = document.createElement("div");
    tag.className = "tag-cloud-item";
    tag.textContent = skill;
    tagCloudContainer.appendChild(tag);
    tags.push({ element: tag, x: 0, y: 0, z: 0 });
  });

  // Distribute tags on a sphere (Fibonacci Sphere algorithm)
  const count = tags.length;
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  tags.forEach((tag, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;

    tag.x = Math.cos(theta) * radiusAtY * radius;
    tag.y = y * radius;
    tag.z = Math.sin(theta) * radiusAtY * radius;
  });

  let angleX = 0.001;
  let angleY = 0.001;

  // Mouse interaction
  tagCloudContainer.addEventListener("mousemove", (e) => {
    const rect = tagCloudContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    angleY = mouseX * 0.0001;
    angleX = -mouseY * 0.0001;
  });
  
  tagCloudContainer.addEventListener("mouseleave", () => {
      angleX = 0.001;
      angleY = 0.001;
  });

  function animateTagCloud() {
    const cx = Math.cos(angleX);
    const sx = Math.sin(angleX);
    const cy = Math.cos(angleY);
    const sy = Math.sin(angleY);

    tags.forEach(tag => {
      // Rotate around X
      const y1 = tag.y * cx - tag.z * sx;
      const z1 = tag.z * cx + tag.y * sx;

      // Rotate around Y
      const x2 = tag.x * cy - z1 * sy;
      const z2 = z1 * cy + tag.x * sy;

      tag.x = x2;
      tag.y = y1;
      tag.z = z2;

      // Perspective projection
      const scale = 250 / (250 - tag.z);
      const alpha = (tag.z + radius) / (2 * radius);

      tag.element.style.transform = `translate(${tag.x}px, ${tag.y}px) scale(${scale}) translate(-50%, -50%)`;
      tag.element.style.opacity = Math.max(0.2, alpha);
      tag.element.style.zIndex = Math.floor(alpha * 100);
      tag.element.style.filter = `blur(${(1 - alpha) * 3}px)`;
    });
    requestAnimationFrame(animateTagCloud);
  }
  animateTagCloud();
}

/* Custom Cursor Logic */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline) {
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Hover effect for interactive elements
    if (e.target.closest("a, button, .project-card, input, textarea")) {
      cursorOutline.style.width = "60px";
      cursorOutline.style.height = "60px";
      cursorOutline.style.backgroundColor = "rgba(0, 242, 255, 0.1)";
    } else {
      cursorOutline.style.width = "40px";
      cursorOutline.style.height = "40px";
      cursorOutline.style.backgroundColor = "transparent";
    }
  });

  function animateCursor() {
    // Smooth trailing effect for outline
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* Testimonial Slider Logic */
const testimonialSlides = document.querySelectorAll(".testimonial-slide");

if (testimonialSlides.length > 0) {
  let currentTestimonial = 0;
  
  function showNextTestimonial() {
    testimonialSlides[currentTestimonial].classList.remove("active");
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    testimonialSlides[currentTestimonial].classList.add("active");
  }

  setInterval(showNextTestimonial, 5000);
}

/* Scroll Progress Bar */
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) progressBar.style.width = scrolled + "%";
});

/* Lazy Loading Images */
const lazyImages = document.querySelectorAll("img[data-src]");

if (lazyImages.length > 0) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.onload = () => img.classList.add("loaded");
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: "0px 0px 200px 0px" });

  lazyImages.forEach((img) => imageObserver.observe(img));
}

/* Visitor Counter (Local Storage) */
let visitCount = localStorage.getItem("visit_count");
visitCount = visitCount ? parseInt(visitCount) + 1 : 1;
localStorage.setItem("visit_count", visitCount);

const footerYear = document.getElementById("current-year");
if (footerYear) {
  footerYear.parentElement.addEventListener("click", () => {
    const password = prompt("Enter admin password to view visits:");
    if (password === "admin") {
      alert(`Total Visits: ${visitCount}`);
    }
  });
}

/* Active Navigation Highlighting (ScrollSpy) */
const sections = document.querySelectorAll("section[id]");
const navLinksA = document.querySelectorAll(".nav-links a");

const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinksA.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}, { rootMargin: "-20% 0px -80% 0px" });

sections.forEach(section => scrollSpy.observe(section));

/* Konami Code Easter Egg */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      // Activate Party Mode
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const playNote = (freq, time) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
      };

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => playNote(freq, now + i * 0.1));

      setTimeout(() => {
        alert("🎉 Konami Code Activated! Party Mode On! 🎉");
      }, 100);
      
      document.documentElement.style.setProperty('--cyan', '#ff00ff');
      document.documentElement.style.setProperty('--lime', '#ffff00');
      document.documentElement.style.setProperty('--purple', '#00ffff');
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

/* Preloader */
const preloader = document.getElementById("preloader");
if (preloader) {
  window.addEventListener("load", () => {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
  });
}

/* Magnetic Buttons */
const magneticBtns = document.querySelectorAll(".hero-actions .btn");
magneticBtns.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

/* Copy Email to Clipboard */
const copyEmailBtn = document.getElementById("copy-email-btn");
const contactEmail = document.getElementById("contact-email");

if (copyEmailBtn && contactEmail) {
  copyEmailBtn.addEventListener("click", () => {
    const email = contactEmail.textContent;
    navigator.clipboard.writeText(email).then(() => {
      const originalIcon = copyEmailBtn.innerHTML;
      copyEmailBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      copyEmailBtn.style.borderColor = "var(--lime)";
      copyEmailBtn.style.color = "var(--lime)";
      
      setTimeout(() => {
        copyEmailBtn.innerHTML = originalIcon;
        copyEmailBtn.style.borderColor = "";
        copyEmailBtn.style.color = "";
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}

/* Share Button Logic */
const shareBtns = document.querySelectorAll(".share-btn");
shareBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    const card = btn.closest(".blog-card");
    const title = card.querySelector("h3").textContent;
    const text = card.querySelector("p").textContent;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch (err) { console.log('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(`${title} - ${text} ${window.location.href}`);
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      btn.style.color = "var(--lime)";
      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.color = "";
      }, 2000);
    }
  });
});

/* Blog Modal Logic */
const blogModal = document.getElementById("blog-modal");
const blogModalTitle = document.getElementById("blog-modal-title");
const blogModalDate = document.getElementById("blog-modal-date");
const blogModalBody = document.getElementById("blog-modal-body");
const closeBlogModal = document.getElementById("close-blog-modal");

if (blogModal) {
  document.querySelectorAll(".read-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".blog-card");
      const title = card.querySelector("h3").textContent;
      const date = card.querySelector(".blog-date").textContent;
      const content = card.dataset.content;

      blogModalTitle.textContent = title;
      blogModalDate.textContent = date;
      blogModalBody.textContent = content;

      blogModal.classList.add("show");
      blogModal.setAttribute("aria-hidden", "false");
    });
  });

  function hideBlogModal() {
    blogModal.classList.remove("show");
    blogModal.setAttribute("aria-hidden", "true");
  }

  if (closeBlogModal) {
    closeBlogModal.addEventListener("click", hideBlogModal);
  }

  blogModal.addEventListener("click", (e) => {
    if (e.target === blogModal) hideBlogModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && blogModal.classList.contains("show")) {
      hideBlogModal();
    }
  });
}

/* About Me Typing Effect */
const aboutText = document.getElementById("about-text");
if (aboutText) {
  const text = aboutText.textContent.trim();
  aboutText.textContent = "";
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      let i = 0;
      function type() {
        if (i < text.length) {
          aboutText.textContent += text.charAt(i);
          i++;
          setTimeout(type, 15);
        }
      }
      type();
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  
  observer.observe(aboutText);
}

function launchEasterEggGame() {
  let container = document.getElementById('game-canvas-container');
  if (!container) {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    container = document.createElement('div');
    container.id = 'game-canvas-container';
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: '10000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'auto'
    });

    const closeGame = () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      document.body.style.overflow = ''; // Restore scrolling
      if (window.noLoop) window.noLoop();
      window.closeEasterEgg = null;
    };

    window.closeEasterEgg = closeGame;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '20px',
      right: '30px',
      fontSize: '40px',
      color: '#fff',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer'
    });
    
    closeBtn.onclick = closeGame;
    
    container.appendChild(closeBtn);
    document.body.appendChild(container);

    setTimeout(() => {
      if (typeof window.setupGame === 'function') {
        window.setupGame();
        if (window.loop) window.loop();
      }
    }, 100);
  }
}

/* Rickroll on Resume Click */
const setupRickroll = () => {
  document.querySelectorAll('a').forEach(link => {
    const text = link.textContent.toLowerCase();
    const href = link.getAttribute('href')?.toLowerCase() || '';
    if (text.includes('resume') || href.includes('resume')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      });
    }
  });
};

if (document.body) setupRickroll();
else window.addEventListener('DOMContentLoaded', setupRickroll);

/* Idle Mode Detection */
let idleTimer;
const resetIdle = () => {
  document.body.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => document.body.classList.add("idle"), 15000);
};

['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, resetIdle);
});

resetIdle();

/* Text-based Cheat Codes */
let matrixInterval;
const toggleMatrixRain = () => {
  const isMatrix = document.body.classList.contains("matrix-mode");
  let canvas = document.getElementById("matrix-canvas");

  if (isMatrix) {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "matrix-canvas";
      Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "0",
        pointerEvents: "none"
      });
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "10";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 33);
  } else {
    clearInterval(matrixInterval);
    if (canvas) canvas.remove();
  }
};

let fireInterval;
const toggleFireEffect = () => {
  const isFire = document.body.classList.contains("fire-mode");
  let canvas = document.getElementById("fire-canvas");

  if (isFire) {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "fire-canvas";
      Object.assign(canvas.style, {
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "300px",
        zIndex: "9999",
        pointerEvents: "none"
      });
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 300;
    ctx.globalCompositeOperation = 'lighter';

    const particles = [];
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 20,
          size: Math.random() * 25 + 10,
          speedY: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 2,
          life: 1.0,
          hue: Math.random() * 30 + 15
        });
      }
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.1) * 0.5;
        p.size *= 0.95;
        p.life -= 0.02;
        if (p.hue > 5) p.hue -= 0.5;
        if (p.life <= 0 || p.size < 0.1) {
          particles.splice(i, 1);
          i--;
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.life})`;
        ctx.fill();
      }
    };
    clearInterval(fireInterval);
    fireInterval = setInterval(draw, 33);
  } else {
    clearInterval(fireInterval);
    if (canvas) canvas.remove();
  }
};

let cheatCodeBuffer = "";
console.log("🕵️ Psst... try typing 'debug', 'matrix', 'spin', 'rainbow', 'gravity', 'barrelroll', 'mirror', or 'fire'!");

document.addEventListener("keydown", (e) => {
  if (e.key.length === 1) {
    cheatCodeBuffer += e.key.toLowerCase();
    if (cheatCodeBuffer.length > 20) cheatCodeBuffer = cheatCodeBuffer.slice(-20);

    if (cheatCodeBuffer.endsWith("debug")) {
      document.body.classList.toggle("debug-mode");
      alert("👾 Debug Mode: " + (document.body.classList.contains("debug-mode") ? "ON" : "OFF"));
    }
    if (cheatCodeBuffer.endsWith("matrix")) {
      document.body.classList.toggle("matrix-mode");
      toggleMatrixRain();
    }
    if (cheatCodeBuffer.endsWith("spin")) {
      document.body.style.transition = "transform 1s ease-in-out";
      document.body.style.transform = "rotate(360deg)";
      setTimeout(() => {
        document.body.style.transition = "";
        document.body.style.transform = "";
      }, 1000);
    }
    if (cheatCodeBuffer.endsWith("rainbow")) {
      document.body.classList.toggle("rainbow-mode");
    }
    if (cheatCodeBuffer.endsWith("gravity")) {
      const isGravity = document.body.classList.toggle("gravity-mode");
      const elements = document.querySelectorAll('h1, h2, h3, p, a, button, img, .project-card, .blog-card, .tag-cloud-item, .timeline-item, .btn');
      
      elements.forEach(el => {
        if (isGravity) {
          el.style.transition = `transform ${Math.random() * 1 + 0.5}s cubic-bezier(0.55, 0.055, 0.675, 0.19)`;
          el.style.transform = `translateY(${window.innerHeight}px) rotate(${Math.random() * 120 - 60}deg)`;
        } else {
          el.style.transition = 'transform 0.5s ease-out';
          el.style.transform = '';
        }
      });
    }
    if (cheatCodeBuffer.endsWith("barrelroll")) {
      document.body.style.transition = "transform 2s ease-in-out";
      document.body.style.transform = "rotate(360deg)";
      setTimeout(() => {
        document.body.style.transition = "";
        document.body.style.transform = "";
      }, 2000);
    }
    if (cheatCodeBuffer.endsWith("mirror")) {
      document.body.classList.toggle("mirror-mode");
    }
    if (cheatCodeBuffer.endsWith("fire")) {
      document.body.classList.toggle("fire-mode");
      toggleFireEffect();
    }
    if (cheatCodeBuffer.endsWith("kate")) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'strangerthings' && bgMusic) {
        alert("🎶 Now entering the Upside Down... 🎶");
        bgMusic.src = 'assets/music/theme-kate.mp3';
        bgMusic.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  }
});

/* Footer Year Time Travel */
if (yearEl) {
  yearEl.addEventListener("mouseenter", () => {
    yearEl.dataset.original = yearEl.textContent;
    yearEl.interval = setInterval(() => {
      yearEl.textContent = Math.floor(Math.random() * 3000);
    }, 50);
  });
  yearEl.addEventListener("mouseleave", () => {
    clearInterval(yearEl.interval);
    yearEl.textContent = yearEl.dataset.original || new Date().getFullYear();
  });
}


/* Noise Overlay */
const addNoise = () => {
    const noise = document.createElement('div');
    noise.classList.add('noise-overlay');
    document.body.appendChild(noise);
}
if (document.body) addNoise();
else window.addEventListener('DOMContentLoaded', addNoise);

let bgMusic; // Make it accessible for easter eggs

/* Thematic Experience (Themes & Music) */
const initThematicExperience = () => {
  const themeSwitcherBtn = document.getElementById("theme-switcher-btn");
  const themePanel = document.getElementById("theme-switcher-panel");
  const closeThemeSwitcherBtn = document.getElementById("close-theme-switcher");
  const themeList = document.getElementById("theme-list");
  const htmlElement = document.documentElement;
  const bgElements = [
    document.getElementById("theme-background-1"),
    document.getElementById("theme-background-2")
  ];
  let currentBgIndex = 0;

  if (!themeSwitcherBtn || !themePanel || !themeList) return;

  bgMusic = new Audio();
  bgMusic.loop = true;
  bgMusic.volume = 0.4;

  // IMPORTANT: The music URLs are for demonstration and may not be stable or licensed for use. 
  // You should host your own audio files.
  const themes = [
    { id: 'dark', name: 'Default Dark', music: 'assets/music/The Dark Knight.mp3', backgroundImage: 'assets/images/dark.png' },
    { id: 'light', name: 'Default Light', music: 'assets/music/The Dark Knight.mp3'},
    { id: 'got', name: 'Game of Thrones', music: 'assets/music/Game of Thrones.mp3', backgroundImage: 'assets/images/got.png' },
    { id: 'pirates', name: 'Pirates', music: 'assets/music/Pirates of the Caribbean - Hes a Pirate.mp3', backgroundImage: 'assets/images/poc.png' },
    { id: 'breakingbad', name: 'Breaking Bad', music: 'assets/music/Breaking Bad.mp3', backgroundImage: 'assets/images/bb.png' },
    { id: 'harrypotter', name: 'Harry Potter', music: 'assets/music/Harry Potter - Main Theme.mp3', backgroundImage: 'assets/images/hp.png' },
    { id: 'marvel', name: 'Marvel', music: 'assets/music/The Avengers Theme Song.mp3', backgroundImage: 'assets/images/avengers.png' },
    { id: 'starwars', name: 'Star Wars', music: 'assets/music/Star Wars.mp3', backgroundImage: 'assets/images/starwars.png' },
    { id: 'strangerthings', name: 'Stranger Things', music: 'assets/music/Stranger Things.mp3', backgroundImage: 'assets/images/stranger-things.png' },
  ];

  const setTheme = (themeId) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (!selectedTheme) return;

    htmlElement.setAttribute('data-theme', themeId);
    localStorage.setItem('theme', themeId);

    document.querySelectorAll('.theme-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeId === themeId);
    });

    if (bgElements.every(el => el) && selectedTheme.backgroundImage) {
      const nextBgIndex = (currentBgIndex + 1) % 2;
      const currentBg = bgElements[currentBgIndex];
      const nextBg = bgElements[nextBgIndex];

      // Set the new image on the hidden element
      nextBg.style.backgroundImage = `url('${selectedTheme.backgroundImage}')`;
      
      // Apply special styles for Breaking Bad or reset for others
      if (themeId === 'breakingbad') {
        nextBg.style.backgroundSize = '100% auto';
        nextBg.style.backgroundPosition = 'top center';
        nextBg.style.backgroundAttachment = 'fixed';
      } else {
        nextBg.style.backgroundSize = 'cover';
        nextBg.style.backgroundPosition = 'center center';
        nextBg.style.backgroundAttachment = 'initial';
      }

      // Fade in the new one and fade out the old one
      nextBg.style.opacity = 0.5;
      currentBg.style.opacity = 0;

      currentBgIndex = nextBgIndex;
    } else { // Handle themes with no image
      bgElements.forEach(el => { if(el) el.style.opacity = 0; });
    }

    if (bgMusic.src !== selectedTheme.music) {
      const wasPlaying = !bgMusic.paused;
      bgMusic.src = selectedTheme.music;
      if (wasPlaying) {
        bgMusic.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  };

  themes.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'theme-button';
    btn.textContent = theme.name;
    btn.dataset.themeId = theme.id;
    btn.onclick = () => setTheme(theme.id);
    themeList.appendChild(btn);
  });

  let musicToggleBtn = document.getElementById("music-toggle");
  if (!musicToggleBtn) {
    musicToggleBtn = document.createElement("button");
    musicToggleBtn.id = "music-toggle";
    musicToggleBtn.innerHTML = "🎵";
    musicToggleBtn.title = "Play Music";
    document.body.appendChild(musicToggleBtn);
  }
  musicToggleBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => { musicToggleBtn.innerHTML = "⏸"; musicToggleBtn.classList.add("playing"); }).catch(err => console.error("Audio playback failed:", err));
    } else {
      bgMusic.pause();
      musicToggleBtn.innerHTML = "🎵";
      musicToggleBtn.classList.remove("playing");
    }
  });

  themeSwitcherBtn.addEventListener('click', () => themePanel.classList.add('open'));
  closeThemeSwitcherBtn.addEventListener('click', () => themePanel.classList.remove('open'));

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
};

if (document.body) initThematicExperience();
else window.addEventListener('DOMContentLoaded', initThematicExperience);

/* Command Palette (Ctrl+K) */
const initCommandPalette = () => {
  const palette = document.createElement('div');
  palette.className = 'cmd-palette-overlay';
  palette.innerHTML = `
    <div class="cmd-palette-modal">
      <div class="cmd-header">
        <input type="text" placeholder="Type a command..." id="cmd-input">
        <span class="cmd-hint">ESC to close</span>
      </div>
      <div class="cmd-list" id="cmd-list"></div>
    </div>
  `;
  document.body.appendChild(palette);

  const input = palette.querySelector('#cmd-input');
  const list = palette.querySelector('#cmd-list');
  
  const commands = [
    { icon: '🏠', label: 'Go Home', action: () => window.scrollTo({top: 0, behavior: 'smooth'}) },
    { icon: '📂', label: 'View Projects', action: () => document.getElementById('projects').scrollIntoView({behavior: 'smooth'}) },
    { icon: '👤', label: 'About Me', action: () => document.getElementById('about').scrollIntoView({behavior: 'smooth'}) },
    { icon: '📧', label: 'Contact', action: () => document.getElementById('contact').scrollIntoView({behavior: 'smooth'}) },
    { icon: '🌓', label: 'Toggle Theme', action: () => document.getElementById('theme-toggle').click() },
    { icon: '🎵', label: 'Toggle Music', action: () => document.getElementById('music-toggle').click() },
    { icon: '🎮', label: 'Play Games', action: () => launchEasterEggGame() },
    { icon: '🌧️', label: 'Matrix Mode', action: () => { document.body.classList.toggle('matrix-mode'); toggleMatrixRain(); } },
    { icon: '🔥', label: 'Fire Mode', action: () => { document.body.classList.toggle('fire-mode'); toggleFireEffect(); } },
    { icon: '🙃', label: 'Gravity Mode', action: () => { document.dispatchEvent(new KeyboardEvent('keydown', {key: 'y'})); cheatCodeBuffer='gravity'; document.dispatchEvent(new KeyboardEvent('keydown', {key: 'y'})); } } // Trigger via existing cheat logic or direct call
  ];

  const renderList = (filter = '') => {
    list.innerHTML = '';
    const filtered = commands.filter(cmd => cmd.label.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach((cmd, index) => {
      const item = document.createElement('div');
      item.className = 'cmd-item';
      if (index === 0) item.classList.add('active');
      item.innerHTML = `<span class="cmd-icon">${cmd.icon}</span><span>${cmd.label}</span>`;
      item.onclick = () => {
        cmd.action();
        closePalette();
      };
      list.appendChild(item);
    });
  };

  const openPalette = () => {
    palette.classList.add('show');
    input.value = '';
    input.focus();
    renderList();
  };

  const closePalette = () => {
    palette.classList.remove('show');
  };

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('show') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
    
    if (palette.classList.contains('show')) {
      if (e.key === 'Enter') {
        const active = list.querySelector('.cmd-item.active');
        if (active) active.click();
      }
    }
  });

  input.addEventListener('input', (e) => renderList(e.target.value));
  
  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });
};

if (document.body) initCommandPalette();
else window.addEventListener('DOMContentLoaded', initCommandPalette);

/* Scroll Decrypt Effect */
const initDecrypt = () => {
  const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const originalText = element.innerText;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
        let iteration = 0;
        decryptObserver.unobserve(element);
        const interval = setInterval(() => {
          element.innerText = originalText.split("").map((letter, index) => index < iteration ? originalText[index] : chars[Math.floor(Math.random() * chars.length)]).join("");
          if(iteration >= originalText.length) { clearInterval(interval); element.innerText = originalText; }
          iteration += 1 / 2;
        }, 30);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("h2").forEach(h2 => decryptObserver.observe(h2));
};

if (document.body) initDecrypt();
else window.addEventListener('DOMContentLoaded', initDecrypt);

/* Hero Shape-Shifting Particles (Loki Effect) */
const heroCanvas = document.getElementById("hero-particles");
if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  let width, height;
  let particles = [];
  const particleCount = 800; // Increased for a denser sphere

  const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
  };

  heroCanvas.addEventListener('mousemove', (event) => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  heroCanvas.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });
  
  const resize = () => {
    width = heroCanvas.width = heroCanvas.offsetWidth || 500;
    height = heroCanvas.height = heroCanvas.offsetHeight || 400;
    initParticles(); // Re-create particles for the new size
  };

  class MorphParticle {
    constructor(x, y) {
      this.originX = x;
      this.originY = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.density = (Math.random() * 20) + 10;
      this.color = Math.random() > 0.5 ? "#00f2ff" : (Math.random() > 0.5 ? "#0aff84" : "#bd00ff");
      this.size = Math.random() * 2 + 1;
    }
    
    update() {
      // Mouse repulsion force
      if (mouse.x !== undefined) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          this.vx += forceDirectionX * force * this.density * 0.1;
          this.vy += forceDirectionY * force * this.density * 0.1;
        }
      }

      // Return to origin force
      let returnDx = this.originX - this.x;
      let returnDy = this.originY - this.y;
      this.vx += returnDx * 0.01;
      this.vy += returnDy * 0.01;

      // Apply friction and update position
      this.vx *= 0.95;
      this.vy *= 0.95;
      
      this.x += this.vx;
      this.y += this.vy;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const sphereRadius = Math.min(width, height) / 3;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * sphereRadius; // Uniform distribution
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      particles.push(new MorphParticle(x, y));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  window.addEventListener("resize", resize);
  
  resize();
  animate();
}
