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

export async function getBookPages(book_id: string,fromPage:number, toPage:number) {

    try {
    const book = await prisma.books.findUnique({
    where: { id: book_id },
    select: { pages: true },
    })
    return book?.pages.slice(fromPage,toPage)

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getBooksBySubjectAndCategory( subjects:string[], bookshelves: string[]) {

    try {
    const books = await prisma.books.findMany({
        where: {
            subjects: {
            hasSome: subjects,
            },
            bookshelves:{
                hasSome:bookshelves,
            }
        },
         select:{
                title:true,
                imageUrl:true,
                id:true,
                author:true,
            }
        
        });
    console.log(bookshelves)
    console.log(subjects)
    console.log(books)
    return books

    }catch(error){
        console.error("error in fetch books: ",error)
        throw new Error("failed to fetch books");
    }
}

export async function getAllUniqueSubjects() {
  const books = await prisma.books.findMany({
    select: { subjects: true },
  });

  const allSubjects = books.flatMap(book => book.subjects);
  const uniqueSubjects = Array.from(new Set(allSubjects));  // remove duplicates

  return uniqueSubjects;
}

export async function getAllUniqueBookshelve() {
  const books = await prisma.books.findMany({
    select: { bookshelves: true },
  });

  const allBookshelve = books.flatMap(book => book.bookshelves);
  const uniqueBookshelve = Array.from(new Set(allBookshelve));  // remove duplicates

  return uniqueBookshelve;
}