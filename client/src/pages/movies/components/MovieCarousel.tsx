import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios';

import 'swiper';
import 'swiper/'
import { Autoplay, EffectCoverflow, EffectFade, Keyboard, Pagination } from 'swiper/modules';
import { Image } from '@heroui/image';

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
                        <div>
                            <Image isBlurred src={item} className='object-fill' />
                            <p className='fixed bottom-2 mx-5 flex items-center font-semibold text-2xl text-white'>{data[index]}</p>
                        </div>
                    </SwiperSlide>)
            })
            }
        </Swiper>
    )
}

export default MovieCarousel