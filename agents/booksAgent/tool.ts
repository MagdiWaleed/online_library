import { Tool } from "@langchain/core/tools";

async function getRecommendations(query: string): Promise<string[]> {
    const recommendations = [
        "Book 1 related to " + query,
        "Book 2 related to " + query,
        "Book 3 related to " + query,
    ];
    return recommendations;
}
export {getRecommendations};
