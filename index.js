import Factura from './factura.js';
import Article from './article.js';
import "https://code.jquery.com/jquery-3.6.3.js";
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
        let baseI = 0; 
        let iva = $('#iva').val();
        let total = calcularTotal(baseI, iva);
        let pagament = $('#pagat').is(':checked');
    
        let facturaId = $('#formulari').attr('data-editing-id');
        if (facturaId) {
            let factures = Factura.obtenirFactures();
            let factura = factures[facturaId];
            factura.data = data;
            factura.nif = nif;
            factura.client = client;
            factura.telefon = telefon;
            factura.email = email;
            factura.dte = dte;
            factura.subtotal = subtotal;
            factura.baseI = baseI;
            factura.iva = iva;
            factura.total = total;
            factura.pagament = pagament;

            localStorage.setItem('factures', JSON.stringify(factures));
        } else {
            let factura = new Factura(data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament);
            Factura.guardarFactura(factura);
        }
    
        actualitzarTaula();
        this.reset();
        $('#formulari').removeAttr('data-editing-id');
    });
    

function calcularBaseImponible(subtotal, dte) {
    return subtotal - (subtotal * dte / 100);
}

function calcularTotal(baseI, iva) {
    return baseI + (baseI * iva / 100);
}
function actualitzarTaula() {
    let facturaId = $('#formulari').attr('data-editing-id');
    let factures = Factura.obtenirFactures();
    let factura = facturaId ? factures[facturaId] : factures[factures.length - 1];
    let tbody = $('table tbody').get(0);

    if (facturaId && factura) {
        let fila = $(`tr[data-factura-id='${facturaId}']`);
        fila.children('td').get(1).textContent = factura.data;
        fila.children('td').get(2).textContent = factura.nif;
        fila.children('td').get(3).textContent = factura.client;
        fila.children('td').get(4).textContent = factura.telefon;
        fila.children('td').get(5).textContent = factura.email;
        fila.children('td').get(6).textContent = factura.subtotal.toString();
        fila.children('td').get(7).textContent = factura.dte.toString();
        fila.children('td').get(8).textContent = factura.baseI.toString();
        fila.children('td').get(9).textContent = factura.iva.toString();
        fila.children('td').get(10).textContent = factura.total.toString();
        fila.children('td').get(11).textContent = factura.pagament ? 'Sí' : 'No';
    } else {
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
        tbody.appendChild(tr);
        $(tr).attr('data-factura-id', factures.length - 1);
        agregarAccionesA(tr); 
    }
}

function agregarAccionesA(tr) {
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

    tr.appendChild(tdAccions);
}

document.getElementById("files").addEventListener("change", handleFileSelect);
function handleFileSelect(event) {
    let files = event.target.files;
    let f = files[0];
    let reader = new FileReader();
    reader.onload = (function(arxiu) {
        return function(e) {
            let factures = JSON.parse(e.target.result);
            factures.forEach(factura => {
                Factura.guardarFactura(factura);
                actualitzarTaula();
            });
        };
    })(f);
    reader.readAsText(f);
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
    let factures = Factura.obtenirFactures();
    let factura = factures[facturaId];

    $('#data').val(factura.data);
    $('#nif').val(factura.nif);
    $('#nom').val(factura.client);
    $('#telefon').val(factura.telefon);
    $('#email').val(factura.email);
    $('#dte').val(factura.dte);
    $('#iva').val(factura.iva);
    $('#pagat').prop('checked', factura.pagament);

    $('#formulari').attr('data-editing-id', facturaId);

    $('#novaFactura').show();
    eliminarFila();
}
let afg = document.getElementById('afegirArticle');
    let tbody = document.getElementById('taulaArticles'); 
    afg.addEventListener('click', function() {
        let tr = document.createElement('tr');
        tr.appendChild(crearElement('td', `${tbody.children.length + 1}`));
        tr.appendChild(crearElement('td')).setAttribute("contenteditable","true");
        tr.appendChild(crearElement('td')).setAttribute("contenteditable","true");
        tr.appendChild(crearElement('td')).setAttribute("contenteditable","true");
        tr.appendChild(crearElement('td')).setAttribute("contenteditable","true");
        tr.appendChild(crearElement('td')).setAttribute("contenteditable","true");
        tbody.appendChild(tr);
    });