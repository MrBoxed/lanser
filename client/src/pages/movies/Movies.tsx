import React, { useEffect, useState } from 'react'

import MovieCard from './components/MovieCard'
import MovieCarousel from './components/MovieCarousel';


function Movies() {

    const [movieData, setMovieData] = useState([]);

    return (
        <div className='h-full w-full mt-15 p-2 bg-white/30'>

            <div className='w-full h-1/3 bg-red-500'>
                <button>HELLo</button>
            </div>

        </div>
    )
}

export default Movies