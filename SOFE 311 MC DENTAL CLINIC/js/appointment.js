document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = checkAuth();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Load services
    loadServices();
    
    // Load payment methods
    loadPaymentMethods();
    
    // Setup form handlers
    setupFormHandlers();
});

function loadUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const user = users.find(u => u.email === currentUser.email);
    
    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
    }
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    const serviceSelect = document.getElementById('service');
    
    serviceSelect.innerHTML = '<option value="">Choose a service...</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });

    // Add change event listener
    serviceSelect.addEventListener('change', function() {
        updateServiceDetails(this.value);
    });
}

function updateServiceDetails(serviceId) {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    const service = services.find(s => s.id === parseInt(serviceId));
    const serviceDetails = document.getElementById('serviceDetails');
    
    if (service) {
        serviceDetails.innerHTML = `
            <h4>${service.name}</h4>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
            <p><strong>Price:</strong> ₱${service.price.toLocaleString()}</p>
            <p><strong>Description:</strong> ${service.description}</p>
        `;
        serviceDetails.classList.add('active');
    } else {
        serviceDetails.innerHTML = '';
        serviceDetails.classList.remove('active');
    }
}

function loadPaymentMethods() {
    const paymentMethods = [
        {
            id: 'cash',
            name: 'Cash',
            icon: 'images/cash-icon.png'
        },
        {
            id: 'gcash',
            name: 'GCash',
            icon: 'images/gcash-icon.png'
        },
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: 'images/card-icon.png'
        }
    ];

    const paymentOptions = document.querySelector('.payment-options');
    paymentOptions.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const option = document.createElement('div');
        option.className = 'payment-option';
        option.dataset.method = method.id;
        option.innerHTML = `
            <img src="${method.icon}" alt="${method.name}">
            <p>${method.name}</p>
        `;
        paymentOptions.appendChild(option);
    });

    // Add click handlers for payment options
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function setupFormHandlers() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const appointmentForm = document.getElementById('appointmentForm');

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Handle date changes
    dateInput.addEventListener('change', function() {
        updateAvailableTimeSlots(this.value);
    });

    // Handle form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedPayment = document.querySelector('.payment-option.selected');
        if (!selectedPayment) {
            showError('Please select a payment method');
            return;
        }

        const appointmentData = {
            id: generateAppointmentId(),
            patientEmail: document.getElementById('email').value,
            patientName: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            paymentMethod: selectedPayment.dataset.method,
            notes: document.getElementById('notes').value,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        saveAppointment(appointmentData);
    });
}

function updateAvailableTimeSlots(selectedDate) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const timeSelect = document.getElementById('time');
    timeSelect.innerHTML = '<option value="">Select a time slot...</option>';
    
    timeSlots.forEach(slot => {
        const isBooked = appointments.some(apt => 
            apt.date === selectedDate && 
            apt.time === slot &&
            apt.status === 'scheduled'
        );
        
        if (!isBooked) {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        }
    });
}

function generateAppointmentId() {
    return 'apt_' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function saveAppointment(appointmentData) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    showSuccess('Appointment booked successfully! You will receive a confirmation shortly.');
    setTimeout(() => {
        window.location.href = 'patient-dashboard.html';
    }, 2000);
}

function showSuccess(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    
    const form = document.getElementById('appointmentForm');
    form.parentNode.insertBefore(successMessage, form);
    
    successMessage.style.display = 'block';
}

function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    const form = document.getElementById('appointmentForm');
    form.parentNode.insertBefore(errorMessage, form);
    
    errorMessage.style.display = 'block';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
        errorMessage.remove();
    }, 3000);
}