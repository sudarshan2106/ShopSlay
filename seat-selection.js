// Seat Selection JavaScript

let selectedSeats = [];
let totalPrice = 0;
let basePrice = 250;

document.addEventListener('DOMContentLoaded', function () {
    // Get movie from localStorage
    const movieData = localStorage.getItem('bookingMovie');

    if (!movieData) {
        window.location.href = 'index.html';
        return;
    }

    const movie = JSON.parse(movieData);
    basePrice = movie.price || 250;

    // Update movie info
    const movieTitle = document.querySelector('.movie-title, h2');
    if (movieTitle) movieTitle.textContent = movie.title;

    // Generate seat layout if not exists
    generateSeats();

    // Add seat click handlers
    const seats = document.querySelectorAll('.seat:not(.occupied)');
    seats.forEach(seat => {
        seat.addEventListener('click', function () {
            toggleSeat(this);
        });
    });

    // Proceed to checkout button
    const proceedBtn = document.querySelector('.proceed-btn, .checkout-btn, .neon-btn-primary');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', proceedToCheckout);
    }
});

function generateSeats() {
    const seatContainer = document.querySelector('.seats-container, .seat-grid');
    if (!seatContainer || seatContainer.children.length > 0) return;

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        const rowLabel = document.createElement('span');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);

        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.seat = `${row}${i}`;

            // Randomly occupy some seats
            if (Math.random() > 0.7) {
                seat.classList.add('occupied');
            }

            seat.innerHTML = `<span>${i}</span>`;
            rowDiv.appendChild(seat);
        }

        seatContainer.appendChild(rowDiv);
    });
}

function toggleSeat(seatElement) {
    const seatNumber = seatElement.dataset.seat;

    if (seatElement.classList.contains('selected')) {
        // Deselect
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
        // Select
        seatElement.classList.add('selected');
        selectedSeats.push(seatNumber);
    }

    updateSummary();
}

function updateSummary() {
    totalPrice = selectedSeats.length * basePrice;

    const countEl = document.querySelector('.seat-count, .selected-count');
    if (countEl) countEl.textContent = selectedSeats.length;

    const priceEl = document.querySelector('.total-price, .price');
    if (priceEl) priceEl.textContent = `₹${totalPrice}`;

    const seatsEl = document.querySelector('.selected-seats');
    if (seatsEl) seatsEl.textContent = selectedSeats.join(', ') || 'None';
}

function proceedToCheckout() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat!');
        return;
    }

    // Store booking info
    const bookingInfo = {
        movie: JSON.parse(localStorage.getItem('bookingMovie')),
        seats: selectedSeats,
        totalPrice: totalPrice,
        date: new Date().toLocaleDateString(),
        time: '7:00 PM' // Default time
    };

    localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    window.location.href = 'checkout.html';
}
