import { getAllBookTitles, getAllUniqueBookshelve, getAllUniqueSubjects, getBookPages, getBooksBySubjectAndCategory, getBookSubjectAndCategory, getTheBookSummaryByTitle } from "@/app/actions";
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

  let recommendations = input.split(",").map(r => r.trim());
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

async function getBooksSimilierToBook(input:string): Promise<string> {
  input = input.trim()          
             .replace(/\s+/g, ' ')
             .replace(/\.$/, '');  
  const SandC:any =await getBookSubjectAndCategory(input)
  const  temp = []
  for (const subject of SandC.subjects ){
    temp.push(subject)
  }
  for (const bookshelve of SandC.bookshelves){
    temp.push(bookshelve)
  }
  const recommendationBooks = await getBooksBySubjectAndCategory(temp);
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
    input = input.trim()          
             .replace(/\s+/g, ' ')
             .replace(/\.$/, '');  
  const book = await getTheBookSummaryByTitle(input);
    const output_text = `
    Book Summary: ${book?.summary}
    Image url: ${book?.imageUrl}
    Book  id: ${book?.id}
    `
    return output_text
}

async function getAllBookTitlesTool(): Promise<string> {
    const books = await getAllBookTitles();
    let output_text = "Books Title:\n"
    for (const book of books){
      output_text+=`${book.title}\n`
    }
    
    return output_text
}
  async function getBookpagess(input:any): Promise<string> {
    input = input.split('--')
    const title:string = input[0]
    const start:number = Number(input[1])
    const end:number = Number(input[2])
    const pages:string[] = await getBookPages(title,start,end)||[];
    let outpu_string:string = ""
    for (const page of pages){
      outpu_string+=`${page}\n`
    }
    return outpu_string;
}



async function getBookSubjectsAndCategory(input:string): Promise<string> {
      input = input.trim()          
             .replace(/\s+/g, ' ')
             .replace(/\.$/, '');   
  const book= await getBookSubjectAndCategory(input);
    let output_text = "Subjects:\n";
    for (const subject of book?.subjects||[]){
      output_text+=`${subject}\n`
    }
    output_text = "Book Shelve:\n";
    for (const bookshelve of book?.bookshelves||[]){
      output_text+=`${bookshelve }\n`
    }
    
    return output_text
}

export const getBookPagesTool = new DynamicTool({
  name:"getBookpagess",
  description:`
  This tool give u book content from Start page to End page.
  Args:
    - input: a single string containing book title, start page, and end page.
      the input must be in this shape "bookTitle--startPage--endPage".
  Example:
    - "Keep Your Shape--0--100": is mean book title is Keep Your Shape, from page 0 to page 100.
  `,
 func: getBookpagess
});

export const getBookSubjectsAndCategoriesTool = new DynamicTool({
  name:"getBookSubjectsAndCategory",
  description:`
  This tool takes the title of the book and get its all subjects and book shelves.
  Args:
    - input: is the book title that you want to know its subjects and book shelves.
  `,
 func: getBookSubjectsAndCategory
});
export const getBookTitlesTool = new DynamicTool({
  name:"getAllBookTitlesTool",
  description:`
  This tool help you to get all the books titles from the database.
`,
 func: getAllBookTitlesTool
});
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

export const getBooksSimilierToBookTool = new DynamicTool({
  name: "getBooksSimilierToBook",
  description: `
  This tool help finding recommendations books for given book titile.
  Args:
    - input: book title.
    `,
  func: getBooksSimilierToBook, 
});


