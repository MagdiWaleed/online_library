
// // Wrap it as a tool
// export const RecommendationsTool: Tool = {
//     name: "getRecommendations",
//     description: "Returns a list of recommended books based on the given query.",
//     func: getRecommendations,
// };

import { BaseMessage } from "@langchain/core/messages"
import { Annotation, messagesStateReducer} from "@langchain/langgraph"

export const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer:messagesStateReducer,
    }), 
})