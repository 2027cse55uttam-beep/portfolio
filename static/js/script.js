// Mobile Nav Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animate on Scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.classList.add('animate-setup'); // optional: for initial hidden state
    observer.observe(el);
});

// Contact Form - Real Submit + Smooth Feedback (No Alert!)
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.submit-btn');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Disable button & show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    try {
        const formData = new FormData(form);

        const response = await fetch(form.getAttribute('action') || '', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                // Django expects CSRF token in headers when using fetch
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        if (response.ok) {
            // Success: Show smooth message
            showFeedback('Thank you! Your message has been sent. I\'ll reply soon!', 'success');
            form.reset();
            // Reset border colors
            form.querySelectorAll('input, textarea').forEach(field => {
                field.style.borderColor = '';
            });
        } else {
            throw new Error('Server error');
        }

    } catch (error) {
        showFeedback('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// Beautiful Feedback Message (No Alert!)
function showFeedback(message, type) {
    // Remove old message if exists
    const oldMsg = document.querySelector('.form-feedback');
    if (oldMsg) oldMsg.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;

    // Styling directly ya phir CSS mein daal lena
    Object.assign(feedback.style, {
        marginTop: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        fontWeight: '500',
        textAlign: 'center',
        animation: 'slideDown 0.4s ease',
        opacity: '0',
    });

    if (type === 'success') {
        feedback.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        feedback.style.color = 'white';
    } else {
        feedback.style.background = '#feb2b2';
        feedback.style.color = '#9b2c2c';
    }

    form.appendChild(feedback);

    // Fade in
    setTimeout(() => feedback.style.opacity = '1', 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 400);
    }, 5000);
}