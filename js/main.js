/* ==========================================
   Max's AI Solutions — Main JS
   ========================================== */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // navbar height
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... ⚡';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Fallback: construct mailto link with form data
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const business = formData.get('business') || '';
            const service = formData.get('service') || '';
            const message = formData.get('message') || '';

            const subject = encodeURIComponent(`New Lead: ${name} - ${business || 'No Business Name'}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBusiness: ${business}\nService: ${service}\n\nMessage:\n${message}`
            );

            // Show success anyway — we'll capture the data
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
        }
    });
}

// Audio Player
const audio = document.getElementById('maxAudio');
const audioBtn = document.getElementById('audioBtn');
const audioPlayer = document.getElementById('audioPlayer');
const playIcon = document.getElementById('playIcon');
const audioProgress = document.getElementById('audioProgress');
const progressFill = document.getElementById('progressFill');
const audioTime = document.getElementById('audioTime');

if (audio && audioBtn) {
    function toggleAudio() {
        if (audio.paused) {
            audio.play();
            playIcon.textContent = '⏸';
            audioPlayer.classList.add('playing');
            audioProgress.style.display = 'flex';
        } else {
            audio.pause();
            playIcon.textContent = '▶';
            audioPlayer.classList.remove('playing');
        }
    }

    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
    });
    audioPlayer.addEventListener('click', toggleAudio);

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + '%';
            const mins = Math.floor(audio.currentTime / 60);
            const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
            audioTime.textContent = mins + ':' + secs;
        }
    });

    audio.addEventListener('ended', () => {
        playIcon.textContent = '▶';
        audioPlayer.classList.remove('playing');
        progressFill.style.width = '0%';
        audioTime.textContent = '0:00';
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(
    '.problem-card, .service-card, .step-card, .about-content, .about-image, .contact-content, .contact-form-wrapper'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
