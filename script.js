
    const apiKey = 'ee718f42d6dc726b98c8c45138565ec4';
    let movieComments = {};

    async function searchMovies() {
        const searchQuery = document.getElementById('searchInput').value;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;

        try {
            const response = await fetchData(url);
            displaySearchResults(response.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }

    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = '';

        results.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');

            // Create an image element for the movie poster
            const posterImage = document.createElement('img');
            posterImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            posterImage.alt = `${movie.title} Poster`;

            // Append the image to the movie element
            movieElement.appendChild(posterImage);

            // Create a title element for the movie
            const titleElement = document.createElement('p');
            titleElement.textContent = movie.title;

            // Append the title to the movie element
            movieElement.appendChild(titleElement);

            // Add click event listener to show movie details
            movieElement.addEventListener('click', () => showMovieDetails(movie.id));

            // Append the movie element to the search results container
            searchResultsContainer.appendChild(movieElement);
        });
    }

    async function showMovieDetails(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

        try {
            const movieDetails = await fetchData(url);
            displayMovieDetails(movieDetails, movieId);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    function displayMovieDetails(movie, movieId) {
        const movieDetailsContainer = document.getElementById('movieDetails');

        // Check if comments exist for the movie
        const comments = movieComments[movieId] || [];

        // Display movie details including comments
        movieDetailsContainer.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            <button onclick="watchTrailer(${movie.id})">Watch Trailer</button>
            
            <div id="commentSection">
                <h3>Comments</h3>
                <ul id="commentsList">
                    ${comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
                
                <form onsubmit="addComment(${movie.id}); return false;">
                    <input type="text" id="commentInput" placeholder="Add your comment" required>
                    <button type="submit">Add Comment</button>
                </form>
            </div>
        `;
    }

    function addComment(movieId) {
        const commentInput = document.getElementById('commentInput');
        const comment = commentInput.value;

        // Check if there are existing comments for the movie
        if (!movieComments[movieId]) {
            movieComments[movieId] = [];
        }

        // Add the new comment to the array
        movieComments[movieId].push(comment);

        // Update the display with the new comment
        displayMovieDetails({ id: movieId, title: "Movie Title" }, movieId);

        // Clear the input field
        commentInput.value = '';
    }

    async function watchTrailer(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

        try {
            const trailers = await fetchData(url);
            const trailerKey = trailers.results[0]?.key;

            if (trailerKey) {
                const watchTrailerContainer = document.getElementById('watchTrailer');
                watchTrailerContainer.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
                `;
            } else {
                console.warn('No trailer available.');
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }


