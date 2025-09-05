'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";



import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Book } from "@/models/book_model";


const AutoDisplay = ({ books }: { books: any[] }) => {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );
    return (
        <>

            <div className="">

                <Carousel
                    opts={{
                        align: "start",

                    }}
                    plugins={[plugin.current]}

                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}

                >
                    <CarouselContent className="flex gap-4  h-[320px] items-end " >
                        {books.map((book, index) => (
                            <CarouselItem
                                key={index}
                                className=" flex-none sm:w-[200px] hover:sm:w-[220px]  md:w-[210px] hover:md:w-[230px] lg:w-[220px] hover:lg:w-[240px] transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                <Card className="relative h-[300px] w-full bg-center bg-cover hover:h-[320px] transition-all duration-300 ease-in-out flex justify-center items-center"
                                    style={
                                        { backgroundImage: `url(${book.imageUrl})` }
                                    }>
                                    <div className="absolute inset-0 bg-black/50 rounded-[10px] z-0"></div>

                                    <CardContent className="z-10 relative bg-transparent sm:w-[150px] md:w-[170px] lg:w-[190px] line-clamp-3 ">
                                        <p className="text-3xl text-white bg-transparent ">{book.title}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

            </div>

        </>
    );
};

export default AutoDisplay;