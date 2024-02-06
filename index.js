import Factura from './factura.js';
import Article from './article.js';
import "https://code.jquery.com/jquery-3.6.3.js";
function init() {
    localStorage.clear();
}
let factures = [];

$(document).ready(init);


$(document).ready(function() {

    $('#guardar').click(function() {
        Factura.descarregarJson();
    });

    $('#facutra').click(function() {
        $('#novaFactura').show();
        document.getElementById('data').focus();
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
            factures = new Factura(data, nif, client, telefon, email, subtotal, dte, baseI, iva, total, pagament);
            Factura.guardarFactura(factures);
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
        agregarAccions(tr); 
    }
}

function agregarAccions(tr) {
    let tdAccions = document.createElement('td');
    let btnDescarregar = crearElement('button', '', {class: 'impresora'});
    let imgDescarregar = crearElement('img', '', {src: '/assets/impresora.png', alt: ''});
    btnDescarregar.appendChild(imgDescarregar);
    btnDescarregar.addEventListener('click', printDocument);
    
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

document.getElementById("files").addEventListener("change", recuperarFitxer);
function recuperarFitxer(event) {
    try{
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
    }catch(e){
        alert("Error al recuperar el fitxer")
    }
 
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

function mostrarArticles() {
    let facturaId = $(this).closest('tr').data('factura-id'); 
    let factures = Factura.obtenirFactures();
    let factura = factures.find(f => f.id === facturaId);

    if (factura && factura.articles) {
        $('#taulaArticles tbody').empty();
        factura.articles.forEach(article => {
            let tr = $('<tr></tr>');
            tr.append($('<td></td>').text(article.codi));
            tr.append($('<td></td>').text(article.article));
            tr.append($('<td></td>').text(article.uni));
            tr.append($('<td></td>').text(article.preu));
            tr.append($('<td></td>').text(article.subtotal));
            $('#taulaArticles tbody').append(tr);
        });
    }
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


document.addEventListener('DOMContentLoaded', function() {
    let afg = document.getElementById('afegirArticle');
    let tbody = document.getElementById('taulaArticles').querySelector('tbody');

    afg.addEventListener('click', function() {
       
        let id = tbody.children.length + 1;
        let tr = document.createElement('tr');
        tr.appendChild(crearElement('td', id.toString())); 
        tr.appendChild(crearElement('td', '', {'contenteditable': 'true'})); 
        tr.appendChild(crearElement('td', '', {'contenteditable': 'true'})); 
        tr.appendChild(crearElement('td', '', {'contenteditable': 'true', 'class': 'preu'})); 
        tr.appendChild(crearElement('td', '', {'class': 'subtotal'})); 
        let tdAcc = document.createElement('td'); 

        let eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = function() { tr.remove(); calcularTotal(); };
        tdAcc.appendChild(eliminarBtn);

        let moureAmunt = document.createElement('button');
        moureAmunt.innerHTML = '&#x25B2;'; 
        moureAmunt.onclick = function() { 
            if (tr.previousElementSibling) tr.parentNode.insertBefore(tr, tr.previousElementSibling); 
        };
        tdAcc.appendChild(moureAmunt);

        let moureAball = document.createElement('button');
        moureAball.innerHTML = '&#x25BC;'; 
        moureAball.onclick = function() { 
            if (tr.nextElementSibling) tr.parentNode.insertBefore(tr.nextElementSibling, tr); 
        };
        tdAcc.appendChild(moureAball);

        tr.appendChild(tdAcc);
        tbody.appendChild(tr);
    });

    function crearElement(element, text, attributes = {}) {
        let e = document.createElement(element);
        if (text) e.textContent = text;
        Object.keys(attributes).forEach(key => e.setAttribute(key, attributes[key]));
        return e;
    }

    function calcularTotal() {
        let total = 0;
        document.querySelectorAll('#taulaArticles tbody tr').forEach(tr => {
            let cantidad = tr.children[2].textContent || 0; 
            let precio = tr.children[3].textContent || 0;
            let subtotal = cantidad * precio;
            tr.children[4].textContent = subtotal.toFixed(2);
            total += subtotal;
        });
        document.getElementById('sumaTotal').textContent = total.toFixed(2);
    }
    document.getElementById('taulaArticles').addEventListener('input', function(e) {
        if (e.target.classList.contains('preu')) {
            calcularTotal();
        }
    });
    document.getElementById('tancarEdicio').addEventListener('click', function() {
        let articles = [];
        let facturaId = $('#formulari').attr('data-editing-id');
        calcularTotal();
        document.querySelectorAll('#taulaArticles tbody tr').forEach(tr => {
            let codi = tr.children[0].textContent;
            let article = tr.children[1].textContent;
            let unitats = tr.children[2].textContent;
            let preu = tr.children[3].textContent;
            let subtotal = tr.children[4].textContent;
            articles.push(new Article(codi, article, unitats, preu, subtotal));
            actualitzarDadesTaula(facturaId, articles);
        });
        $('#editarArticles').hide();
    });
    function actualitzarDadesTaula(facturaId, nuevosArticulos) {
        let factures = Factura.obtenirFactures();
        let factura = factures.find(f => f.id === facturaId);
        if (factura) {
            factura.articles = nuevosArticulos;
            Factura.guardarFactura(factures); 
            localStorage.setItem('factures', JSON.stringify(factures));
        }
    }
});





function printDocument(){
    
    let facturaId = this.closest('tr').getAttribute('data-factura-id');
    let factures = Factura.obtenirFactures();
    let factura = factures[facturaId];

    let div = document.getElementById('print');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    div.appendChild(crearElement('h1', 'Factura'));
    div.appendChild(crearElement('label','Data Factura: '));
    div.appendChild(crearElement('label', $('#data').val(factura.data)));
    div.appendChild(crearElement('label','Núm. Factura: '));
    div.appendChild(crearElement('label', facturaId));
    div.appendChild(crearElement('br'));
    div.appendChild(crearElement('br'));
    div.appendChild(crearElement('label','NIF: '));
    div.appendChild(crearElement('label', $('#nif').val(factura.nif)));
    div.appendChild(crearElement('label','Nom: '));
    div.appendChild(crearElement('label', $('#nom').val(factura.client)));
    div.appendChild(crearElement('br'));
    div.appendChild(crearElement('br'));
    div.appendChild(crearElement('tabel'))
    div.appendChild(crearElement('tr'));
    div.appendChild(crearElement('th', 'Codi'));
    div.appendChild(crearElement('th', 'Article'));
    div.appendChild(crearElement('th', 'Uni.'));
    div.appendChild(crearElement('th', 'Preu'));
    div.appendChild(crearElement('th', 'Subtotal'));
    
    window.print();
}
