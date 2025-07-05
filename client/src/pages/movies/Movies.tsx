import React, { useEffect, useState } from 'react'

import MovieCard from './components/MovieCard'
import MovieCarousel from './components/MovieCarousel';




function Movies() {

    const [movieData, setMovieData] = useState([]);

    return (
        <main className='min-h-screen mt-15 p-8'>

            {/* <div className='w-full h-1/2 bg-gray-700 rounded-2xl'>
                {/* <MovieCarousel /> */}
            {/* </div> */}

            <div className='w-full justify-center mt-4 flex gap-4 flex-wrap '>
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
                <MovieCard />
            </div>

        </main>
    )
}

export default Movies