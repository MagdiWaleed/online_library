import getAgent from "@/agents/booksAgent/agent";
import { Button } from "@/components/ui/button";
import { getDatabase } from "@/lib/mongodb";
import { HumanMessage } from "@langchain/core/messages";


export default async function about() {
    const agent = getAgent()
    const response = await agent.invoke({ messages: [new HumanMessage("what is the types of books you have")] });
    console.log(response.messages[response.messages.length - 1].content)

    return (
        <>
            <div>


            </div>
        </>
    )
}