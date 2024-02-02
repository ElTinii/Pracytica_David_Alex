import Factura from './factura.js';

function init() {
}


$(document).ready(init);


$(document).ready(function() {

    $('#guardar').click(function() {
        Factura.descarregarJson();
    });

    $('.dialeg').hide();

    $('#facutra').click(function() {
        $('#novaFactura').show();
    });

    $('#recuperar').click(function() {
        $('#recuperarFactura').show();
    });

    $('#tancar, #tancar2, #tancar3').click(function() {
        $('.dialeg').hide(); 
    });
    $('#formulari').submit(function(e) {
        e.preventDefault(); 
    
        let data = $('#data').val();
        let nif = $('#nif').val();
        let client = $('#nom').val(); 
        let telefon = $('#telefon').val();
        let email = $('#email').val();
        let subtotal = $('#subtotal').val();
        let dte = $('#dte').val();
        let baseI = calcularBaseImponible(subtotal, dte);
        let iva = $('#iva').val();
        let total = calcularTotal(baseI, iva); 
        let pagament = $('#pagat').is(':checked');
    
        let factura = new Factura(data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament);
        Factura.guardarFactura(factura);
        actualitzarTaula();
        this.reset();
})

function calcularBaseImponible(subtotal, dte) {
    return subtotal - (subtotal * dte / 100);
}

function calcularTotal(baseI, iva) {
    return baseI + (baseI * iva / 100);
}
function actualitzarTaula() {
    let factures = Factura.obtenirFactures();
    let factura = factures[factures.length - 1];
    let tbody = $('table tbody');

    var tr = $('<tr></tr>');
    tr.append(`<td>${factures.length}</td>`);
    tr.append(`<td>${factura.data}</td>`);
    tr.append(`<td>${factura.nif}</td>`);
    tr.append(`<td>${factura.client}</td>`);
    tr.append(`<td>${factura.telefon}</td>`);
    tr.append(`<td>${factura.email}</td>`);
    tr.append(`<td>${factura.subtotal}</td>`);
    tr.append(`<td>${factura.dte}</td>`);
    tr.append(`<td>${factura.baseI}</td>`);
    tr.append(`<td>${factura.iva}</td>`);
    tr.append(`<td>${factura.total}</td>`);
    tr.append(`<td>${factura.pagament ? 'Sí' : 'No'}</td>`);
    tr.append(`<td><button class="descarregar">Descarregar</button></td>`);
    tr.append(`<td><button class="eliminar"><img src="/assets/delete.svg" alt=""></button></td>`);
    tbody.append(tr);
  
}
}); 
