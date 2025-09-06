import getAgent  from "@/agents/booksAgent/agent";
import { BaseMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";

const sessions: Record<string,BaseMessage[]>= {};

const agent = getAgent()

export async function POST(req: Request) {
    const sessionId:string = req.headers.get("x-session-id")==""? uuidv4():req.headers.get('x-session-id')!;
    const data:any = await req.json()
    if (!sessions[sessionId]) {
      sessions[sessionId] = []; 
    }
    const sessionMessage = [...sessions[sessionId], data.message]
    
    
    // console.log("from the api: ",data)
    const response = await agent.invoke({ messages: sessionMessage });
    sessions[sessionId] = response.messages;

  // console.log("//////////////////////////",response.messages)
  // console.log("the response: ",response.messages[response.messages.length-1].content)
  return new Response(JSON.stringify({response: response.messages[response.messages.length-1].content,sessionId:sessionId}),{
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
