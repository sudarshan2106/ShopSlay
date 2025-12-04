// Main JavaScript for GoTrip Application

// Mock movie data (or load from localStorage)
let movies = JSON.parse(localStorage.getItem('movies')) || [
    {
        id: 1,
        title: "Venom: The Last Dance",
        genre: "Action/Sci-Fi",
        duration: "2h 15m",
        rating: 8.5,
        poster: "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
        description: "Eddie and Venom are on the run. Hunted by both of their worlds.",
        price: 250
    },
    {
        id: 2,
        title: "The Wild Robot",
        genre: "Animation",
        duration: "1h 45m",
        rating: 9.0,
        poster: "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
        description: "A robot washed ashore on an uninhabited island must learn to adapt.",
        price: 200
    },
    {
        id: 3,
        title: "Joker: Folie à Deux",
        genre: "Drama/Thriller",
        duration: "2h 18m",
        rating: 7.8,
        poster: "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
        description: "Arthur Fleck is institutionalized at Arkham awaiting trial.",
        price: 300
    },
    {
        id: 4,
        title: "Inside Out 2",
        genre: "Animation",
        duration: "1h 36m",
        rating: 8.9,
        poster: "https://image.tmdb.org/t/p/w500/p5ozvmdgsmbWe0H8Xk7RdAso5y2.jpg",
        description: "Riley enters puberty and experiences brand new emotions.",
        price: 220
    }
];

// Expose movies to window object for access in index.html
window.movies = movies;

// Save default movies to localStorage if empty
if (!localStorage.getItem('movies')) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

// Initialize default theaters if not exists
if (!localStorage.getItem('theaters')) {
    const defaultTheaters = [
        {
            id: 1,
            name: 'INOX: Megaplex',
            location: 'Phoenix Marketcity, Mumbai',
            distance: '2.5 km',
            screens: ['IMAX', '4DX', 'Regular'],
            showtimes: [
                { time: '10:00 AM', price: 200, screen: 'Regular' },
                { time: '01:30 PM', price: 250, screen: 'Regular' },
                { time: '04:45 PM', price: 300, screen: 'IMAX' },
                { time: '07:30 PM', price: 350, screen: '4DX' },
                { time: '10:15 PM', price: 250, screen: 'Regular' }
            ]
        },
        {
            id: 2,
            name: 'PVR: Gold',
            location: 'Juhu, Mumbai',
            distance: '4.2 km',
            screens: ['Gold Class', 'Regular'],
            showtimes: [
                { time: '11:00 AM', price: 400, screen: 'Gold Class' },
                { time: '02:00 PM', price: 220, screen: 'Regular' },
                { time: '05:30 PM', price: 450, screen: 'Gold Class' },
                { time: '08:45 PM', price: 280, screen: 'Regular' }
            ]
        },
        {
            id: 3,
            name: 'Cinepolis: VIP',
            location: 'Andheri West, Mumbai',
            distance: '3.8 km',
            screens: ['VIP', 'Regular'],
            showtimes: [
                { time: '12:00 PM', price: 350, screen: 'VIP' },
                { time: '03:15 PM', price: 200, screen: 'Regular' },
                { time: '06:30 PM', price: 400, screen: 'VIP' },
                { time: '09:45 PM', price: 230, screen: 'Regular' }
            ]
        }
    ];
    localStorage.setItem('theaters', JSON.stringify(defaultTheaters));
}

// Store selected movie in localStorage
function selectMovie(movieId) {
    console.log('Selecting movie:', movieId);

    // Check if user is logged in
    if (typeof window.auth !== 'undefined' && !window.auth.isLoggedIn()) {
        // Store the intended action
        const movie = movies.find(m => m.id == movieId);
        if (movie) {
            localStorage.setItem('selectedMovie', JSON.stringify(movie));
            localStorage.setItem('redirectAfterLogin', 'movie-details.html');
        }
        // Redirect to login/register
        if (confirm('Please login or register to book tickets. Would you like to login now?')) {
            window.location.href = 'user-login.html';
        } else {
            window.location.href = 'register.html';
        }
        return;
    }

    // Use loose equality (==) to match string/number IDs
    const movie = movies.find(m => m.id == movieId);

    if (movie) {
        console.log('Movie found:', movie.title);
        localStorage.setItem('selectedMovie', JSON.stringify(movie));
        window.location.href = 'movie-details.html';
    } else {
        console.error('Movie not found with ID:', movieId);
        alert('Error: Movie not found!');
    }
}

// Navigate to different pages
function navigateTo(page) {
    window.location.href = page;
}

// Sign in button handler
function handleSignIn() {
    window.location.href = 'user-login.html';
}

// Book Now button handler
function handleBookNow() {
    // Select first available movie dynamically
    if (movies.length > 0) {
        selectMovie(movies[0].id);
    } else {
        alert('No movies available to book!');
    }
}

// Logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.auth.logout();
        window.location.href = 'index.html';
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('GoTrip App Loaded');

    // Render movies dynamically
    renderMovies();

    // Sign In button
    const signInBtns = document.querySelectorAll('.neon-btn-primary');
    signInBtns.forEach(btn => {
        if (btn.textContent.includes('Sign In')) {
            btn.addEventListener('click', handleSignIn);
        } else if (btn.textContent.includes('Book Now')) {
            btn.addEventListener('click', handleBookNow);
        }
    });

    // Event Delegation for Movie Grid
    const grid = document.getElementById('movie-grid');
    if (grid) {
        grid.addEventListener('click', function (e) {
            // Check if clicked element is a book button
            if (e.target.classList.contains('movie-book-btn')) {
                const movieId = e.target.getAttribute('data-id');
                selectMovie(movieId);
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                const matchedMovie = movies.find(m =>
                    m.title.toLowerCase().includes(searchTerm)
                );
                if (matchedMovie) {
                    selectMovie(matchedMovie.id);
                } else {
                    alert('Movie not found. Try: Venom, Wild Robot, Joker, or Inside Out');
                }
            }
        });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function renderMovies() {
    const grid = document.getElementById('movie-grid');
    if (!grid) return;

    grid.innerHTML = movies.map(movie => `
        <div class="movie-card glass-card">
            <div class="poster">
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="overlay">
                    <button class="neon-btn movie-book-btn" data-id="${movie.id}">Book</button>
                </div>
            </div>
            <div class="info">
                <h3>${movie.title}</h3>
                <p>${movie.genre} • ${movie.duration}</p>
            </div>
        </div>
    `).join('');
}

// Make selectMovie globally available
window.selectMovie = selectMovie;

// Export for use in other pages
window.GoTrip = {
    movies,
    selectMovie,
    navigateTo,
    handleSignIn,
    handleBookNow
};
