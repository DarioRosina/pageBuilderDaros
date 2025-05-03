function checkCanvasEmpty() {
    if (buildCanvas.querySelectorAll('.canvas-element').length === 0) {
        if (!buildCanvas.contains(initialMessage)) {
            buildCanvas.appendChild(initialMessage);
        }
        initialMessage.style.display = 'block';
    } else {
        if (buildCanvas.contains(initialMessage)) {
            initialMessage.style.display = 'none';
        }
    }
}


function createPlaceholder() {
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.classList.add('drop-placeholder', 'rounded');
    }
    return placeholder;
}


// Funzione per determinare la posizione di drop basandosi SOLO sulla coordinata Y (Versione Raffinata)
function getDropPosition(clientY) {
    const canvasElements = [...buildCanvas.querySelectorAll('.canvas-element:not(.dragging)')]; // Ottieni tutti gli elementi tranne quello trascinato

    let targetElement = null; // L'elemento prima del quale inserire

    // Itera su tutti gli elementi nel canvas
    for (const element of canvasElements) {
        const box = element.getBoundingClientRect();

        // Se la coordinata Y del mouse e' sopra l'inizio di questo elemento,
        // allora questo e' il primo elemento che si trova sotto il mouse.
        // Dobbiamo inserire prima di questo.
        if (clientY < box.top + (box.height / 2)) { // Consideriamo la meta' superiore dell'elemento come "sopra"
            targetElement = element;
            break; // Trovato l'elemento target, usciamo dal ciclo
        }
    }

    // Se targetElement è ancora null dopo il ciclo, significa che il mouse
    // si trova sotto la meta' di tutti gli elementi esistenti,
    // quindi l'inserimento dovrebbe avvenire alla fine.
    if (targetElement) {
        return { element: targetElement, before: true }; // Inserisci prima dell'elemento trovato
    } else {
        return { element: null, before: false }; // Aggiungi alla fine
    }
}


