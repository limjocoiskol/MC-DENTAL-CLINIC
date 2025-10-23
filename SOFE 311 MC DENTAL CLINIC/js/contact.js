document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            // In a real application, this would be sent to a server
            // For now, we'll store it in localStorage
            saveContactMessage(formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
        });
    }
}

function saveContactMessage(message) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

function showSuccessMessage() {
    // Create success message element if it doesn't exist
    let successMessage = document.querySelector('.success-message');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(successMessage, contactForm);
    }
    
    // Show success message
    successMessage.style.display = 'block';
    successMessage.textContent = 'Thank you for your message. We will get back to you soon!';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Form validation functions
function validateName(name) {
    return name.length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function validateMessage(message) {
    return message.length >= 10;
}

function showError(message) {
    // Create error message element if it doesn't exist
    let errorMessage = document.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(errorMessage, contactForm);
    }
    
    // Show error message
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}
