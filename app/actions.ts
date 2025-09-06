"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function getAllBooks(){
    try{
        const books = await prisma.books.findMany({
            select:{
                title:true,
                imageUrl:true,
                id:true
            }
        })
        return books
    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}


export async function getAllBookTitles(){
    try{
        const books = await prisma.books.findMany({
            select:{
                title:true,
            }
        })
        return books
    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getBookDetails(book_id:string){
    try{
        const books = await prisma.books.findMany({
            where :{
                id:book_id
            },
            select:{
                title:true,
                imageUrl:true,
                summary:true,
                author:true,
                subjects:true,
                bookshelves:true,
                id:true
            }
        })
        return books[0]
    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getTheBookSummaryByTitle(book_title: string) {

    try {
    const book = await prisma.books.findFirst({
    where: { title:{
       contains: book_title,
        mode: "insensitive"   } 
    },
    select: { summary: true, imageUrl:true, id:true},
    })
    return book

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}
export async function getTheBookText(book_id: string) {

    try {
    const book = await prisma.books.findUnique({
    where: { id: book_id },
    select: { text: true },
    })
    return book?.text

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getBookPages(book_title: string,fromPage:number, toPage:number) {

    try {
    const book = await prisma.books.findFirst({
    where: { title: {
       contains: book_title,
    mode: "insensitive" } },
    select: { pages: true },
    })
    return book?.pages.slice(fromPage,toPage)

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getBooksBySubjectAndCategory( recommendations: string[]) {

    try {
    const books1 = await prisma.books.findMany({
        where: {
            subjects: {
            hasSome: recommendations,
            },
        },
         select:{
                title:true,
                imageUrl:true,
                id:true,
                author:true,
                subjects:true,
                bookshelves:true
            }
        
        });
    const books2 = await prisma.books.findMany({
        where: {
            bookshelves: {
            hasSome: recommendations,
            },
        },
         select:{
                title:true,
                imageUrl:true,
                id:true,
                author:true,
                subjects:true,
                bookshelves:true
            }
        
        });
        const books = [...books1,...books2]
        const combinedUnique = books.filter(
            (book, index, self) => index === self.findIndex(b => b.id === book.id)
            );
    return combinedUnique

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getBookSubjectAndCategory( title: string) {

    try {
    const book = await prisma.books.findFirst({
        where: {
            title:{
            contains:title
            }
        },
         select:{
                author:true,
                subjects:true,
                bookshelves:true
            }
        
        });
    return book

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getAllUniqueSubjects() {
  const books = await prisma.books.findMany({
    select: { subjects: true },
  });

  const allSubjects = books.flatMap((book:{subjects:string[] | null}) => book.subjects || []);
  const uniqueSubjects = Array.from(new Set(allSubjects));  

  return uniqueSubjects;
}

export async function getAllUniqueBookshelve() {
  const books = await prisma.books.findMany({
    select: { bookshelves: true },
  });

const allBookshelve = books.flatMap((book: { bookshelves: string[] | null }) => book.bookshelves || [])
  const uniqueBookshelve = Array.from(new Set(allBookshelve));  

  return uniqueBookshelve;
}