import ("https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js");


document.getElementById("recuperar").addEventListener("click", function () {
    
});

document.getElementById("guardar").addEventListener("click", function () {
    
});




// filename: nom de l'arxiu que es descarregarà
// text: text que es guardarà en l'arxiu
function download(filename, json) {
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(json, null, 2);

    // Create a Blob object representing the file
    const file = new Blob([jsonString], { type: 'application/json' });

    // Create a "phantom" link (not actually added to the document)
    const a = document.createElement('a');

    // Create a URL representing the file to be downloaded
    a.href = URL.createObjectURL(file);
    // Specify the filename to be downloaded
    a.download = filename;
    // Simulate a click on the link
    a.click();
    // Revoke the URL object
    URL.revokeObjectURL(a.href);
}

document.getElementById("descarregar").addEventListener("click", function(){
    download("facturesSaPa.json", factures);
});

document.getElementById("tancar").addEventListener("click", function(){
    close();
});