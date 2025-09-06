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
    try{
      const response = await agent.invoke({ messages: sessionMessage,haveBooks:false, books:{books:[]},haveBookUrl:false, bookUrl:{id:'',imgUrl:''} });
      sessions[sessionId] = response.messages;
  
    // console.log("////////////////////////// books:",response)
    // console.log("////////////////////////// books:",response.books.books)
    // console.log("////////////////////////// has books:",response.haveBooks)
    // console.log("the response: ",response.messages[response.messages.length-1].content)
    return new Response(JSON.stringify({response: response.messages[response.messages.length-1].content,sessionId:sessionId, haveBooks:response.haveBooks, books:response.books.books,haveBookUrl:response.haveBookUrl, bookUrl:response.bookUrl.imgUrl, id:response.bookUrl.id}),{
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }
  catch(e){
 return new Response(JSON.stringify({ error: (e as Error).message || e }), {
  status: 500,
  headers: { "Content-Type": "application/json" },
});
    }
}
