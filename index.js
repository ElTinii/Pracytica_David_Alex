import Factura from './factura.js';

function init() {
}


$(document).ready(init);


$(document).ready(function() {
    // Oculta inicialmente los diálogos para asegurar que no se muestren
    $('.dialeg').hide();

    // Manejar clic en el botón "Apunta'm!"
    $('#apuntar').click(function() {
        // Muestra el diálogo del formulario
        $('#menu').show();
    });

    // Manejar clic en el botón "Plats per avui"
    $('#pendents').click(function() {
        // Muestra el diálogo con el menú del día
        $('#resum').show();
    });

    // Opcionalmente, manejar clic en los botones o íconos de cerrar para ocultar los diálogos
    $('#tancar, #tancar2, #tancar3').click(function() {
        $('.dialeg').hide(); // Esto ocultará todos los diálogos
    });
});