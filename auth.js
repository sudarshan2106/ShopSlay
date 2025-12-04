// Authentication System for Slay Screens
// Handles user and admin registration, login, and session management

const ADMIN_SECRET_CODE = 'ADMIN2024';

// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Register new user or admin
function register(userData) {
    console.log('Registering user:', userData);

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
        return { success: false, message: 'Please fill in all required fields' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Please enter a valid email address' };
    }

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }

    // Validate admin secret code if registering as admin
    if (userData.role === 'ADMIN') {
        if (!userData.secretCode || userData.secretCode !== ADMIN_SECRET_CODE) {
            return { success: false, message: 'Invalid admin secret code' };
        }
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password, // In production, hash this!
        role: userData.role || 'USER',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('User registered successfully:', newUser.email);
    return { success: true, message: 'Registration successful!', user: newUser };
}

// Login user
function login(email, password) {
    console.log('Login attempt:', email);

    if (!email || !password) {
        return { success: false, message: 'Please enter email and password' };
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }

    // Set current user session
    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    };

    localStorage.setItem('user', JSON.stringify(sessionUser));
    console.log('Login successful:', user.email, 'Role:', user.role);

    return { success: true, message: 'Login successful!', user: sessionUser };
}

// Logout user
function logout() {
    localStorage.removeItem('user');
    console.log('User logged out');
    return { success: true, message: 'Logged out successfully' };
}

// Check if user is logged in
function isLoggedIn() {
    const user = localStorage.getItem('user');
    return user !== null;
}

// Get current logged-in user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

// Require authentication - redirect to login if not logged in
function requireAuth(redirectUrl = null) {
    if (!isLoggedIn()) {
        // Store the intended destination
        if (redirectUrl) {
            localStorage.setItem('redirectAfterLogin', redirectUrl);
        }
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Require admin role - redirect if not admin
function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = '../login.html';
        return false;
    }

    if (!isAdmin()) {
        alert('Access denied! Admin privileges required.');
        window.location.href = '../index.html';
        return false;
    }

    return true;
}

// Handle redirect after login
function handleRedirectAfterLogin() {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
        return true;
    }
    return false;
}

// Get all users (admin only)
function getAllUsers() {
    if (!isAdmin()) {
        return [];
    }
    return users;
}

// Initialize demo users if none exist
function initializeDemoUsers() {
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@slayscreens.com',
                phone: '9999999999',
                password: 'admin123',
                role: 'ADMIN',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'user123',
                role: 'USER',
                createdAt: new Date().toISOString()
            }
        ];

        users = demoUsers;
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Demo users initialized');
    }
}

// Initialize on load
initializeDemoUsers();

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.auth = {
        register,
        login,
        logout,
        isLoggedIn,
        getCurrentUser,
        isAdmin,
        requireAuth,
        requireAdmin,
        handleRedirectAfterLogin,
        getAllUsers,
        ADMIN_SECRET_CODE
    };
}
