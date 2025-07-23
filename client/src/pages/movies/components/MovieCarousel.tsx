import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios';

import 'swiper';
import 'swiper/css'
import { Autoplay, EffectCoverflow, EffectFade, Keyboard, Pagination } from 'swiper/modules';

const data = [
    './1.jpg',
    './2.jpg',
    './3.jpg',
    './4.jpg',
    './5.jpg',
    './6.jpg',
    './7.jpg'
]

function MovieCarousel() {
    return (
        <Swiper
            autoplay={{ delay: 10000 }}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            modules={[Pagination, Keyboard, Autoplay]}
            slidesPerView={1}
            loop={true}
            effect='fade'
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            className='w-full h-full rounded-2xl bg-black'
        >
            {data.map((item, index) => {
                return (
                    <SwiperSlide>
                        <div className='relative w-full h-full flex items-center '>
                            <img
                                src='http://localhost:27110/api/thumbnail/3'
                                className='object-cover z-1'
                            />
                            <p className='absolute z-2 left-20 mx-5 flex items-center font-semibold text-2xl text-white'>Avenger</p>
                        </div>
                    </SwiperSlide>)
            })
            }
        </Swiper>
    )
}

export default MovieCarousel