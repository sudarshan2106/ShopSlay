// Ticket Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get ticket info
    const ticketData = localStorage.getItem('ticketInfo');

    if (!ticketData) {
        window.location.href = 'index.html';
        return;
    }

    const ticket = JSON.parse(ticketData);

    // Display ticket information
    displayTicket(ticket);

    // Download button
    const downloadBtn = document.querySelector('.download-btn, .neon-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            window.print();
        });
    }

    // Home button
    const homeBtn = document.querySelector('.home-btn, .back-home');
    if (homeBtn) {
        homeBtn.addEventListener('click', function () {
            // Clear booking data
            localStorage.removeItem('selectedMovie');
            localStorage.removeItem('bookingMovie');
            localStorage.removeItem('bookingInfo');
            localStorage.removeItem('ticketInfo');
            window.location.href = 'index.html';
        });
    }
});

function displayTicket(ticket) {
    // Booking ID
    const idEl = document.querySelector('.booking-id, .ticket-id');
    if (idEl) idEl.textContent = ticket.bookingId;

    // Movie title
    const titleEl = document.querySelector('.movie-title, h2');
    if (titleEl) titleEl.textContent = ticket.movie.title;

    // Customer name
    const nameEl = document.querySelector('.customer-name, .name');
    if (nameEl) nameEl.textContent = ticket.customerName;

    // Seats
    const seatsEl = document.querySelector('.seats-info, .seats');
    if (seatsEl) seatsEl.textContent = ticket.seats.join(', ');

    // Date
    const dateEl = document.querySelector('.date-info, .date');
    if (dateEl) dateEl.textContent = ticket.date;

    // Time
    const timeEl = document.querySelector('.time-info, .time');
    if (timeEl) timeEl.textContent = ticket.time;

    // Price
    const priceEl = document.querySelector('.price-info, .amount');
    if (priceEl) priceEl.textContent = `₹${ticket.totalPrice}`;

    // Status
    const statusEl = document.querySelector('.status');
    if (statusEl) {
        statusEl.textContent = ticket.status;
        statusEl.style.color = '#00ff88';
    }

    // Generate QR code placeholder
    generateQRCode(ticket.bookingId);
}

function generateQRCode(bookingId) {
    const qrEl = document.querySelector('.qr-code, .qr');
    if (qrEl) {
        // Use a QR code API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`;
        qrEl.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width: 150px; height: 150px;">`;
    }
}
