// Movie Details Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    console.log('Movie Details Page Loaded');

    // Get selected movie from localStorage
    const movieData = localStorage.getItem('selectedMovie');

    if (!movieData) {
        console.error('No movie selected');
        alert('No movie selected. Redirecting to home...');
        window.location.href = 'index.html';
        return;
    }

    const movie = JSON.parse(movieData);
    console.log('Loading movie:', movie.title);

    // Update page title
    document.title = `${movie.title} | Slay Screens`;

    // Update movie title (h1)
    const titleEl = document.querySelector('.movie-info h1');
    if (titleEl) {
        titleEl.textContent = movie.title;
        console.log('Updated title');
    }

    // Update poster images (both in poster-container and banner)
    const posterImg = document.querySelector('.poster-container img');
    if (posterImg) {
        posterImg.src = movie.poster;
        posterImg.alt = movie.title;
        console.log('Updated poster');
    }

    const bannerImg = document.querySelector('.banner-img');
    if (bannerImg) {
        // Use poster as banner background
        bannerImg.src = movie.poster;
        bannerImg.alt = `${movie.title} Banner`;
        console.log('Updated banner');
    }

    // Update genre tags
    const metaTags = document.querySelector('.meta-tags');
    if (metaTags && movie.genre) {
        const genres = movie.genre.split(/[,/]/).map(g => g.trim());
        const genreTags = genres.map(genre => `<span class="tag glass">${genre}</span>`).join('');
        const durationTag = `<span class="tag glass">${movie.duration}</span>`;
        const ratingTag = `<span class="tag glass">UA</span>`;
        metaTags.innerHTML = genreTags + durationTag + ratingTag;
        console.log('Updated genre tags');
    }

    // Update rating
    const ratingEl = document.querySelector('.rating span');
    if (ratingEl) {
        ratingEl.textContent = `${movie.rating}/10`;
        console.log('Updated rating');
    }

    // Update storyline/description
    const storylineEl = document.querySelector('.storyline');
    if (storylineEl) {
        storylineEl.textContent = movie.description || 'No description available.';
        console.log('Updated description');
    }

    // Update cast & crew section
    const castGrid = document.querySelector('.cast-grid');
    if (castGrid && movie.cast && movie.cast.length > 0) {
        castGrid.innerHTML = movie.cast.map(member => `
            <div class="cast-card glass-card">
                <img src="${member.image}" alt="${member.name}">
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>
        `).join('');
        console.log('Updated cast');
    } else if (castGrid) {
        // Show default cast if no cast data
        castGrid.innerHTML = `
            <div class="cast-card glass-card">
                <p style="color: var(--text-muted);">Cast information not available</p>
            </div>
        `;
    }

    // Update Book Tickets button to store movie data
    const bookBtn = document.querySelector('.book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Booking movie:', movie.title);
            localStorage.setItem('bookingMovie', JSON.stringify(movie));
            window.location.href = 'theater-selection.html';
        });
    }

    // Sign In button handler
    const signInBtn = document.querySelector('.neon-btn-primary:not(.book-btn)');
    if (signInBtn && signInBtn.textContent.includes('Sign In')) {
        signInBtn.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }
});
