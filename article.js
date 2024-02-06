export class Article {
    codi; article; unitats; preu;

    constructor(codi, article, unitats, preu) {
        this.codi = codi;
        this.article = article;
        this.unitats = unitats;
        this.preu = preu;
    }
    static afegirArticle(article) {
        this.articles.push(article);
    }
}

export default Article;