document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has patient role
    const currentUser = checkAuth();
    if (!currentUser || currentUser.role !== 'patient') {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadAppointments();
    loadDentalChart();
    loadGallery();
    
    // Setup profile editing
    setupProfileEditing();
});

function loadUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const user = users.find(u => u.email === currentUser.email);
    
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profileDob').value = user.dob;
        document.getElementById('profileAddress').value = user.address;
    }
}

function setupNavigation() {
    const menuLinks = document.querySelectorAll('.dashboard-menu a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            menuLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupProfileEditing() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    editBtn.addEventListener('click', function() {
        inputs.forEach(input => input.removeAttribute('readonly'));
        editBtn.style.display = 'none';
        saveBtn.style.display = 'block';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name: document.getElementById('profileName').value,
                dob: document.getElementById('profileDob').value,
                address: document.getElementById('profileAddress').value
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            
            inputs.forEach(input => input.setAttribute('readonly', true));
            editBtn.style.display = 'block';
            saveBtn.style.display = 'none';
            
            alert('Profile updated successfully!');
            loadUserData();
        }
    });
}

function loadAppointments() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const userAppointments = appointments.filter(apt => apt.patientEmail === currentUser.email);
    
    const upcomingList = document.getElementById('upcomingAppointmentsList');
    const pastList = document.getElementById('pastAppointmentsList');
    const now = new Date();
    
    upcomingList.innerHTML = '';
    pastList.innerHTML = '';
    
    userAppointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        const appointmentCard = createAppointmentCard(apt);
        
        if (aptDate > now) {
            upcomingList.appendChild(appointmentCard);
        } else {
            pastList.appendChild(appointmentCard);
        }
    });
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = `appointment-card ${appointment.status}`;
    
    card.innerHTML = `
        <h4>${appointment.service}</h4>
        <div class="appointment-details">
            <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: ${appointment.time}</p>
            <p>Status: <span class="status-badge ${appointment.status}">${appointment.status}</span></p>
        </div>
        ${appointment.status === 'scheduled' ? `
            <div class="appointment-actions">
                <button onclick="rescheduleAppointment('${appointment.id}')" class="btn">Reschedule</button>
                <button onclick="cancelAppointment('${appointment.id}')" class="btn">Cancel</button>
            </div>
        ` : ''}
    `;
    
    return card;
}

function loadDentalChart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentUser.email);
    
    const treatmentList = document.getElementById('treatmentList');
    treatmentList.innerHTML = '';
    
    if (user && user.patientChart && user.patientChart.services) {
        user.patientChart.services.forEach(service => {
            const treatmentItem = document.createElement('div');
            treatmentItem.className = 'treatment-item';
            treatmentItem.innerHTML = `
                <h4>${service.name}</h4>
                <p>Date: ${new Date(service.date).toLocaleDateString()}</p>
                <p>Doctor: ${service.doctor}</p>
                <p>Notes: ${service.notes}</p>
            `;
            treatmentList.appendChild(treatmentItem);
        });
    }
}

function loadGallery() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentUser.email);
    
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = '';
    
    if (user && user.patientChart && user.patientChart.images) {
        user.patientChart.images.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${image.url}" alt="${image.description}">
                <div class="caption">
                    <p>${image.description}</p>
                    <p>Date: ${new Date(image.date).toLocaleDateString()}</p>
                </div>
            `;
            gallery.appendChild(galleryItem);
        });
    }
}

function rescheduleAppointment(appointmentId) {
    // Implement rescheduling logic
    alert('Rescheduling feature coming soon!');
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            loadAppointments();
            alert('Appointment cancelled successfully!');
        }
    }
}