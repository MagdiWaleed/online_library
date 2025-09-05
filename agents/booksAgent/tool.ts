import { getAllUniqueBookshelve, getAllUniqueSubjects } from "@/app/actions";
import { DynamicTool } from "@langchain/core/tools";

async function getSubjectsAndRecommendations(): Promise<string> {
    const subjects = await getAllUniqueSubjects();
    const bookshelves = await getAllUniqueBookshelve();
    const allSubjectsString = subjects.join(", "); 
    const allBookshelve = bookshelves.join(", ");

    const result = `All Subjects: \n${allSubjectsString} \n All Book Shelves: \n ${allBookshelve}`;
    
    return result
}

export const recommendationsTool = new DynamicTool({
  name: "getAllSubjectsAndBookshelves",
  description: "Returns all unique subjects and bookshelves as a formatted string.",
  func: getSubjectsAndRecommendations, 
});


