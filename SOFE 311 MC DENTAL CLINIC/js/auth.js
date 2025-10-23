document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // For demonstration, we'll use localStorage to simulate authentication
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store the logged-in user's information
                localStorage.setItem('currentUser', JSON.stringify({
                    email: user.email,
                    role: user.role
                }));
                
                // Redirect based on role
                switch(user.role) {
                    case 'patient':
                        window.location.href = 'patient-dashboard.html';
                        break;
                    case 'staff':
                        window.location.href = 'staff-dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = 'admin-dashboard.html';
                        break;
                    default:
                        window.location.href = 'index.html';
                }
            } else {
                alert('Invalid email or password');
            }
        });
    }
});

// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
    return currentUser;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}