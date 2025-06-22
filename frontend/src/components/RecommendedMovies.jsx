import React, { useEffect, useState } from 'react'
import {Link} from "react-router"; 

const RecommendedMovies = ({movieTitles}) => {
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNGZlOTM5N2RlNDEyOWVhZmY2MzYyNWM2MjdmY2Y1NCIsIm5iZiI6MTc0OTg1ODcwNi4xMDA5OTk4LCJzdWIiOiI2ODRjYjk5MjkzM2I1ZDMyYTEzZmUwNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6-ZMFhPT1zpTy0pLgJLaukN5KxJbuNKRdXPoqjPeEkw'
  }
};


  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = [];

     
      const topTitles = movieTitles.slice(0, 10);

      for (const title of topTitles) {
        const movie = await fetchMovie(title);
        if (movie) results.push(movie);
        await delay(150); 
      }

      setMovies(results);
      setLoading(false);
    };

    if (movieTitles?.length) {
      loadMovies();
    }
  }, [movieTitles]);

  if (loading) {
    return (
      <p className="text-white text-center mt-10 animate-pulse">
        Generating recommendations...
      </p>
    );
  }

  if (!movies.length) {
    return (
      <p className="text-white text-center mt-10">
        No recommended movies found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="bg-[#232323] rounded-lg overflow-hidden"
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-white">
              No Image Available
            </div>
          )}

          <div className="p-4">
            <h3 className="text-sm font-semibold text-white truncate">
              {movie.title || movie.name}
            </h3>
            <p className="text-xs text-gray-400">
              {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecommendedMovies;