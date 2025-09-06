import { Book } from "@/models/book_model";
import Image from "next/image";
import { getBookDetails, getBooksBySubjectAndCategory } from "../actions";

export default async function Page({ params }: { params: { book_id: string } }) {
    const { book_id } = await params
    const book = await getBookDetails(book_id);
    const books = await getBooksBySubjectAndCategory([...book.subjects, ...book.bookshelves])
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center py-12 px-4">
            {/* background glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-pink-500/20 blur-2xl rounded-full" />
            </div>

            {/* Title + author */}
            <div className="w-full max-w-3xl text-center mb-12">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
                    {book.title}
                </h1>
                {book.author?.length > 0 && (
                    <p className="mt-4 text-xl text-gray-300">
                        by{" "}
                        <span className="font-semibold grediant">
                            {book.author}
                        </span>
                    </p>
                )}
            </div>

            {/* Book card */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 transition hover:scale-[1.01] duration-300">
                <div className="relative w-full md:w-[320px] h-[480px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl">
                    <Image
                        src={book.imageUrl || "/background.jpg"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        placeholder="blur"
                        blurDataURL="/background.jpg"
                    />
                </div>
                <div className="flex-1 text-white max-h-[480px] overflow-y-auto pr-2">
                    <h2 className="text-3xl font-bold mb-4 grediant">
                        Quick Summary
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-200">
                        {book.summary || "No summary available for this book."}
                    </p>
                </div>
            </div>


            <div className="w-full max-w-6xl mt-16">
                <h2 className="text-4xl font-bold text-white mb-8 grediant text-center">
                    Recommended Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-300 cursor-pointer"
                        >
                            <div className="relative w-full h-[250px]">
                                <Image
                                    src={book.imageUrl || "/background.jpg"}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL="/background.jpg"
                                />
                            </div>
                            <div className="p-4 text-white">
                                <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                                {book.author && (
                                    <p className="text-gray-300 text-sm">
                                        by {book.author}
                                    </p>
                                )}
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
