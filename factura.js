export class Factura{
    static num = 0; 
    data; nif; client; telefon; email; subtotal; dte; baseI; iva; total; pagament;

    constructor(data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament) {
        this.num = Factura.num++;
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

    static guardarFactura(factura) {
        const factures = Factura.obtenerFacturas();
        factures.push(factura);
        localStorage.setItem('factures', JSON.stringify(factures));
    }

    static obtenirFactures() {
        const facturesGuardades = localStorage.getItem('factures');
        return facturesGuardades ? JSON.parse(facturesGuardades) : [];
    }
    static descarregarJson() {
        const factures = Factura.obtenirFacturas(); 
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(factures));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "facturas.json");
        document.body.appendChild(a); 
        a.click();
        a.remove();
    }   
}
export default Factura;