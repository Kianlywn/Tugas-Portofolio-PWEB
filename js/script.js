function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const topPos = section.getBoundingClientRect().top + window.pageYOffset;
        const startPos = window.pageYOffset;
        const distance = topPos - startPos;
        const duration = 1000; //ms
        let startTime = null;

        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            window.scrollTo(0, startPos + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        requestAnimationFrame(animateScroll);
    }
}

const hero = document.getElementById('hero');
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
hero.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = hero.offsetWidth;
canvas.height = hero.offsetHeight;

window.addEventListener('resize', () => {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
function createParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
            particles.splice(index, 1);
        }
    });
    if (particles.length < 100) {
        createParticles();
    }
    requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

const projects = document.querySelectorAll('.project');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

projects.forEach(project => {
    project.style.opacity = 0;
    project.style.transform = 'translateY(50px)';
    project.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(project);
});