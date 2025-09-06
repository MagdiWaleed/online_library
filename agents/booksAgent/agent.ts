
import { AgentState,BooksSchema,ExtractImageUrl } from "./schema";
import { recommendationsTool, recommendationsByRecommendation, getBookSummaryByTitle } from "./tool";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";
import { START, END, StateGraph } from "@langchain/langgraph";
import {  ToolNode } from "@langchain/langgraph/prebuilt";
import { ToolCall } from "@langchain/core/messages/tool";




const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env['GOOGLE_API_KEY'],
    temperature:0,

});
const llm_with_tools = llm.bindTools([recommendationsTool, recommendationsByRecommendation,getBookSummaryByTitle])
const llm_with_structure_output = llm.withStructuredOutput(BooksSchema);
const llm_img_url_extractor = llm.withStructuredOutput(ExtractImageUrl);

async function llmCall(state: typeof AgentState.State){
    const systemMessage = new SystemMessage(`
        You are a helpfull library Agent Called KnowledgeAI, your task is to help the user through finding recommendation books for him, exploring book details,... etc using the tools you have
        Tools:
            - getAllSubjectsAndBookshelves: This tool help you to get all uniqe subjects and book shelves.
            - getRecommendationByRecommendations: This tool give you recommendation for books by providing book shelves and subjects
            - getBookSummary: This tool give you summary of a book that you can use it as context to answer user questions.
        Guidnce:
            - use Think -> Act -> Observe approach and use as many as you want tools to reach your goal.
            - if user asked about recommendation that not exist pick closer set of  book shelves and subjects to give him/her recommendations.
            - if the user asked you about recommendation fetch subjects and book shelves to provide him/her better answer
        
        Ensure to follow the above instructions.    
        `)
    const messages = state.messages;

    const response =await llm_with_tools.invoke([systemMessage,...messages,])
    return {messages: [...messages ,response]}
}
async function outputParser(state: typeof AgentState.State) {
    const messages: BaseMessage[] = state.messages;
    const response = await llm_with_structure_output.invoke((messages[messages.length-2].content as string))
    state.books = response;
    // console.log("***************, ",state.books.books)
    if (state.books.books.length >0){
        state.haveBooks = true;
    }
    return state
}

async function outputImageParser(state: typeof AgentState.State) {
    const messages: BaseMessage[] = state.messages;
    const response = await llm_img_url_extractor.invoke((messages[messages.length-2].content as string))
    state.bookUrl = response;
    // console.log("***************, ",state.books.books)
    if(response.imgUrl == "" || response.imgUrl == undefined){
        return state
    }
    state.haveBookUrl = true;
    
    return state
}
async function shouldContinue(state: typeof AgentState.State) {
    const messages: BaseMessage[] = state.messages;
    const lastMessage = messages[messages.length - 1];
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("")
    // console.log("messages lengths: ",messages.length)
    // console.log("messages lengths: ",messages)
    // console.log("lastMessage in agent: ",lastMessage)
    if (
        !(lastMessage as AIMessage).tool_calls?.length
    ) { 
        if (messages.length>3){
        
            if ((messages[messages.length-3] instanceof AIMessage && (messages[messages.length-3] as AIMessage).tool_calls?.length )){
                for (const tool of (messages[messages.length-3] as AIMessage).tool_calls|| [] ){
                    if ((tool as ToolCall).name == 'getRecommendationByRecommendations'){
                        return "outputParser";
                    }
                    if ((tool as ToolCall).name == 'getBookSummary'){
                        return "outputImageParser";
                    }
                 }
            }
        
        }
        return END;
    } else {
        // console.log("tring to call tool")
        return "tools";
    }

}

const toolNode = new ToolNode([recommendationsTool,recommendationsByRecommendation,getBookSummaryByTitle])
const graph = new StateGraph(AgentState)
    .addNode("agent", llmCall)
    .addNode("tools", toolNode)
    .addNode("outputParser",outputParser)
    .addNode("outputImageParser",outputImageParser)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["outputParser",'outputImageParser','tools', END])
    .addEdge("tools", "agent")
    .addEdge("outputParser",END)
    .addEdge("outputImageParser",END)

const agent = graph.compile()
export default function getAgent(){
    return agent
}