import React, { useEffect, useState } from 'react';
import { Bookmark, Play } from 'lucide-react';
import { Link } from 'react-router';

const Hero = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNGZlOTM5N2RlNDEyOWVhZmY2MzYyNWM2MjdmY2Y1NCIsIm5iZiI6MTc0OTg1ODcwNi4xMDA5OTk4LCJzdWIiOiI2ODRjYjk5MjkzM2I1ZDMyYTEzZmUwNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6-ZMFhPT1zpTy0pLgJLaukN5KxJbuNKRdXPoqjPeEkw',
      },
    };

    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
      .then((res) => res.json())
      .then((res) => {
        if (res.results?.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  return (
    <div className="text-white relative">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt="bg-img"
        className="w-full rounded-2xl h-[480px] object-center object-cover"
      />

      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 md:bottom-8 left-4 font-medium z-10">
        <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition duration-200">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" />
          Save for Later
        </button>

        <Link to={`/movie/${movie.id}`}>
          <button className="flex justify-center items-center bg-[#e50914] text-white hover:bg-gray-200 hover:text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base transition duration-200">
            <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" />
            Watch Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
