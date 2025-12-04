// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form, form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Login button
    const loginBtn = document.querySelector('.login-btn, .neon-btn-primary');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleLogin(e);
        });
    }

    // Sign up link
    const signupLink = document.querySelector('.signup-link, a[href*="signup"]');
    if (signupLink) {
        signupLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Sign up feature coming soon! For now, use:\nEmail: user@slayscreens.com\nPassword: user123');
        });
    }
});

function handleLogin(e) {
    e.preventDefault();

    const email = document.querySelector('input[type="email"], input[name="email"]')?.value;
    const password = document.querySelector('input[type="password"], input[name="password"]')?.value;

    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }

    // Mock authentication (replace with actual API call later)
    if (email === 'admin@slayscreens.com' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({
            email: email,
            role: 'ADMIN',
            name: 'Admin'
        }));
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'admin/dashboard.html';
        }, 1000);
    } else if (email === 'user@slayscreens.com' && password === 'user123') {
        localStorage.setItem('user', JSON.stringify({
            email: email,
            role: 'USER',
            name: 'User'
        }));
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage('Invalid credentials! Try:\nuser@slayscreens.com / user123', 'error');
    }
}

function showMessage(message, type) {
    // Remove existing message
    const existing = document.querySelector('.message');
    if (existing) existing.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 136, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00ff88' : '#ff0088'};
        border-radius: 8px;
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
