import { Book } from "@/models/book_model";
import Image from "next/image";

export default async function page({ params }: { params: { book_id: string } }) {
    const data = await fetch(`http://gutendex.com/books?ids=${params.book_id}`);
    const dataDictanory = await data.json();
    const book: Book = new Book(dataDictanory.results[0]);

    return (
        <div className="flex flex-col items-center py-10 px-4 bg-gray-900 min-h-screen">

            {/* Book Title */}
            <div className="w-full max-w-[700px] text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">{book.title}</h1>
                {book.authors.length > 0 && (
                    <p className="mt-2 text-xl text-gray-300">
                        Written by <span className="font-semibold text-white">{book.authors[0].name}</span>
                    </p>
                )}
            </div>

            {/* Main content: Cover + Summary */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-[900px] bg-black/40 rounded-xl p-6 shadow-lg">

                {/* Book Cover */}
                <div className="relative w-full md:w-[300px] h-[450px] flex-shrink-0">
                    <Image
                        src={book.imageUrl || "/background.jpg"}
                        alt={book.title}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                        placeholder="blur"
                        blurDataURL="/background.jpg"
                    />
                </div>

                {/* Summary */}
                <div className="flex-1 text-white overflow-auto">
                    <h2 className="text-2xl font-semibold mb-4">Quick Summary</h2>
                    <p className="text-lg leading-relaxed">
                        {book.summaries[0] || "No summary available for this book."}
                    </p>
                </div>
            </div>
        </div>
    );
}
