import Factura from './factura.js';
import Article from './article.js';
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
        let dte = $('#dte').val();
        let subtotal = 0;
        let baseI = calcularBaseImponible(subtotal, dte);
        let iva = $('#iva').val();
        let total = calcularTotal(baseI, iva); 
        let pagament = $('#pagat').is(':checked');
    
        let editingId = $(this).attr('data-editing-id');
    
        if (editingId) {
            Factura.actualizarFactura(editingId, {data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament});
            actualitzarFila(editingId);
        } else {
            let factura = new Factura(data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament);
            Factura.guardarFactura(factura);
            actualitzarTaula();
        }
        this.reset();
        $('#novaFactura').hide();
    });
    

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
    let btnDescarregar = crearElement('button', '', {class: 'impresora'});
    let imgDescarregar = crearElement('img', '', {src: '/assets/impresora.png', alt: ''});
    btnDescarregar.appendChild(imgDescarregar);
    
    let btnEliminar = crearElement('button', '', {class: 'eliminar'});
    let imgEliminar = crearElement('img', '', {src: '/assets/delete.svg', alt: ''});
    btnEliminar.appendChild(imgEliminar);
    btnEliminar.addEventListener('click', eliminarFila);

    let btnEditar = crearElement('button', '', {class: 'editar'});
    let imgEditar = crearElement('img', '', {src: '/assets/editar.png', alt: ''});
    btnEditar.appendChild(imgEditar);
    btnEditar.addEventListener('click', editarfactura);

    let btnCesta = crearElement('button', '', {class: 'cesta'});
    let imgCesta = crearElement('img', '', {src: '/assets/cesta.png', alt: ''});
    btnCesta.appendChild(imgCesta);
    btnCesta.addEventListener('click', mostrarArticles);
    
    tdAccions.appendChild(btnDescarregar);
    tdAccions.appendChild(btnEliminar);
    tdAccions.appendChild(btnEditar);
    tdAccions.appendChild(btnCesta);
    tr.appendChild(tdAccions);

    tbody.appendChild(tr);
    tr.setAttribute('data-factura-id', `${factures.length - 1}`);
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

function mostrarArticles(){
    $('#editarArticles').show();


}
function editarfactura() {
    let facturaId = this.closest('tr').getAttribute('data-factura-id');
    let factura = Factura.obtenirFactures()[facturaId];

    $('#formulari').attr('data-editing-id', facturaId); // Establece el modo de edición
    $('#novaFactura').show();
}
function actualitzarFila(facturaId) {
    let factura = Factura.obtenirFactures()[facturaId];
    let fila = $(`tr[data-factura-id="${facturaId}"]`);

    fila.find('td').eq(1).text(factura.data);
    fila.find('td').eq(2).text(factura.nif);
    // Continúa actualizando el resto de las celdas de la misma manera

    // No olvides limpiar el atributo 'data-editing-id' del formulario una vez completada la edición
    $('#formulari').removeAttr('data-editing-id');
}
document.getElementById("files").addEventListener("change", handleFileSelect);

function handleFileSelect(evt) {
    let files = evt.target.files;
    let f = files[0];
    let reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            let factures = JSON.parse(e.target.result);
            factures.forEach(factura => {
                Factura.guardarFactura(factura);
                actualitzarFila();
            });
        };
    })(f);
    reader.readAsText(f);
}