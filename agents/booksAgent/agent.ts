
import { AgentState,BooksSchema,ExtractImageUrl } from "./schema";
import { recommendationsTool, recommendationsByRecommendation, getBookSummaryByTitle,getBookTitlesTool,getBookSubjectsAndCategoriesTool,getBooksSimilierToBookTool,getBookPagesTool} from "./tool";
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
const llm_with_tools = llm.bindTools([recommendationsTool, recommendationsByRecommendation,getBookSummaryByTitle,getBookTitlesTool,getBookSubjectsAndCategoriesTool,getBooksSimilierToBookTool,getBookPagesTool])
const llm_with_structure_output = llm.withStructuredOutput(BooksSchema);
const llm_img_url_extractor = llm.withStructuredOutput(ExtractImageUrl);

async function llmCall(state: typeof AgentState.State){
    const systemMessage = new SystemMessage(`
        You are a helpful library Agent Called KnowledgeAI, you can help the user about any things related to our books.
        if any user misspell a book choose the closser one to it from our books and perform the operations u want on it to help the user.
        Use the following tools to help you assist the user.
        Tools:
            - getAllSubjectsAndBookshelves: This tool help you to get all uniqe subjects and book shelves.
            - getRecommendationByRecommendations: This tool give you recommendation for books by providing book shelves and subjects
            - getBookSummary: This tool give you summary of a book that you can use it as context to answer user questions.
            - getAllBookTitlesTool: This tool help you to get all books titles from the database.
            - getBookSubjectsAndCategory: This tool usefull tool to know what is the subjects and book shelves for specific book.
            - getBooksSimilierToBook: This tool help get the recommended books for given book title.
            - getBookpagess: This tool give a book pages from Start page to End Page
        Guidnce:
            - use Think -> Act -> Observe approach and stack as many tools as you want to reach your goal .
            - if user asked about recommendation that not exist pick closer set of book shelves and subjects to give him/her recommendations.
            - if the user asked you about recommendation fetch subjects and book shelves to provide him/her better answer.
        IMPORTANT: 
            - if your didn't have information about specific book you can check its name using the "getAllBookTitlesTool" to correct its name and perform the same tools on it.
            - Never change the Structure of books' subjects and book shelves because there too sensetives for example ("subject -- subject") take it like that.
        Ensure to follow the above instructions.    
        `)
    const messages = state.messages;

    const response =await llm_with_tools.invoke([systemMessage,...messages,])
    return {messages: [...messages ,response]}
}
async function outputParser(state: typeof AgentState.State) {
    const messages: BaseMessage[] = state.messages;
    try{
        const response = await llm_with_structure_output.invoke((messages[messages.length-2].content as string))
        state.books = response;
        // console.log("***************, ",state.books.books)
        if (state.books.books.length >0){
            state.haveBooks = true;
        }
        return state
    }catch(e){
        state.haveBooks= false;
    }
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
                    if ((tool as ToolCall).name == 'getRecommendationByRecommendations' ||(tool as ToolCall).name ==  'getBooksSimilierToBook'){
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

const toolNode = new ToolNode([recommendationsTool,recommendationsByRecommendation,getBookSummaryByTitle,getBookTitlesTool,getBookSubjectsAndCategoriesTool,getBooksSimilierToBookTool,getBookPagesTool])
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