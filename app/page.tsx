import { Button } from "@/components/ui/button";
// import { DataGenerator, Book } from "@/utilities/generator";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import AutoDisplay from "@/components/auto-display";
import { Book, Author } from "@/models/book_model";
import Link from "next/link";

export default async function page() {
    const books_per_page = await fetchBooksSeparately()
    const plainBooks = books_per_page[0].map(b => ({
        id: b.id,
        title: b.title,
        imageUrl: b.imageUrl,
    }));


    return (
        <div className="mt-[50px] max-w-[800px] min-w-[600px]">

            <p className="p">Welcome To The Library</p>
            <div className="h-[40px]"></div>

            <AutoDisplay books={plainBooks} />

            <div className="h-[20px]"></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 justify-items-center">
                {books_per_page[1].map((book, idx) => (
                    <Link key={book.id} href={`/${book.id}`}>
                        <Card
                            className={`
          relative
          w-[160px] sm:w-[170px] md:w-[180px] lg:w-[200px]
          aspect-[2/3]
          cursor-pointer
          rounded-lg
          overflow-hidden
          shadow-lg
          transition-transform duration-300 ease-in-out
          hover:-translate-y-2 hover:scale-105
          `}
                            style={{
                                transform: `rotate(${(idx % 3 - 1) * 1.5}deg)`, // subtle rotation variation
                            }}
                        >
                            {/* Spine */}
                            <div className="absolute left-0 top-0 h-full w-[8px] bg-gray-800 shadow-inner"></div>

                            {/* Cover image */}
                            <div
                                className="absolute inset-0 bg-center bg-cover"
                                style={{ backgroundImage: `url(${book.imageUrl})` }}
                            ></div>

                            {/* Gradient overlay for readability */}
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>

                            {/* Title */}
                            <CardContent className="absolute bottom-0 z-10 p-2 text-white w-full text-center line-clamp-3">
                                <p className="font-semibold text-sm sm:text-xs md:text-sm lg:text-base">
                                    {book.title}
                                </p>
                            </CardContent>

                            {/* Optional page edge highlight */}
                            <div className="absolute top-0 right-0 h-full w-1 bg-white/20"></div>
                        </Card>
                    </Link>
                ))}
            </div>


        </div >

    )
}

async function fetchBooksSeparately() {
    const urls = [
        "https://gutendex.com/books?page=6",
        "https://gutendex.com/books"
    ];

    const fetchPromises = urls.map(url => fetch(url).then(res => res.json()));
    const results = await Promise.all(fetchPromises);

    // Map each page's results to Book objects separately
    const booksPerPage: Book[][] = results.map(data =>
        data.results.map((r: any) => new Book(r))
    );

    return booksPerPage;
}


