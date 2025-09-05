import * as React from "react"

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getAllBooks } from "./actions";
import getAgent from "@/agents/booksAgent/agent";
import { HumanMessage } from "@langchain/core/messages";

export default async function page() {
    const books = await getAllBooks()
    
    return (
        <div className="mt-[50px] max-w-[800px] min-w-[600px]">

            <p className="p">Welcome To The Library</p>
            <div className="h-[40px]"></div>


            <div className="h-[20px]"></div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 justify-items-center">
                {books.map((book, idx) => (
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
                                transform: `rotate(${(idx % 3 - 1) * 1.5}deg)`,
                            }}
                        >
                            <div className="absolute left-0 top-0 h-full w-[8px] bg-gray-800 shadow-inner"></div>

                            <div
                                className="absolute inset-0 bg-center bg-cover"
                                style={{ backgroundImage: `url(${book.imageUrl})` }}
                            ></div>

                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>

                            <CardContent className="absolute bottom-0 z-10 p-2 text-white w-full text-center line-clamp-3">
                                <p className="font-semibold text-sm sm:text-xs md:text-sm lg:text-base">
                                    {book.title}
                                </p>
                            </CardContent>

                            <div className="absolute top-0 right-0 h-full w-1 bg-white/20"></div>
                        </Card>
                    </Link>
                ))}
            </div>


        </div >

    )
}
