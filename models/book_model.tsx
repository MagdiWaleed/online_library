
export class Author {
    constructor(
        public name: string,
        public birth_year: number,
        public death_year: number
    ) {

    }
}

export class Book {
    public id: number;
    public title: string;
    public authors: Author[];
    public summaries: string[];
    public subjects: string[];
    public bookshelves: string[];
    public language: string[];
    public imageUrl: string;
    public download_count: number;
    constructor(
        dataDictanory: any
    ) {
        this.id = dataDictanory.id;
        this.title = dataDictanory.title;
        this.authors = dataDictanory.authors.map((author: any) => new Author(author.name, author.birth_year, author.death_year))
        this.summaries = dataDictanory.summaries;
        this.subjects = dataDictanory.subjects;
        this.bookshelves = dataDictanory.bookshelves;
        this.language = dataDictanory.languages;
        this.imageUrl = dataDictanory.formats["image/jpeg"]
        this.download_count = dataDictanory.download_count;
    }
}