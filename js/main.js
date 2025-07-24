// Sample data for hospitals
const hospitals = [
    {
        id: 1,
        name: "Metro Manila General Hospital",
        address: "123 Health Avenue, Quezon City, Metro Manila",
        phone: "+63 2 123 4567",
        email: "info@mmgh.com",
        website: "www.mmgh.com",
        description: "A leading general hospital in Metro Manila with specialized departments for various conditions.",
        specialties: ["diabetes", "heart disease", "cancer", "asthma"],
        rating: 4.5,
        distance: "2.5 km",
        image: "images/hospital1.jpg",
        hours: "Monday-Friday: 8:00 AM - 5:00 PM\nEmergency: 24/7",
        latitude: 14.6762,
        longitude: 121.0439
    },
    {
        id: 2,
        name: "Cebu City Medical Center",
        address: "456 Wellness Street, Cebu City, Cebu",
        phone: "+63 32 234 5678",
        email: "contact@cebumed.com",
        website: "www.cebumed.com",
        description: "Modern medical facility in Cebu specializing in chronic disease management.",
        specialties: ["diabetes", "kidney disease", "arthritis"],
        rating: 4.2,
        distance: "5.1 km",
        image: "images/hospital2.jpg",
        hours: "Monday-Saturday: 7:00 AM - 7:00 PM\nEmergency: 24/7",
        latitude: 10.3157,
        longitude: 123.8854
    },
    {
        id: 3,
        name: "Davao Regional Hospital",
        address: "789 Care Boulevard, Davao City, Davao del Sur",
        phone: "+63 82 345 6789",
        email: "support@davaoregional.com",
        website: "www.davaoregional.com",
        description: "Comprehensive healthcare services with focus on rare diseases and specialized treatments.",
        specialties: ["cancer", "rare diseases", "heart disease"],
        rating: 4.7,
        distance: "1.8 km",
        image: "images/hospital3.jpg",
        hours: "Monday-Friday: 7:30 AM - 4:30 PM\nEmergency: 24/7",
        latitude: 7.1907,
        longitude: 125.4553
    },
    {
        id: 4,
        name: "Baguio Health Institute",
        address: "101 Mountain View Road, Baguio City, Benguet",
        phone: "+63 74 456 7890",
        email: "info@baguiohealth.com",
        website: "www.baguiohealth.com",
        description: "Specialized hospital in the cool climate of Baguio, ideal for respiratory conditions.",
        specialties: ["asthma", "allergies", "respiratory diseases"],
        rating: 4.3,
        distance: "8.3 km",
        image: "images/hospital4.jpg",
        hours: "Monday-Sunday: 8:00 AM - 6:00 PM\nEmergency: 24/7",
        latitude: 16.4023,
        longitude: 120.5960
    }
];

// DOM Elements
const diseaseSearchInput = document.getElementById('disease-search');
const searchBtn = document.getElementById('search-btn');
const locationFilter = document.getElementById('location-filter');
const sortBy = document.getElementById('sort-by');
const resultsList = document.getElementById('results-list');
const resultsTitle = document.getElementById('results-title');
const resultsCount = document.getElementById('results-count');
const categoryBtns = document.querySelectorAll('.category-btn');

// Current search parameters
let currentSearch = {
    disease: '',
    location: 'all',
    sort: 'distance'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    searchBtn.addEventListener('click', performSearch);
    diseaseSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    locationFilter.addEventListener('change', function() {
        currentSearch.location = this.value;
        performSearch();
    });
    
    sortBy.addEventListener('change', function() {
        currentSearch.sort = this.value;
        performSearch();
    });
    
    // Set up category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const disease = this.getAttribute('data-disease');
            diseaseSearchInput.value = disease;
            currentSearch.disease = disease;
            performSearch();
        });
    });
    
    // Check if we're on the hospital details page
    if (document.querySelector('.hospital-details')) {
        loadHospitalDetails();
    }
});

// Perform search based on current parameters
function performSearch() {
    const disease = diseaseSearchInput.value.trim().toLowerCase();
    currentSearch.disease = disease;
    
    if (!disease) {
        showNoResults('Please enter a disease or condition to search');
        return;
    }
    
    // Filter hospitals
    let filteredHospitals = hospitals.filter(hospital => 
        hospital.specialties.some(spec => spec.toLowerCase().includes(disease))
    ).filter(hospital => {
        if (currentSearch.location === 'all') return true;
        if (currentSearch.location === 'near-me') {
            // In a real app, we would use geolocation here
            return hospital.distance.includes('km');
        }
        return hospital.address.toLowerCase().includes(currentSearch.location);
    });
    
    // Sort hospitals
    filteredHospitals.sort((a, b) => {
        if (currentSearch.sort === 'distance') {
            return parseFloat(a.distance) - parseFloat(b.distance);
        } else if (currentSearch.sort === 'rating') {
            return b.rating - a.rating;
        } else {
            return a.name.localeCompare(b.name);
        }
    });
    
    // Display results
    displayResults(filteredHospitals, disease);
}

// Display search results
function displayResults(hospitals, disease) {
    resultsList.innerHTML = '';
    
    if (hospitals.length === 0) {
        showNoResults(`No hospitals found specializing in ${disease}`);
        return;
    }
    
    resultsTitle.textContent = `Hospitals for ${disease}`;
    resultsCount.textContent = `${hospitals.length} hospitals found`;
    
    hospitals.forEach(hospital => {
        const hospitalCard = document.createElement('div');
        hospitalCard.className = 'hospital-card';
        hospitalCard.innerHTML = `
            <div class="hospital-image">
                <img src="${hospital.image}" alt="${hospital.name}">
            </div>
            <div class="hospital-content">
                <h3 class="hospital-name">${hospital.name}</h3>
                <p class="hospital-address">${hospital.address}</p>
                <div class="hospital-specialties">
                    ${hospital.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                </div>
                <p class="hospital-description">${hospital.description}</p>
                <div class="hospital-meta">
                    <span class="hospital-distance">${hospital.distance} away</span>
                    <a href="hospital.html?id=${hospital.id}" class="view-details">View Details <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        `;
        resultsList.appendChild(hospitalCard);
    });
}

// Show no results message
function showNoResults(message) {
    resultsList.innerHTML = `
        <div class="no-results">
            <i class="fas fa-hospital"></i>
            <p>${message}</p>
        </div>
    `;
    resultsTitle.textContent = 'Search Results';
    resultsCount.textContent = '0 hospitals found';
}

// Load hospital details page
function loadHospitalDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalId = parseInt(urlParams.get('id'));
    
    if (!hospitalId) {
        // Redirect if no ID is provided
        window.location.href = 'index.html';
        return;
    }
    
    const hospital = hospitals.find(h => h.id === hospitalId);
    
    if (!hospital) {
        // Redirect if hospital not found
        window.location.href = 'index.html';
        return;
    }
    
    // Update page content
    document.getElementById('hospital-name').textContent = hospital.name;
    document.getElementById('hospital-name-breadcrumb').textContent = hospital.name;
    document.getElementById('disease-breadcrumb').textContent = currentSearch.disease || 'Search';
    document.getElementById('hospital-address').textContent = hospital.address;
    document.getElementById('hospital-phone').textContent = hospital.phone;
    document.getElementById('hospital-email').textContent = hospital.email;
    document.getElementById('hospital-website').href = hospital.website;
    document.getElementById('hospital-website').textContent = hospital.website;
    document.getElementById('hospital-hours').textContent = hospital.hours.split('\n')[0];
    document.getElementById('hospital-emergency').textContent = hospital.hours.split('\n')[1];
    document.getElementById('hospital-description').textContent = hospital.description;
    document.getElementById('hospital-rating').textContent = hospital.rating;
    
    // Update stars
    const starsContainer = document.querySelector('.hospital-rating .stars');
    starsContainer.innerHTML = '';
    const fullStars = Math.floor(hospital.rating);
    const hasHalfStar = hospital.rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= fullStars) {
            star.className = 'fas fa-star';
        } else if (i === fullStars + 1 && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        starsContainer.appendChild(star);
    }
    
    // Update specializations
    const specializationsContainer = document.getElementById('hospital-specializations');
    specializationsContainer.innerHTML = '';
    hospital.specialties.forEach(spec => {
        const tag = document.createElement('span');
        tag.className = 'specialty-tag';
        tag.textContent = spec;
        specializationsContainer.appendChild(tag);
    });
    
    // Set up directions button
    document.getElementById('get-directions').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`);
    });
    
    // Set up contact form
    document.getElementById('hospital-contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message. The hospital will contact you soon.');
        this.reset();
    });
}