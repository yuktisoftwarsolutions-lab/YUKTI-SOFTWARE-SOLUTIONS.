document.addEventListener('DOMContentLoaded', () => {

    // --- Particle Network Animation ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if(this.x < 0 || this.x > width) this.vx = -this.vx;
                if(this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 230, 118, 0.4)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = Math.min(Math.floor(width * height / 15000), 100);
            for(let i=0; i<numParticles; i++) particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for(let i=0; i<particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                for(let j=i+1; j<particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 176, 255, ${1 - dist/120})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();
    }

    // Scroll handling for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetContent = document.querySelector(targetId);
            
            if (targetContent) {
                targetContent.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Dynamic background effect based on cursor (subtle)
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const mesh = document.querySelector('.bg-mesh');
        if (mesh) {
            mesh.style.background = `
                radial-gradient(circle at ${20 + (x * 10)}% ${30 + (y * 10)}%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
                radial-gradient(circle at ${80 - (x * 10)}% ${70 - (y * 10)}%, rgba(0, 210, 255, 0.05) 0%, transparent 50%)
            `;
        }
    });

    // AI Chatbot Logic
    const openChatBtn = document.getElementById('open-chat');
    const closeChatBtn = document.getElementById('close-chat');
    const chatWidget = document.getElementById('ai-chat');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (openChatBtn && closeChatBtn && chatWidget) {
        openChatBtn.addEventListener('click', () => {
            chatWidget.style.display = 'flex';
            openChatBtn.style.display = 'none';
            chatInput.focus();
        });

        closeChatBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
            openChatBtn.style.display = 'flex';
        });

        const addMessage = (text, isUser = false) => {
            const msg = document.createElement('div');
            msg.style.padding = '0.8rem';
            msg.style.borderRadius = '10px';
            msg.style.marginBottom = '1rem';
            msg.style.fontSize = '0.9rem';
            msg.style.maxWidth = '80%';
            
            if (isUser) {
                msg.style.background = 'rgba(0, 210, 255, 0.1)';
                msg.style.alignSelf = 'flex-end';
                msg.style.marginLeft = 'auto';
                msg.style.color = '#fff';
            } else {
                msg.style.background = 'rgba(255, 255, 255, 0.05)';
                msg.style.marginRight = 'auto';
                msg.style.color = 'var(--text-muted)';
            }
            
            msg.innerText = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                const userText = chatInput.value;
                addMessage(userText, true);
                chatInput.value = '';

                // Simulated AI Response
                setTimeout(() => {
                    let response = "That's interesting! Our AI specialists can definitely look into that. Would you like to schedule a consultation?";
                    const inputLower = userText.toLowerCase();
                    if (inputLower === 'hi' || inputLower === 'hello' || inputLower === 'hey') {
                        response = "Hi there! How can I help you today?";
                    } else if (inputLower.includes('security') || inputLower.includes('tools') || inputLower.includes('vapt')) {
                        response = "We offer comprehensive VAPT services, Digital Forensics, and custom cybersecurity tools. We are proud technical partners for the Akola Cyber Cell!";
                    } else if (inputLower.includes('eagle eye') || inputLower.includes('osint')) {
                        response = "EAGLE EYE is our premier OSINT intelligence-gathering framework used by security professionals for deep-web searches and footprinting.";
                    } else if (inputLower.includes('antigravity') || inputLower.includes('exam')) {
                        response = "ANTIGRAVITY is our AI-powered Automated Exam Generator. It creates randomized, high-quality question papers to prevent leaks.";
                    } else if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('quotation')) {
                        response = "We provide custom quotes based on the complexity, timeline, and security requirements of your project. Please email us at hello@yuktisolutions.com for details.";
                    } else if (inputLower.includes('location') || inputLower.includes('where') || inputLower.includes('address')) {
                        response = "Our headquarters are located in Akola, Maharashtra, India.";
                    } else if (inputLower.includes('automation') || inputLower.includes('python')) {
                        response = "We build custom AI chatbots and Python automation scripts to eliminate manual tasks and improve your business efficiency.";
                    } else if (inputLower.includes('software') || inputLower.includes('web')) {
                        response = "We build modern responsive websites, robust Python backends (Django/Flask), and scalable SaaS products.";
                    }
                    addMessage(response);
                }, 1000);
            }
        });
    }

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your inquiry has been sent to Yukti Software Solutions. We will get back to you within 24 hours.');
                btn.innerText = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 1500);
        });
    }

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
        });

        // --- Welcome Popup Logic ---
        const welcomePopup = document.getElementById('welcome-popup');
        const closePopupBtn = document.getElementById('close-popup');
        const exploreBtnPopup = document.getElementById('explore-btn-popup');

        if (welcomePopup && !localStorage.getItem('popupShown')) {
            setTimeout(() => {
                welcomePopup.style.display = 'flex';
                // Slight delay before adding the class to allow display:flex to apply
                setTimeout(() => {
                    welcomePopup.classList.add('show');
                }, 10);
            }, 2000); // Show popup 2 seconds after load
        }

        function closePopup() {
            welcomePopup.classList.remove('show');
            setTimeout(() => {
                welcomePopup.style.display = 'none';
            }, 400); // wait for CSS transition
            localStorage.setItem('popupShown', 'true'); // Only show once per session/browser
        }

        if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
        if (exploreBtnPopup) {
            exploreBtnPopup.addEventListener('click', () => {
                closePopup();
                document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // --- Team Modal Logic ---
        const teamModal = document.getElementById('team-modal');
        const closeTeamModal = document.getElementById('close-team-modal');
        
        window.openTeamNode = (name, role) => {
            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-role').textContent = role;
            
            const graphic = document.getElementById('modal-graphic');
            const roleSpan = document.getElementById('modal-role');
            const initial = document.getElementById('modal-initial');
            initial.textContent = name.charAt(0);
            
            let color = '#fff';
            if (role === 'FOUNDER') color = 'var(--accent-primary)';
            else if (role === 'CO-FOUNDER') color = 'var(--accent-secondary)';
            else if (role === 'CEO') color = '#00b0ff';

            graphic.style.setProperty('--accent', color);
            roleSpan.style.color = color;
            initial.style.color = color;

            teamModal.style.display = 'flex';
            setTimeout(() => teamModal.classList.add('show'), 10);
        };

        if (closeTeamModal) {
            closeTeamModal.addEventListener('click', () => {
                teamModal.classList.remove('show');
                setTimeout(() => teamModal.style.display = 'none', 400);
            });
        }

        if (localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'none';
        }
    }

});
