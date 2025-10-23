document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has staff role
    const currentUser = checkAuth();
    if (!currentUser || currentUser.role !== 'staff') {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Setup navigation
    setupNavigation();
    
    // Load initial data
    loadAppointments();
    loadPatients();
    loadSchedule();
    loadServices();
    
    // Setup event listeners
    setupEventListeners();
});

function loadUserData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const user = users.find(u => u.email === currentUser.email);
    
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
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

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointmentsList = document.getElementById('appointmentsList');
    const dateFilter = document.getElementById('appointmentDate');
    const statusFilter = document.getElementById('statusFilter');
    
    // Set default date to today
    dateFilter.value = new Date().toISOString().split('T')[0];
    
    function filterAndDisplayAppointments() {
        const selectedDate = dateFilter.value;
        const selectedStatus = statusFilter.value;
        
        const filteredAppointments = appointments.filter(apt => {
            const dateMatch = apt.date === selectedDate;
            const statusMatch = selectedStatus === 'all' || apt.status === selectedStatus;
            return dateMatch && statusMatch;
        });
        
        appointmentsList.innerHTML = '';
        
        filteredAppointments.forEach(apt => {
            const card = document.createElement('div');
            card.className = `appointment-card ${apt.status}`;
            card.innerHTML = `
                <h4>${apt.patientName}</h4>
                <p>Time: ${apt.time}</p>
                <p>Service: ${apt.service}</p>
                <p>Status: <span class="status-badge ${apt.status}">${apt.status}</span></p>
                <div class="appointment-actions">
                    ${apt.status === 'scheduled' ? `
                        <button onclick="updateAppointmentStatus('${apt.id}', 'completed')" class="btn">Mark Complete</button>
                        <button onclick="updateAppointmentStatus('${apt.id}', 'cancelled')" class="btn">Cancel</button>
                    ` : ''}
                </div>
            `;
            appointmentsList.appendChild(card);
        });
    }
    
    dateFilter.addEventListener('change', filterAndDisplayAppointments);
    statusFilter.addEventListener('change', filterAndDisplayAppointments);
    
    filterAndDisplayAppointments();
}

function loadPatients() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const patients = users.filter(user => user.role === 'patient');
    const patientsList = document.getElementById('patientsList');
    const searchInput = document.getElementById('patientSearch');
    
    function filterAndDisplayPatients(searchTerm = '') {
        const filteredPatients = patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        patientsList.innerHTML = '';
        
        filteredPatients.forEach(patient => {
            const card = document.createElement('div');
            card.className = 'patient-card';
            card.onclick = () => showPatientDetails(patient);
            card.innerHTML = `
                <h3>${patient.name}</h3>
                <p>Email: ${patient.email}</p>
                <p>Last Visit: ${getLastVisitDate(patient)}</p>
            `;
            patientsList.appendChild(card);
        });
    }
    
    searchInput.addEventListener('input', (e) => filterAndDisplayPatients(e.target.value));
    
    filterAndDisplayPatients();
}

function getLastVisitDate(patient) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const patientAppointments = appointments.filter(apt => 
        apt.patientEmail === patient.email && apt.status === 'completed'
    );
    
    if (patientAppointments.length === 0) return 'No previous visits';
    
    const lastVisit = new Date(Math.max(...patientAppointments.map(apt => new Date(apt.date))));
    return lastVisit.toLocaleDateString();
}

function showPatientDetails(patient) {
    const modal = document.getElementById('patientModal');
    const patientDetails = document.getElementById('patientDetails');
    
    patientDetails.innerHTML = `
        <div class="patient-info">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>Date of Birth:</strong> ${patient.dob}</p>
            <p><strong>Address:</strong> ${patient.address}</p>
        </div>
        
        <div class="treatment-history">
            <h3>Treatment History</h3>
            ${generateTreatmentHistory(patient)}
        </div>
        
        <div class="patient-gallery">
            <h3>Before/After Gallery</h3>
            ${generateGallery(patient)}
        </div>
    `;
    
    modal.style.display = 'block';
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function generateTreatmentHistory(patient) {
    if (!patient.patientChart || !patient.patientChart.services || patient.patientChart.services.length === 0) {
        return '<p>No treatment history available</p>';
    }
    
    return patient.patientChart.services.map(service => `
        <div class="treatment-item">
            <h4>${service.name}</h4>
            <p>Date: ${new Date(service.date).toLocaleDateString()}</p>
            <p>Doctor: ${service.doctor}</p>
            <p>Notes: ${service.notes}</p>
        </div>
    `).join('');
}

function generateGallery(patient) {
    if (!patient.patientChart || !patient.patientChart.images || patient.patientChart.images.length === 0) {
        return '<p>No images available</p>';
    }
    
    return patient.patientChart.images.map(image => `
        <img src="${image.url}" alt="${image.description}" class="gallery-image">
    `).join('');
}

function loadSchedule() {
    const weeklySchedule = document.getElementById('weeklySchedule');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    let currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    
    function updateSchedule() {
        weeklySchedule.innerHTML = '';
        document.getElementById('currentWeek').textContent = 
            `Week of ${currentWeekStart.toLocaleDateString()}`;
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(day.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'schedule-day';
            dayElement.innerHTML = `
                <h4>${day.toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                <p>${day.toLocaleDateString()}</p>
                ${generateTimeSlots(day)}
            `;
            weeklySchedule.appendChild(dayElement);
        }
    }
    
    prevWeekBtn.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateSchedule();
    });
    
    nextWeekBtn.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateSchedule();
    });
    
    updateSchedule();
}

function generateTimeSlots(date) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];
    
    return timeSlots.map(time => {
        const isBooked = appointments.some(apt => 
            apt.date === date.toISOString().split('T')[0] && 
            apt.time === time &&
            apt.status === 'scheduled'
        );
        
        return `
            <div class="schedule-slot ${isBooked ? 'booked' : 'available'}">
                ${time} - ${isBooked ? 'Booked' : 'Available'}
            </div>
        `;
    }).join('');
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    const serviceSelect = document.getElementById('walkInService');
    
    serviceSelect.innerHTML = '<option value="">Select a service...</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });
}

function setupEventListeners() {
    const walkInForm = document.getElementById('walkInForm');
    
    walkInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const appointmentData = {
            id: generateAppointmentId(),
            patientName: document.getElementById('walkInName').value,
            phone: document.getElementById('walkInPhone').value,
            service: document.getElementById('walkInService').value,
            time: document.getElementById('walkInTime').value,
            date: new Date().toISOString().split('T')[0],
            status: 'scheduled',
            isWalkIn: true,
            createdAt: new Date().toISOString()
        };
        
        saveAppointment(appointmentData);
    });
}

function generateAppointmentId() {
    return 'apt_' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function saveAppointment(appointmentData) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert('Walk-in appointment booked successfully!');
    loadAppointments();
}

function updateAppointmentStatus(appointmentId, newStatus) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = newStatus;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
    }
}