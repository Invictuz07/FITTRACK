import { html } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { hasUser } from '../store.js';
import { addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';

export default async function landingPage() {
  const userExists = hasUser();
  const ctaText = userExists ? 'Continue Your Journey →' : 'Start Your Transformation →';

  const page = html(`
    <div class="landing">
      <!-- HTML5 Canvas for Starry Universe / Nebula Effect -->
      <canvas id="universe-canvas" class="landing__canvas"></canvas>
      <div class="landing__bg-gradient"></div>
      
      <div class="ambient-orb ambient-orb--blue"></div>
      <div class="ambient-orb ambient-orb--purple"></div>

      <section class="landing__hero">
        <h1 class="landing__title text-gradient-shine">FIT<span class="text-accent">TRACK</span></h1>
        <p class="landing__subtitle">Your Personalized Fitness Command Center</p>
        
        <div class="landing__image-container">
          <img src="./images/david.jpg" alt="FitTrack Hero" class="landing__hero-image" />
          <div class="landing__image-glow"></div>
        </div>
        
        <button class="btn-primary landing__cta-btn ripple-container">${ctaText}</button>
      </section>

      <span class="landing__credit">Made by Aziz</span>
    </div>
  `);

  // Navigate based on whether user data exists
  const ctaBtn = page.querySelector('.landing__cta-btn');
  ctaBtn.addEventListener('click', (e) => {
    addRipple(e);
    const destination = userExists ? '/dashboard' : '/onboarding';
    setTimeout(() => navigateTo(destination), 300);
  });

  // GSAP animations for text and image reveal
  const title = page.querySelector('.landing__title');
  const subtitle = page.querySelector('.landing__subtitle');
  const imageContainer = page.querySelector('.landing__image-container');

  gsap.fromTo(title, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
  gsap.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' });
  gsap.fromTo(imageContainer, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, delay: 0.4, ease: 'back.out(1.2)' });
  gsap.fromTo(ctaBtn, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.7, ease: 'power3.out' });

  // ── 🌌 Starry Universe Canvas Animation ─────────────────────────────────────
  const canvas = page.querySelector('#universe-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Track mouse coordinates for interactive parallax shift
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - w / 2) * 0.08;
      mouseY = (e.clientY - h / 2) * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star Class
    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * w * 2;
        this.y = (Math.random() - 0.5) * h * 2;
        this.z = Math.random() * w; // depth
        this.color = this.getRandomColor();
        this.size = Math.random() * 1.5 + 0.5;
      }

      getRandomColor() {
        const colors = [
          'rgba(255, 255, 255, ',     // Pure white
          'rgba(173, 216, 230, ',     // Light blue
          'rgba(230, 190, 255, ',     // Muted purple
          'rgba(255, 240, 200, '      // Warm gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update(speed) {
        this.z -= speed;
        if (this.z <= 0) {
          this.reset();
        }
      }

      draw(offsetX, offsetY) {
        // 3D projection
        const px = (this.x / this.z) * w * 0.8 + w / 2 + offsetX;
        const py = (this.y / this.z) * h * 0.8 + h / 2 + offsetY;

        // Draw only if on screen
        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const depthRatio = 1 - this.z / w;
          const currentSize = this.size * depthRatio * 3;
          const alpha = depthRatio * 0.8;

          ctx.beginPath();
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = this.color + alpha + ')';
          ctx.fill();
        }
      }
    }

    // Generate Stars
    const numStars = 150;
    const stars = Array.from({ length: numStars }, () => new Star());

    // Nebula Gas Clouds
    class NebulaCloud {
      constructor(color1, color2) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.r = Math.random() * 300 + 200;
        this.color1 = color1;
        this.color2 = color2;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently off borders
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.r);
        grad.addColorStop(0, this.color1);
        grad.addColorStop(1, this.color2);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const nebulae = [
      new NebulaCloud('rgba(41, 121, 255, 0.06)', 'transparent'), // Blue
      new NebulaCloud('rgba(138, 43, 226, 0.05)', 'transparent'), // Purple
      new NebulaCloud('rgba(255, 82, 82, 0.03)', 'transparent')    // Subtle Red highlight
    ];

    // Animation Loop
    let active = true;
    const animate = () => {
      if (!active || !canvas.parentNode) return;

      // Deep space background fill
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, w, h);

      // Draw nebulae
      nebulae.forEach(n => {
        n.update();
        n.draw();
      });

      // Smooth mouse parallax interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Draw and update stars (forward warp speed)
      const warpSpeed = 1.8;
      stars.forEach(star => {
        star.update(warpSpeed);
        star.draw(targetX, targetY);
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup events & loops on destroy
    page.cleanup = () => {
      active = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }

  return page;
}
