import { BaseMessage } from "@langchain/core/messages"
import { Annotation, messagesStateReducer} from "@langchain/langgraph"
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const BookSchema = z.object({
    id:z.string().describe("The id of the book"),
    title: z.string().describe("The title of the book"),
    author: z.string().describe("The author of the book"),
    imageUrl: z.string().describe("The Url String for the Image"),
});

export const BooksSchema = z.object({
    books: z.array(BookSchema).describe("List ob BookSchema Objects") 
})
export const ExtractImageUrl = z.object({
    imgUrl: z.string().describe("Extract image url from given text") 
,    id: z.string().describe("Extract the id of the book from the text") 
})

export const AgentState = Annotation.Root({
        messages: Annotation<BaseMessage[]>({
            reducer:messagesStateReducer,
        }),
        books: Annotation<z.infer<typeof BooksSchema>>(),
        haveBooks: Annotation<boolean>(),
        bookUrl: Annotation<z.infer<typeof ExtractImageUrl>>(),
        haveBookUrl: Annotation<boolean>()
    })