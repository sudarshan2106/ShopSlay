// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get booking info
    const bookingData = localStorage.getItem('bookingInfo');

    if (!bookingData) {
        window.location.href = 'index.html';
        return;
    }

    const booking = JSON.parse(bookingData);

    // Display booking summary
    displayBookingSummary(booking);

    // Payment form handler
    const paymentForm = document.querySelector('.payment-form, form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Pay Now button
    const payBtn = document.querySelector('.pay-btn, .neon-btn-primary');
    if (payBtn) {
        payBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handlePayment(e);
        });
    }
});

function displayBookingSummary(booking) {
    // Movie title
    const titleEl = document.querySelector('.movie-title, h2');
    if (titleEl) titleEl.textContent = booking.movie.title;

    // Seats
    const seatsEl = document.querySelector('.seats-info, .selected-seats');
    if (seatsEl) seatsEl.textContent = booking.seats.join(', ');

    // Date & Time
    const dateEl = document.querySelector('.date-info, .booking-date');
    if (dateEl) dateEl.textContent = booking.date;

    const timeEl = document.querySelector('.time-info, .booking-time');
    if (timeEl) timeEl.textContent = booking.time;

    // Price
    const priceEl = document.querySelector('.total-amount, .total-price');
    if (priceEl) priceEl.textContent = `₹${booking.totalPrice}`;
}

function handlePayment(e) {
    e.preventDefault();

    // Get form data
    const name = document.querySelector('input[name="name"], #name')?.value;
    const email = document.querySelector('input[name="email"], #email')?.value;
    const phone = document.querySelector('input[name="phone"], #phone')?.value;

    // Basic validation
    if (!name || !email || !phone) {
        alert('Please fill in all fields!');
        return;
    }

    // Simulate payment processing
    const payBtn = document.querySelector('.pay-btn, .neon-btn-primary');
    if (payBtn) {
        payBtn.textContent = 'Processing...';
        payBtn.disabled = true;
    }

    setTimeout(() => {
        // Generate booking ID
        const bookingId = 'BK' + Date.now().toString().slice(-8);
        const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo'));
        // Fix: Read from 'user' key as set by auth.js
        const currentUser = JSON.parse(localStorage.getItem('user'));

        // Create ticket info object
        const ticketInfo = {
            ...bookingInfo,
            bookingId,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            status: 'Confirmed',
            userId: currentUser ? currentUser.email : 'guest', // Link to user
            bookingDate: new Date().toISOString()
        };

        // Store current ticket for display
        localStorage.setItem('ticketInfo', JSON.stringify(ticketInfo));

        // Add to persistent bookings history
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(ticketInfo);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Redirect to ticket page
        window.location.href = 'ticket.html';
    }, 2000);
}
