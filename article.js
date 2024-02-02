export class Article {
    codi; article; unitats; preu;

    constructor(codi, article, unitats, preu) {
        this.codi = codi;
        this.article = article;
        this.unitats = unitats;
        this.preu = preu;
    }
}

export default Article;