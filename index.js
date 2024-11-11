    document.addEventListener("DOMContentLoaded", () => {
        const movieList = document.querySelector('.movie-list');
        const genreFilter = document.getElementById('genre-filter');
        const minRatingInput = document.getElementById('min-rating');
        const filterButton = document.getElementById('filter-button');
        const baseURL = 'https://oct-28-assignment.onrender.com';
        const reviewsList = document.getElementById('reviews-list');
        const watchLaterList = document.getElementById('watch-later-list');
        
        // Initialize watch later list
        let watchLaterMovies = [];

        // Function to fetch and populate movies
        const getMovies = async () => {
            try {
                const response = await fetch(`${baseURL}/movies`);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                data.forEach(movie => {
                    const optionElement = document.createElement('option');
                    optionElement.value = movie.name;
                    optionElement.textContent = movie.name;
                    movieList.appendChild(optionElement);
                });
            } catch (error) {
                console.error('Error fetching movie list:', error);
            }
        };

        // Populate the dropdown list on load
        getMovies();

        // Fetch and display movie details
        movieList.addEventListener('change', async (event) => {
            const selectedMovie = event.target.value;
            if (!selectedMovie) return;

            try {
                const response = await fetch(`${baseURL}/movies/title/${selectedMovie}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const movieData = await response.json();
                document.getElementById('movie-name').textContent = movieData.name || 'N/A';
                document.getElementById('movie-intro').textContent = movieData.introduction || 'N/A';
                document.getElementById('movie-director').textContent = movieData.director?.name || 'N/A';
                document.getElementById('movie-rating').textContent = movieData.rating || 'N/A';
                document.getElementById('movie-genre').textContent = movieData.genre ? movieData.genre.join(', ') : 'N/A';

                // Update cast and director's famous works
                const famousWorkList = document.getElementById('director-famous-works');
                famousWorkList.innerHTML = '';
                movieData.director?.famousWork?.forEach(work => {
                    const workElement = document.createElement('li');
                    workElement.textContent = work;
                    famousWorkList.appendChild(workElement);
                });

                const castList = document.getElementById('movie-cast');
                castList.innerHTML = '';
                movieData.cast?.forEach(member => {
                    const castElement = document.createElement('li');
                    castElement.textContent = `${member.name} - Known for: ${member.otherWorks.join(', ')}`;
                    castList.appendChild(castElement);
                });

                // Add "Watch Later" functionality
                const watchLaterButton = document.createElement('button');
                watchLaterButton.textContent = 'Watch Later';
                watchLaterButton.onclick = () => addToWatchLater(movieData.name);
                document.getElementById('movie-details').appendChild(watchLaterButton);

            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        });

        // Function to add a movie to "Watch Later" list
        const addToWatchLater = (movieName) => {
            if (!watchLaterMovies.includes(movieName)) {
                watchLaterMovies.push(movieName);
                const li = document.createElement('li');
                li.textContent = movieName;
                watchLaterList.appendChild(li);
            }
        };

        // Function to handle user review submission
        document.getElementById('submit-review').addEventListener('click', () => {
            const reviewText = document.getElementById('user-review').value.trim();
            if (reviewText) {
                const reviewItem = document.createElement('li');
                reviewItem.textContent = reviewText;
                reviewsList.appendChild(reviewItem);
                document.getElementById('user-review').value = ''; // Clear the review input
            }
        });
    });
