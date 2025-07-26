import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import MovieBanner from "./MovieBanner";
import type { MovieData } from "./Movies";

interface MovieCarouselProps {
    latest: MovieData[];
    // Removed onPlayMovie prop: onPlayMovie: (movie: MovieData) => void;
}

function MovieCarousel({ latest }: MovieCarouselProps) { // Removed onPlayMovie from destructuring
    return (
        <Carousel
            className="w-full h-[550px] relative"
            plugins={[Autoplay({ delay: 10000, stopOnInteraction: false, stopOnMouseEnter: true })]}
            opts={{
                loop: true,
            }}>
            <CarouselContent className="w-full h-full">
                {
                    latest.map((movie) => (
                        <CarouselItem key={movie.id} className="w-full h-full">
                            {/* MovieBanner no longer receives onPlayMovie from here */}
                            <MovieBanner details={movie} />
                        </CarouselItem>
                    ))
                }
            </CarouselContent>

            <CarouselPrevious
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                           bg-white/20 backdrop-blur-sm rounded-full p-3 text-white
                           hover:bg-white/30 transition-all duration-300
                           opacity-0 group-hover:opacity-100 group-hover:left-6"
            />
            <CarouselNext
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                           bg-white/20 backdrop-blur-sm rounded-full p-3 text-white
                           hover:bg-white/30 transition-all duration-300
                           opacity-0 group-hover:opacity-100 group-hover:right-6"
            />
        </Carousel>
    );
}

export default MovieCarousel;
