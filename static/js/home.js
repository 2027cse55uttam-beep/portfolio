const form = document.getElementById('contact-form');

if (form) {
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        try {
            const formData = new FormData(form);

            const response = await fetch(form.getAttribute('action') || '', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });

            if (response.ok) {
                showFeedback('Thank you! Your message has been sent. I\'ll reply soon!', 'success');
                form.reset();
            } else {
                throw new Error('Server error');
            }

        } catch (error) {
            showFeedback('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
