document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const dob = document.getElementById('dob').value;
            const address = document.getElementById('address').value;

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if email already exists
            if (users.some(user => user.email === email)) {
                alert('Email already registered!');
                return;
            }

            // Create new user object
            const newUser = {
                name,
                email,
                password, // In a real application, this would be hashed
                dob,
                address,
                role: 'patient', // Default role for new registrations
                registrationDate: new Date().toISOString(),
                patientChart: {
                    services: [],
                    images: []
                }
            };

            // Add new user to users array
            users.push(newUser);

            // Save updated users array
            localStorage.setItem('users', JSON.stringify(users));

            // Automatically log in the new user
            localStorage.setItem('currentUser', JSON.stringify({
                email: newUser.email,
                role: newUser.role
            }));

            // Redirect to patient dashboard
            alert('Registration successful! Redirecting to dashboard...');
            window.location.href = 'patient-dashboard.html';
        });
    }
});