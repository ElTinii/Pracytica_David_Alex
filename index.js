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
        let dte = $('#dte').val();
        let subtotal = 0;
        let baseI = 0;
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
    btnEditar.addEventListener('click', mostrarArticles);
    
    tdAccions.appendChild(btnDescarregar);
    tdAccions.appendChild(btnEliminar);
    tdAccions.appendChild(btnEditar);
    tr.appendChild(tdAccions);

    tbody.appendChild(tr);
}
let tbody = $('#tablaArticulos tbody').get(0)
    
// Crear una nueva fila
let tr = document.createElement('tr');
tr.appendChild(crearCeldaEditable('')); // Codi
tr.appendChild(crearCeldaEditable('')); // Article
tr.appendChild(crearCeldaEditable('1')); // Uni. con valor predeterminado
tr.appendChild(crearCeldaEditable('0')); // Preu con valor predeterminado
tr.appendChild(crearCeldaSubtotal()); // Subtotal, inicialmente en 0
tr.appendChild(crearCeldaAcciones()); // Acciones (botones)

// Añadir la nueva fila a la tabla
$('#taulaArticles tbody').append(tr);
});

// Función para crear una celda con un input editable
function crearCeldaEditable(valorPredeterminado) {
let td = document.createElement('td');
let input = document.createElement('input');
input.type = 'text';
input.value = valorPredeterminado;
input.className = 'input-editable'; // Asegúrate de definir este estilo en tu CSS
input.oninput = calcularSubtotalFila; // Función para recalcular el subtotal cuando cambie el input
td.appendChild(input);
return td;
}

// Función para crear la celda de subtotal
function crearCeldaSubtotal() {
let td = document.createElement('td');
td.className = 'subtotal';
td.textContent = '0'; // Subtotal inicial
return td;
}

// Función para recalcular el subtotal de una fila
function calcularSubtotalFila() {
let tr = this.parentNode.parentNode; // Referencia a la fila (tr)
let cantidad = tr.querySelector('input')[2].value; // Obtener la cantidad (Uni.)
let precio = tr.querySelector('input')[3].value; // Obtener el precio (Preu)
let subtotal = cantidad * precio; // Calcular subtotal
tr.querySelector('.subtotal').textContent = subtotal.toFixed(2); // Actualizar el texto de la celda de subtotal
}

// Función para crear celda de acciones, como eliminar fila
function crearCeldaAcciones() {
let td = document.createElement('td');
// Aquí puedes agregar botones o íconos para acciones como eliminar fila
return td;
}

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