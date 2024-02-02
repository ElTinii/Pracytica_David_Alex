import Factura from './factura.js';

function init() {
}


$(document).ready(init);


$(document).ready(function() {
    $('.dialeg').hide();

    $('#apuntar').click(function() {
        $('#novaFactura').show();
    });

    $('#pendents').click(function() {
        $('#recuperarFactura').show();
    });

    $('#tancar, #tancar2, #tancar3').click(function() {
        $('.dialeg').hide(); 
    });
});