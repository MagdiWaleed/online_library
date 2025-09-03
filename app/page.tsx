import { Button } from "@/components/ui/button";
import { DataGenerator, Book } from "@/utilities/generator";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";


export default function page() {
    const books: Book[] = DataGenerator.getBooks();
    console.log(books);
    return (
        <>
            <div className="mt-[50px]">

                <p className="p">Welcome To The Library</p>
                <div className="h-[w0px]"></div>

                <div className="h-[300px] w-[700px]">

                    <Carousel
                        opts={{
                            align: "start",

                        }}

                    >
                        <CarouselContent className="flex gap-4  h-[280px] items-end" >
                            {books.slice(0, 5).map((book, index) => (
                                <CarouselItem
                                    key={index}
                                    className=" flex-none w-[150px] sm:w-[160px] hover:sm:w-[180px] hover:mb-[20px] md:w-[170px] hover:md:w-[190px] lg:w-[180px] hover:lg:w-[200px] transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                    <Card className=" h-[250px] bg-center bg-cover hover:h-[260px] transition-all duration-300 ease-in-out flex justify-center items-center"
                                        style={
                                            { backgroundImage: `url(background.jpg)` }
                                        }>
                                        <CardContent className="bg-transparent sm:w-[150px] md:w-[170px] lg:w-[190px] line-clamp-3 ">
                                            <p className="text-3xl text-white bg-transparent ">{book.title}</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

            </div >

        </>
    )
}