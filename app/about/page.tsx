import { getRecommendations } from "@/agents/booksAgent/tool";
import { Button } from "@/components/ui/button";
import { getDatabase } from "@/lib/mongodb";


export default async function about() {
    const db = await getDatabase();
    const books = await db.collection("books").find({}).toArray();
    console.log(books);

    return (
        <>
            <div>

                {books.map((book) => (
                    <div key={book._id.toString()}>
                        {JSON.stringify(book)}
                    </div>
                ))}

            </div>
        </>
    )
}