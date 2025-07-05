import { Card, CardFooter } from "@heroui/card"
import { Image } from "@heroui/image"

import { motion, animate, stagger, } from "motion/react"
import { useEffect, useRef } from "react"
import SplitText from "../../../components/TextAnimation"

const dummy = {
    poster: "./4.jpg",
    title: "Avenger: End Game"
}

function MovieCard() {

    const titleContainer = useRef<HTMLParagraphElement | null>(null);

    return (

        <Card
            isFooterBlurred
            radius="lg"
            className='w-[450px] h-[300px] bg-white/20'
        >
            <Image
                isBlurred
                src="https://windows10spotlight.com/wp-content/uploads/2023/01/81a6e74c8adbf7f55406e8c4b80669d5.jpg"
                className='object-cover'
                alt={dummy.title}
            >
            </Image>

            <CardFooter
                className="overflow-hidden absolute bottom-0">
                <SplitText
                    text={dummy.title}
                    type='words' // chars', 'words', or 'lines'
                    animationProps={{
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        transition: {
                            delay: 0.5, // Delay each character's animation
                            duration: 1, // Duration of the animation
                            staggerChildren: 0.5, // Stagger delay between elements
                        }
                    }}
                    className="text-xl"
                />
            </CardFooter>
        </Card >

    )
}

export default MovieCard