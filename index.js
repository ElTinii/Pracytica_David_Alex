import Factura from './factura.js';

function init() {
}


$(document).ready(init);


$(document).ready(function() {

    $('#guardar').click(function() {
        Factura.descarregarJson();
    });

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
    let tbody = $('table tbody').get(0); 

    let tr = document.createElement('tr');
    tr.appendChild(crearElement('td', `${factures.length}`));
    tr.appendChild(crearElement('td', factura.data));
    tr.appendChild(crearElement('td', factura.nif));
    tr.appendChild(crearElement('td', factura.client));
    tr.appendChild(crearElement('td', factura.telefon));
    tr.appendChild(crearElement('td', factura.email));
    tr.appendChild(crearElement('td', factura.subtotal.toString()));
    tr.appendChild(crearElement('td', factura.dte.toString()));
    tr.appendChild(crearElement('td', factura.baseI.toString()));
    tr.appendChild(crearElement('td', factura.iva.toString()));
    tr.appendChild(crearElement('td', factura.total.toString()));
    tr.appendChild(crearElement('td', factura.pagament ? 'Sí' : 'No'));
    
    let tdAccions = document.createElement('td');
    let btnDescarregar = crearElement('button', '', {class: 'descarregar'});
    let imgDescarregar = crearElement('img', '', {src: '/assets/descargar.png', alt: ''});
    btnDescarregar.appendChild(imgDescarregar);
    
    let btnEliminar = crearElement('button', '', {class: 'eliminar'});
    let imgEliminar = crearElement('img', '', {src: '/assets/delete.svg', alt: ''});
    btnEliminar.appendChild(imgEliminar);
    btnEliminar.addEventListener('click', eliminarFila);

    let btnEditar = crearElement('button', '', {class: 'editar'});
    let imgEditar = crearElement('img', '', {src: '/assets/editar.png', alt: ''});
    btnEditar.appendChild(imgEditar);
    
    tdAccions.appendChild(btnDescarregar);
    tdAccions.appendChild(btnEliminar);
    tr.appendChild(tdAccions);

    tbody.appendChild(tr);
}
}); 

function crearElement(element, text, attributes) {
    let e = document.createElement(element);
    if (text) e.textContent = text;
    if (attributes) {
        Object.keys(attributes).forEach(key => e.setAttribute(key, attributes[key]));
    }
    return e;
}
function eliminarFila() {
    let fila = this.closest('tr');
    fila.remove();
    let factures = Factura.obtenirFactures();
    factures.splice(fila.rowIndex - 1, 1);
    localStorage.setItem('factures', JSON.stringify(factures));
}