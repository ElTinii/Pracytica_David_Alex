export class Article {
    codi; article; unitats; preu; subtotal

    constructor(codi, article, unitats, preu, subtotal) {
        this.codi = codi;
        this.article = article;
        this.unitats = unitats;
        this.preu = preu;
        this.subtotal = subtotal;
    }
}

export default Article;