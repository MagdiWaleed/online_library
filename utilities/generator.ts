
export class Book {
    
    constructor (
  public  id:string,
  public title: string,
  public img: string
    ){

     
    }
}


export class DataGenerator{
 static  getBooks(): Book[] {
    const books:Book[] = [];

    for(let i =0 ; i<100;i++){
        books.push(new Book("1","I Am The Book Of The Thing","https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimg&psig=AOvVaw3XSyz19UY6lLJiCc21-564&ust=1756996451617000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJCQ9PznvI8DFQAAAAAdAAAAABAE"))
    }


 return books;
    
 }

}
export default DataGenerator;