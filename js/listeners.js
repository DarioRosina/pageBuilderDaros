/* WINDOW */

// Avviso l'utente prima che chiuda o ricarichi la pagina
window.addEventListener('beforeunload', function (e) {
    e.preventDefault(); // Necessario in alcuni browser
    e.returnValue = ''; // Stringa vuota per attivare il messaggio predefinito
});

/* DOCUMENT */

// Deseleziona l'elemento se si clicca fuori
document.addEventListener('click', (e) => {
    if (selectedElement && !selectedElement.contains(e.target) && !e.target.closest('.canvas-element')) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
    }
});
