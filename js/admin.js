// Admin functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('admin')) return;
    
    // Load dashboard data
    if (document.querySelector('.dashboard-cards')) {
        loadDashboardData();
    }
    
    // Load hospitals table
    if (document.getElementById('hospitals-table')) {
        loadHospitalsTable();
    }
    
    // Load diseases table
    if (document.getElementById('diseases-table')) {
        loadDiseasesTable();
    }
    
    // Set up hospital form
    if (document.getElementById('hospital-form')) {
        setupHospitalForm();
    }
    
    // Set up disease form
    if (document.getElementById('disease-form')) {
        setupDiseaseForm();
    }
});

// Load dashboard data
function loadDashboardData() {
    document.querySelector('.card-hospitals .value').textContent = hospitals.length;
    document.querySelector('.card-diseases .value').textContent = getAllDiseases().length;
    document.querySelector('.card-users .value').textContent = users.length;
}

// Get all unique diseases from hospitals
function getAllDiseases() {
    const diseases = new Set();
    hospitals.forEach(hospital => {
        hospital.specialties.forEach(disease => {
            diseases.add(disease);
        });
    });
    return Array.from(diseases);
}

// Load hospitals table
function loadHospitalsTable() {
    const table = document.getElementById('hospitals-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    hospitals.forEach(hospital => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hospital.id}</td>
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>${hospital.specialties.join(', ')}</td>
            <td>${hospital.rating}</td>
            <td class="table-actions">
                <button class="btn edit"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn delete"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load diseases table
function loadDiseasesTable() {
    const table = document.getElementById('diseases-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    const diseases = getAllDiseases();
    
    diseases.forEach((disease, index) => {
        const hospitalCount = hospitals.filter(h => h.specialties.includes(disease)).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${disease}</td>
            <td>${hospitalCount}</td>
            <td class="table-actions">
                <button class="btn edit"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn delete"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Set up hospital form
function setupHospitalForm() {
    const form = document.getElementById('hospital-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Hospital data saved successfully!');
        // In a real app, we would send this to the server
    });
}

// Set up disease form
function setupDiseaseForm() {
    const form = document.getElementById('disease-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Disease data saved successfully!');
        // In a real app, we would send this to the server
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            localStorage.removeItem('admin'); 
            localStorage.removeItem('authToken'); 

            window.location.href = '../login.html'; // Adjust the path as needed
        });
    }
});

// Admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin hospitals page
    if (window.location.pathname.includes('hospitals.html')) {
        loadHospitalsTable();
        setupHospitalForm();
    }
    
    // Set up logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('admin');
            localStorage.removeItem('authToken');
            window.location.href = '../login.html';
        });
    }
});

// Load hospitals table with more detailed information
function loadHospitalsTable() {
    const table = document.getElementById('hospitals-table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    hospitals.forEach(hospital => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hospital.id}</td>
            <td>${hospital.name}</td>
            <td>${hospital.address}</td>
            <td>${hospital.specialties.join(', ')}</td>
            <td>
                <span class="rating-stars">
                    ${generateStarRating(hospital.rating)}
                </span>
                (${hospital.rating})
            </td>
            <td class="table-actions">
                <button class="btn edit" data-id="${hospital.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn delete" data-id="${hospital.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const hospitalId = parseInt(this.getAttribute('data-id'));
            editHospital(hospitalId);
        });
    });
    
    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const hospitalId = parseInt(this.getAttribute('data-id'));
            deleteHospital(hospitalId);
        });
    });
}

// Helper function to generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Edit hospital function
function editHospital(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;
    
    // Fill the form with hospital data
    document.getElementById('hospital-name').value = hospital.name;
    document.getElementById('hospital-address').value = hospital.address;
    document.getElementById('hospital-phone').value = hospital.phone;
    document.getElementById('hospital-email').value = hospital.email;
    document.getElementById('hospital-website').value = hospital.website;
    document.getElementById('hospital-specialties').value = hospital.specialties.join(', ');
    document.getElementById('hospital-description').value = hospital.description;
    
    // Add hidden ID field if not exists
    if (!document.getElementById('hospital-id')) {
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.id = 'hospital-id';
        idInput.value = hospital.id;
        document.getElementById('hospital-form').appendChild(idInput);
    } else {
        document.getElementById('hospital-id').value = hospital.id;
    }
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({
        behavior: 'smooth'
    });
}

// Delete hospital function
function deleteHospital(hospitalId) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        // In a real app, you would send a request to the server here
        const index = hospitals.findIndex(h => h.id === hospitalId);
        if (index !== -1) {
            hospitals.splice(index, 1);
            loadHospitalsTable(); // Refresh the table
            alert('Hospital deleted successfully!');
        }
    }
}

// Set up hospital form with more functionality
function setupHospitalForm() {
    const form = document.getElementById('hospital-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const id = document.getElementById('hospital-id') ? 
                   parseInt(document.getElementById('hospital-id').value) : 
                   hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1;
        
        const name = document.getElementById('hospital-name').value;
        const address = document.getElementById('hospital-address').value;
        const phone = document.getElementById('hospital-phone').value;
        const email = document.getElementById('hospital-email').value;
        const website = document.getElementById('hospital-website').value;
        const specialties = document.getElementById('hospital-specialties').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        const description = document.getElementById('hospital-description').value;
        
        // Create or update hospital
        const existingIndex = hospitals.findIndex(h => h.id === id);
        if (existingIndex !== -1) {
            // Update existing hospital
            hospitals[existingIndex] = {
                ...hospitals[existingIndex],
                name,
                address,
                phone,
                email,
                website,
                specialties,
                description
            };
        } else {
            // Create new hospital
            hospitals.push({
                id,
                name,
                address,
                phone,
                email,
                website,
                description,
                specialties,
                rating: 0, // Default rating
                distance: "0 km", // Default distance
                image: "images/hospital-default.jpg", // Default image
                hours: "Monday-Friday: 8:00 AM - 5:00 PM\nEmergency: 24/7", // Default hours
                latitude: 0,
                longitude: 0
            });
        }
        
        // Refresh table and reset form
        loadHospitalsTable();
        form.reset();
        if (document.getElementById('hospital-id')) {
            document.getElementById('hospital-id').remove();
        }
        
        alert('Hospital saved successfully!');
    });
    
    // Cancel button functionality
    const cancelBtn = form.querySelector('.secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            form.reset();
            if (document.getElementById('hospital-id')) {
                document.getElementById('hospital-id').remove();
            }
        });
    }
}