import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {Link} from "react-router";

const CardList = ({ title, category }) => {
  const [data, setData] = useState([]);
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNGZlOTM5N2RlNDEyOWVhZmY2MzYyNWM2MjdmY2Y1NCIsIm5iZiI6MTc0OTg1ODcwNi4xMDA5OTk4LCJzdWIiOiI2ODRjYjk5MjkzM2I1ZDMyYTEzZmUwNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6-ZMFhPT1zpTy0pLgJLaukN5KxJbuNKRdXPoqjPeEkw'
  }
};
useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => setData(res.results))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='text-white px-4'>
      <h2 className='pt-10 pb-5 text-lg font-medium'>{title}</h2>

      <Swiper slidesPerView={"auto"} spaceBetween={10} className='mySwiper'>
        {data.map((item, index) => (
          <SwiperSlide key={index} className='max-w-72'>
            <Link to={`/movie/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
              alt=""
              className='h-44 w-full object-cover'
            />
            <p className='text-center pt-2 truncate'>{item.original_title}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardList;