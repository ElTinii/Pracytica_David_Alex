export class Factura{
    constructor(num, data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament) {
        this.num = num;
        this.data = data;
        this.nif = nif;
        this.client = client;
        this.telefon = telefon;
        this.email = email;
        this.subtotal = subtotal;
        this.dte = dte;
        this.baseI = baseI;
        this.iva = iva;
        this.total = total;
        this.pagament = pagament;
    }
}