// Sample user data (in a real app, this would be handled by a backend)
const users = [
    {
        id: 1,
        email: "admin@findmyhospital.com",
        password: "admin123",
        name: "Admin User",
        role: "admin"
    },
    {
        id: 2,
        email: "user@example.com",
        password: "user123",
        name: "Regular User",
        role: "user"
    }
];

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // In a real app, we would verify the token with the server
        return true;
    }
    return false;
}

// Check if user is admin
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
}

// Redirect to admin dashboard if admin
function checkAdminRedirect() {
    if (checkAdmin()) {
        window.location.href = 'admin/index.html';
    }
}

// Login form handler
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // In a real app, we would get a token from the server
                localStorage.setItem('authToken', 'sample-token');
                localStorage.setItem('user', JSON.stringify(user));
                
                if (user.role === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Invalid email or password');
            }
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Initialize auth functionality
document.addEventListener('DOMContentLoaded', function() {
    setupLoginForm();
    
    // Update login button text if logged in
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        if (checkAuth()) {
            const user = JSON.parse(localStorage.getItem('user'));
            loginBtn.textContent = 'Logout';
            loginBtn.href = '#';
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
    
    // If on admin page, check auth and admin status
    if (window.location.pathname.includes('admin')) {
        requireAuth();
        if (!checkAdmin()) {
            alert('You do not have permission to access this page');
            window.location.href = 'index.html';
        }
    }
});