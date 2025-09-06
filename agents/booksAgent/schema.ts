import { BaseMessage } from "@langchain/core/messages"
import { Annotation, messagesStateReducer} from "@langchain/langgraph"
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
export const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer:messagesStateReducer,
    }), 
})

const BookSchema = z.object({
  id:z.string().describe("The id of the book"),
  title: z.string().describe("The title of the book"),
  author: z.string().describe("The author of the book"),
  imageUrl: z.number().describe("The Url String for the Image"),
});