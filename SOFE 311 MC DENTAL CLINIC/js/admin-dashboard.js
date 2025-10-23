document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has admin role
    const currentUser = checkAuth();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserData();
    
    // Setup navigation
    setupNavigation();
    
    // Load dashboard data
    loadDashboardStats();
    loadStaffList();
    loadDoctorsList();
    loadServicesAndPromos();
    loadScheduleManagement();
    loadAllPatients();
    
    // Setup modal handlers
    setupModalHandlers();
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

function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    
    // Calculate stats
    const totalPatients = users.filter(u => u.role === 'patient').length;
    const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length;
    const activeStaff = users.filter(u => u.role === 'staff' || u.role === 'admin').length;
    const totalServices = services.length;
    
    // Update stats display
    document.getElementById('totalPatients').textContent = totalPatients;
    document.getElementById('todayAppointments').textContent = todayAppointments;
    document.getElementById('activeStaff').textContent = activeStaff;
    document.getElementById('totalServices').textContent = totalServices;
}

function loadStaffList() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const staffList = document.querySelector('.staff-list');
    const staffMembers = users.filter(u => u.role === 'staff' || u.role === 'admin');
    
    staffList.innerHTML = '';
    
    staffMembers.forEach(staff => {
        const card = document.createElement('div');
        card.className = 'staff-card';
        card.innerHTML = `
            <div class="staff-info">
                <h3>${staff.name}</h3>
                <p>Email: ${staff.email}</p>
                <p>Role: ${staff.role}</p>
            </div>
            <div class="staff-actions">
                <button class="action-btn edit" onclick="editStaff('${staff.email}')">Edit</button>
                <button class="action-btn delete" onclick="deleteStaff('${staff.email}')">Delete</button>
            </div>
        `;
        staffList.appendChild(card);
    });
}

function loadDoctorsList() {
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    const doctorsList = document.querySelector('.doctors-list');
    
    doctorsList.innerHTML = '';
    
    doctors.forEach(doctor => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p>Specialization: ${doctor.specialization}</p>
                <p>Email: ${doctor.email}</p>
                <p>Phone: ${doctor.phone}</p>
            </div>
            <div class="doctor-actions">
                <button class="action-btn edit" onclick="editDoctor('${doctor.email}')">Edit</button>
                <button class="action-btn delete" onclick="deleteDoctor('${doctor.email}')">Delete</button>
            </div>
        `;
        doctorsList.appendChild(card);
    });
}

function loadServicesAndPromos() {
    loadServices();
    loadPromos();
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    const servicesList = document.querySelector('.services-list');
    
    servicesList.innerHTML = '';
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <p><strong>Price:</strong> ₱${service.price.toLocaleString()}</p>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
            <div class="service-actions">
                <button class="action-btn edit" onclick="editService(${service.id})">Edit</button>
                <button class="action-btn delete" onclick="deleteService(${service.id})">Delete</button>
            </div>
        `;
        servicesList.appendChild(card);
    });
}

function loadPromos() {
    const promos = JSON.parse(localStorage.getItem('promotions')) || [];
    const promosList = document.querySelector('.promos-list');
    
    promosList.innerHTML = '';
    
    promos.forEach(promo => {
        const card = document.createElement('div');
        card.className = 'promo-card';
        card.innerHTML = `
            <h3>${promo.title}</h3>
            <p>${promo.description}</p>
            <p><strong>Discount:</strong> ${promo.discount}%</p>
            <p><strong>Valid:</strong> ${new Date(promo.startDate).toLocaleDateString()} - ${new Date(promo.endDate).toLocaleDateString()}</p>
            <div class="promo-actions">
                <button class="action-btn edit" onclick="editPromo(${promo.id})">Edit</button>
                <button class="action-btn delete" onclick="deletePromo(${promo.id})">Delete</button>
            </div>
        `;
        promosList.appendChild(card);
    });
}

function loadScheduleManagement() {
    loadClinicHours();
    loadDoctorSchedules();
}

function loadClinicHours() {
    const clinicHours = JSON.parse(localStorage.getItem('clinicHours')) || {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { open: '', close: '' }
    };
    
    const form = document.getElementById('clinicHoursForm');
    form.innerHTML = '';
    
    Object.entries(clinicHours).forEach(([day, hours]) => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-schedule';
        dayDiv.innerHTML = `
            <h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>
            <div class="hours-input">
                <input type="time" value="${hours.open}" onchange="updateClinicHours('${day}', 'open', this.value)">
                <span>to</span>
                <input type="time" value="${hours.close}" onchange="updateClinicHours('${day}', 'close', this.value)">
            </div>
        `;
        form.appendChild(dayDiv);
    });
}

function loadDoctorSchedules() {
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    const schedulesList = document.getElementById('doctorSchedulesList');
    
    schedulesList.innerHTML = '';
    
    doctors.forEach(doctor => {
        const scheduleCard = document.createElement('div');
        scheduleCard.className = 'schedule-card';
        scheduleCard.innerHTML = `
            <h4>${doctor.name}</h4>
            <div class="schedule-grid">
                ${generateDoctorScheduleInputs(doctor)}
            </div>
        `;
        schedulesList.appendChild(scheduleCard);
    });
}

function loadAllPatients() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const patients = users.filter(u => u.role === 'patient');
    const tbody = document.getElementById('patientsTableBody');
    
    tbody.innerHTML = '';
    
    patients.forEach(patient => {
        const patientAppointments = appointments.filter(apt => apt.patientEmail === patient.email);
        const lastVisit = getLastVisitDate(patientAppointments);
        const totalVisits = patientAppointments.filter(apt => apt.status === 'completed').length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.email}</td>
            <td>${lastVisit}</td>
            <td>${totalVisits}</td>
            <td>
                <button class="action-btn edit" onclick="viewPatientDetails('${patient.email}')">View Details</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal Handlers
function setupModalHandlers() {
    // Add Staff Form Handler
    document.getElementById('addStaffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newStaff = {
            name: document.getElementById('staffName').value,
            email: document.getElementById('staffEmail').value,
            password: document.getElementById('staffPassword').value,
            role: document.getElementById('staffRole').value
        };
        
        addNewStaff(newStaff);
    });
    
    // Add Doctor Form Handler
    document.getElementById('addDoctorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newDoctor = {
            name: document.getElementById('doctorName').value,
            specialization: document.getElementById('doctorSpecialization').value,
            email: document.getElementById('doctorEmail').value,
            phone: document.getElementById('doctorPhone').value
        };
        
        addNewDoctor(newDoctor);
    });
    
    // Add Service Form Handler
    document.getElementById('addServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newService = {
            id: Date.now(),
            name: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            price: parseFloat(document.getElementById('servicePrice').value),
            duration: parseInt(document.getElementById('serviceDuration').value)
        };
        
        addNewService(newService);
    });
    
    // Add Promotion Form Handler
    document.getElementById('addPromoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPromo = {
            id: Date.now(),
            title: document.getElementById('promoTitle').value,
            description: document.getElementById('promoDescription').value,
            discount: parseInt(document.getElementById('promoDiscount').value),
            startDate: document.getElementById('promoStartDate').value,
            endDate: document.getElementById('promoEndDate').value
        };
        
        addNewPromotion(newPromo);
    });
}

// Helper Functions
function getLastVisitDate(appointments) {
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    if (completedAppointments.length === 0) return 'No visits';
    
    const lastVisit = new Date(Math.max(...completedAppointments.map(apt => new Date(apt.date))));
    return lastVisit.toLocaleDateString();
}

function generateDoctorScheduleInputs(doctor) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => `
        <div class="day-schedule">
            <h5>${day}</h5>
            <div class="hours-input">
                <input type="time" value="${doctor.schedule?.[day.toLowerCase()]?.start || ''}"
                       onchange="updateDoctorSchedule('${doctor.email}', '${day.toLowerCase()}', 'start', this.value)">
                <span>to</span>
                <input type="time" value="${doctor.schedule?.[day.toLowerCase()]?.end || ''}"
                       onchange="updateDoctorSchedule('${doctor.email}', '${day.toLowerCase()}', 'end', this.value)">
            </div>
        </div>
    `).join('');
}

// CRUD Operations
function addNewStaff(staffData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(staffData);
    localStorage.setItem('users', JSON.stringify(users));
    loadStaffList();
    closeModal('addStaffModal');
}

function addNewDoctor(doctorData) {
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    doctors.push(doctorData);
    localStorage.setItem('doctors', JSON.stringify(doctors));
    loadDoctorsList();
    closeModal('addDoctorModal');
}

function addNewService(serviceData) {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
    services.push(serviceData);
    localStorage.setItem('dentalServices', JSON.stringify(services));
    loadServices();
    closeModal('addServiceModal');
}

function addNewPromotion(promoData) {
    const promos = JSON.parse(localStorage.getItem('promotions')) || [];
    promos.push(promoData);
    localStorage.setItem('promotions', JSON.stringify(promos));
    loadPromos();
    closeModal('addPromoModal');
}

// Modal Utility Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show Modal Functions
function showAddStaffModal() {
    showModal('addStaffModal');
}

function showAddDoctorModal() {
    showModal('addDoctorModal');
}

function showAddServiceModal() {
    showModal('addServiceModal');
}

function showAddPromoModal() {
    showModal('addPromoModal');
}

// Update Functions
function updateClinicHours(day, type, value) {
    const clinicHours = JSON.parse(localStorage.getItem('clinicHours')) || {};
    if (!clinicHours[day]) clinicHours[day] = {};
    clinicHours[day][type] = value;
    localStorage.setItem('clinicHours', JSON.stringify(clinicHours));
}

function updateDoctorSchedule(doctorEmail, day, type, value) {
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    const doctorIndex = doctors.findIndex(d => d.email === doctorEmail);
    
    if (doctorIndex !== -1) {
        if (!doctors[doctorIndex].schedule) doctors[doctorIndex].schedule = {};
        if (!doctors[doctorIndex].schedule[day]) doctors[doctorIndex].schedule[day] = {};
        doctors[doctorIndex].schedule[day][type] = value;
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }
}

// Delete Functions
function deleteStaff(email) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadStaffList();
    }
}

function deleteDoctor(email) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        const updatedDoctors = doctors.filter(d => d.email !== email);
        localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
        loadDoctorsList();
    }
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        const services = JSON.parse(localStorage.getItem('dentalServices')) || [];
        const updatedServices = services.filter(s => s.id !== id);
        localStorage.setItem('dentalServices', JSON.stringify(updatedServices));
        loadServices();
    }
}

function deletePromo(id) {
    if (confirm('Are you sure you want to delete this promotion?')) {
        const promos = JSON.parse(localStorage.getItem('promotions')) || [];
        const updatedPromos = promos.filter(p => p.id !== id);
        localStorage.setItem('promotions', JSON.stringify(updatedPromos));
        loadPromos();
    }
}

// View Patient Details
function viewPatientDetails(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const patient = users.find(u => u.email === email);
    
    if (patient) {
        // Implementation for viewing patient details
        // This could open a modal or navigate to a detailed view
        alert('Patient details view to be implemented');
    }
}