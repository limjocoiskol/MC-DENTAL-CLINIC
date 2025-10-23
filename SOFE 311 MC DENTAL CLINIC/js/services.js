document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    loadPromotions();
});

function loadServices() {
    const services = JSON.parse(localStorage.getItem('dentalServices')) || [
        {
            id: 1,
            name: 'Regular Checkup',
            description: 'Comprehensive dental examination and cleaning to maintain your oral health.',
            price: 1000,
            duration: 30,
            image: 'images/checkup.jpg'
        },
        {
            id: 2,
            name: 'Teeth Whitening',
            description: 'Professional teeth whitening treatment for a brighter, more confident smile.',
            price: 5000,
            duration: 60,
            image: 'images/whitening.jpg'
        },
        {
            id: 3,
            name: 'Dental Filling',
            description: 'High-quality dental fillings to treat cavities and restore your teeth.',
            price: 2500,
            duration: 45,
            image: 'images/filling.jpg'
        },
        {
            id: 4,
            name: 'Root Canal',
            description: 'Expert root canal treatment to save severely damaged or infected teeth.',
            price: 8000,
            duration: 90,
            image: 'images/root-canal.jpg'
        }
    ];

    const servicesContainer = document.querySelector('.services-grid');
    servicesContainer.innerHTML = '';

    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <img src="${service.image}" alt="${service.name}" class="service-image">
            <div class="service-content">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p class="service-price">₱${service.price.toLocaleString()}</p>
                <p class="service-duration">Duration: ${service.duration} minutes</p>
            </div>
        `;
        servicesContainer.appendChild(card);
    });
}

function loadPromotions() {
    const promotions = JSON.parse(localStorage.getItem('promotions')) || [
        {
            id: 1,
            title: 'New Patient Special',
            description: 'First-time patients receive a comprehensive exam and cleaning at a special rate.',
            discount: 20,
            startDate: '2025-10-01',
            endDate: '2025-12-31'
        },
        {
            id: 2,
            title: 'Family Package',
            description: 'Book appointments for the whole family and save on total treatment costs.',
            discount: 15,
            startDate: '2025-10-01',
            endDate: '2025-12-31'
        },
        {
            id: 3,
            title: 'Senior Citizen Discount',
            description: 'Special rates for our senior citizens on all dental services.',
            discount: 10,
            startDate: '2025-10-01',
            endDate: '2025-12-31'
        }
    ];

    const promotionsContainer = document.querySelector('.promotions-grid');
    promotionsContainer.innerHTML = '';

    promotions.forEach(promo => {
        const card = document.createElement('div');
        card.className = 'promo-card';
        card.innerHTML = `
            <h3>${promo.title}</h3>
            <p>${promo.description}</p>
            <div class="discount">${promo.discount}% OFF</div>
            <p class="validity">Valid until ${new Date(promo.endDate).toLocaleDateString()}</p>
        `;
        promotionsContainer.appendChild(card);
    });
}