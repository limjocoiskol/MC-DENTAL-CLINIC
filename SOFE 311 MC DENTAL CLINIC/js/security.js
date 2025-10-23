// Security Utilities

// Password Hashing (for demonstration - in a real app, use a proper hashing library)
function hashPassword(password) {
    // This is a simple hash function for demonstration
    // In a real application, use bcrypt or another secure hashing algorithm
    return btoa(password);
}

// Input Sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
}

// Role-Based Access Control
function checkPermission(requiredRole) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    switch(requiredRole) {
        case 'admin':
            return currentUser.role === 'admin';
        case 'staff':
            return currentUser.role === 'staff' || currentUser.role === 'admin';
        case 'patient':
            return currentUser.role === 'patient' || currentUser.role === 'staff' || currentUser.role === 'admin';
        default:
            return false;
    }
}

// Session Management
function initSession(user) {
    const sessionToken = generateSessionToken();
    const session = {
        user: {
            email: user.email,
            role: user.role
        },
        token: sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem('session', JSON.stringify(session));
    return sessionToken;
}

function checkSession() {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session) return false;
    
    if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('session');
        return false;
    }
    
    return true;
}

function generateSessionToken() {
    return 'st_' + Date.now() + Math.random().toString(36).substr(2);
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Password must be at least 8 characters long and contain at least one number
    return password.length >= 8 && /\d/.test(password);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Data Encryption (for demonstration - in a real app, use a proper encryption library)
function encryptData(data) {
    // This is a simple encryption for demonstration
    // In a real application, use a proper encryption library
    return btoa(JSON.stringify(data));
}

function decryptData(encryptedData) {
    // This is a simple decryption for demonstration
    // In a real application, use a proper encryption library
    try {
        return JSON.parse(atob(encryptedData));
    } catch (e) {
        return null;
    }
}

// Audit Logging
function logAction(action, user, details) {
    const auditLogs = JSON.parse(localStorage.getItem('auditLogs')) || [];
    const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        user: user.email,
        role: user.role,
        details
    };
    
    auditLogs.push(logEntry);
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
}

// Rate Limiting
const rateLimits = new Map();

function checkRateLimit(action, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const key = `${action}_${now - (now % windowMs)}`;
    
    if (!rateLimits.has(key)) {
        rateLimits.set(key, 1);
        return true;
    }
    
    const count = rateLimits.get(key);
    if (count >= limit) return false;
    
    rateLimits.set(key, count + 1);
    return true;
}

// File Upload Validation
function validateFileUpload(file, maxSizeInMB = 5) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = maxSizeInMB * 1024 * 1024; // Convert to bytes
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.');
    }
    
    if (file.size > maxSize) {
        throw new Error(`File size must not exceed ${maxSizeInMB}MB.`);
    }
    
    return true;
}

// Export functions
export {
    hashPassword,
    sanitizeInput,
    checkPermission,
    initSession,
    checkSession,
    validateEmail,
    validatePassword,
    validatePhone,
    encryptData,
    decryptData,
    logAction,
    checkRateLimit,
    validateFileUpload
};

