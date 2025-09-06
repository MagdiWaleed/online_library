import { getAllUniqueBookshelve, getAllUniqueSubjects, getBooksBySubjectAndCategory, getTheBookSummaryByTitle } from "@/app/actions";
import { DynamicTool } from "@langchain/core/tools";

async function getSubjectsAndRecommendations(): Promise<string> {
    const subjects = await getAllUniqueSubjects();
    const bookshelves = await getAllUniqueBookshelve();
    const allSubjectsString = subjects.join(", "); 
    const allBookshelve = bookshelves.join(", ");

    const result = `All Subjects: \n${allSubjectsString} \n All Book Shelves: \n ${allBookshelve}`;
    
    return result
}

async function getRecommendationByRecommendations(input:string): Promise<string> {
    const recommendations = input.split(",").map(r => r.trim());
    const recommendationBooks = await getBooksBySubjectAndCategory(recommendations);
    let output_text:string = "";
    for (const book of recommendationBooks){
      output_text +=`
      Book id: ${book.id}
      Book title: ${book.title}
      Image Url: ${book.imageUrl}
      Author: ${book.author}
      Book subjects: ${book.subjects}
      Book book shelves: ${book.bookshelves}
      \n===\n
      ` ;
    } 
    return output_text
}

async function getBookSummary(input:string): Promise<string> {
    const book = await getTheBookSummaryByTitle(input);
    const output_text = `
    Book Summary: ${book?.summary}
    Image url: ${book?.imageUrl}
    Book  id: ${book?.id}
    `
    return output_text
}

// async function getAllBookTitles(input:string): Promise<string> {
//     const books = await getAllBookTitles(input);
//     let output_text = ""
//     for (const book of books){
//       output_text+=`${book}\n`
//     }
    
//     return output_text
// }

export const getBookSummaryByTitle = new DynamicTool({
  name:"getBookSummary",
  description:`
  This tool help you to get the book summary by providing its name.
  Args:
    - input: the book title.`,
 func: getBookSummary
});

export const recommendationsByRecommendation = new DynamicTool({
  name:"getRecommendationByRecommendations",
  description:`
  This function help you to get list of books and its details
  Input string must be in this structure:
    - subject1, subject2, subject3, ...
  list all of the subjects and the book shelve that related to the user question to peforme better recommerdation process`,
  func: getRecommendationByRecommendations
});


export const recommendationsTool = new DynamicTool({
  name: "getAllSubjectsAndBookshelves",
  description: "Returns all unique subjects and bookshelves as a formatted string.",
  func: getSubjectsAndRecommendations, 
});



