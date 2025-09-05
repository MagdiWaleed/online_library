import { AgentState } from "./schema";
import { recommendationsTool } from "./tool";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";
import { START, END, StateGraph } from "@langchain/langgraph";
import {  ToolNode } from "@langchain/langgraph/prebuilt";



const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env['GOOGLE_API_KEY'],
    maxOutputTokens: 2048,
});
const llm_with_tools = llm.bindTools([recommendationsTool])

async function llmCall(state: typeof AgentState.State){
    const systemMessage = new SystemMessage(`
        You are a helpfull library Agent Called KnowledgeAI, your task is to help the user through using the tools you have
        Tools:
            - getAllSubjectsAndBookshelves: This tool help you to get all uniqe subjects and book shelves.
        Guidnce:
            - use Think -> Act -> Observe approach and use as many as you want tools to reach your goal.
        `)
    const messages = state.messages;
    const response =await llm_with_tools.invoke([systemMessage,...messages])
    messages.push(response)
    return {messages: messages}
}
async function shouldContinue(state: typeof AgentState.State) {
    const messages: BaseMessage[] = state.messages;
    const lastMessage = messages[messages.length - 1];

    if (
        !(lastMessage as AIMessage).tool_calls?.length
    ) {
        return END;
    } else {
        return "tools";
    }

}

const toolNode = new ToolNode([recommendationsTool])
const graph = new StateGraph(AgentState)
    .addNode("agent", llmCall)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ['tools', END])
    .addEdge("tools", "agent")

const agent = graph.compile()
export default function getAgent(){
    return agent
}