'use client';
import getAgent from "@/agents/booksAgent/agent";
import { Button } from "@/components/ui/button";
import { getDatabase } from "@/lib/mongodb";
import { HumanMessage } from "@langchain/core/messages";

export default async function about() {
    // const agent = getAgent();
    // const response = await agent.invoke({ messages: [new HumanMessage("what is the types of books you have")] });
    let sessionId: string = "";
    return (
        <>
            <div>
                <Button onClick={async () => {
                    const response = await fetch("/api/agent", {
                        method: "POST",
                        body: JSON.stringify({
                            message: new HumanMessage("what is my name"),
                        }),
                        headers: {
                            'x-session-id': sessionId,
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                        },
                        cache: "no-store",
                    });
                    const data = await response.json()
                    sessionId = data.sessionId
                    console.log(data.sessionId);
                }}>
                    Click Me
                </Button>

            </div>
        </>
    )
}