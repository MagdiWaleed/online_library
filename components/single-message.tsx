"use client";

import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";


export interface Message {
    message: any;
    role: string;
    timestamp?: Date;
    imgUrl?: string;
    bookId?: string;
}



export const SingleMessage = ({ role, message, timestamp, imgUrl, bookId }: Message) => {
    const router = useRouter();
    let books: any[] = []
    let bookUrl: string = "none";
    if (role == "recommendation") {
        books = message
        if (books.length > 3) {
            books = books.reverse()
            books = books.slice(0, 3)
        }
    }
    if (role == "ai+book" && imgUrl == "") {
        role = "ai";
    } else
        if (role == "ai+book") {
            bookUrl = `url(${imgUrl})`!
        }
    return (
        <>
            {role != "recommendation" ?

                (
                    <div
                        onClick={() => {
                            if (bookId != undefined && role == "ai+book") {
                                router.push(`/${bookId}`);
                            }
                        }}
                        style={
                            { backgroundImage: bookUrl }
                        }

                        className={`relative p-3 my-2 max-w-[80%] rounded-xl ${role === "user"
                            ? "bg-orange-600 text-white ml-auto rounded-br-none"
                            : role == "ai+book" ? " text-white mr-auto rounded-bl-none bg-[] bg-center  bg-cover w-[250px] hover:w-[260px]   cursor-pointer transition-all duration-500 ease-in-out transform hover:translate-y-0 translate-y-[5px] hover:py-[15px] hover:px-[15px]" ://hover:scale-110
                                "bg-gray-700 text-white mr-auto rounded-bl-none"
                            }`}

                    >  {role == "ai+book" ? <div className="absolute rounded-xl rounded-bl-none inset-0 from-blue-800/75 to-black/70  bg-gradient-to-br border-2 pointer-events-none"></div> : <div></div>}
                        <div className="relative text-sm z-60 prose text-left prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message}
                            </ReactMarkdown>
                        </div>

                        {/* <div className=" relative text-sm z-60">{message}</div> */}

                        {timestamp && (
                            <div
                                className={`text-xs mt-1 opacity-70 ${role === "user" ? "text-blue-100 " : "text-gray-300"
                                    }`}
                            >
                                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>

                        )}
                    </div>) : (
                    <div>
                        <div className=" grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4 justify-items-center">
                            {

                                books.map((book: { title: string, id: string, imageUrl: string }, idx: number) => (
                                    <Link key={book.id} href={`/${book.id}`}>
                                        <Card
                                            className={`
                                relative
                                w-[80px] sm:w-[80px] md:w-[80px] lg:w-[80px]
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
        </>
    );
};
