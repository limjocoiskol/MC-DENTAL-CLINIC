document.addEventListener('DOMContentLoaded', function() {
    loadTeamMembers();
});

function loadTeamMembers() {
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [
        {
            name: 'Dr. Maria Santos',
            specialization: 'General Dentistry',
            image: 'images/doctor-1.jpg',
            description: 'With over 15 years of experience in general dentistry.'
        },
        {
            name: 'Dr. Juan Cruz',
            specialization: 'Orthodontics',
            image: 'images/doctor-2.jpg',
            description: 'Specialist in orthodontic treatments and smile design.'
        },
        {
            name: 'Dr. Ana Reyes',
            specialization: 'Pediatric Dentistry',
            image: 'images/doctor-3.jpg',
            description: 'Dedicated to providing gentle care for our youngest patients.'
        },
        {
            name: 'Dr. Carlos Garcia',
            specialization: 'Oral Surgery',
            image: 'images/doctor-4.jpg',
            description: 'Expert in complex dental surgeries and implants.'
        }
    ];

    const teamGrid = document.querySelector('.team-grid');
    teamGrid.innerHTML = '';

    doctors.forEach(doctor => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}">
            <div class="team-member-info">
                <h3>${doctor.name}</h3>
                <p class="specialization">${doctor.specialization}</p>
                <p class="description">${doctor.description}</p>
            </div>
        `;
        teamGrid.appendChild(memberCard);
    });
}