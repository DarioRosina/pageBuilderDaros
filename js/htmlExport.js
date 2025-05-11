// --- Funzione per generare HTML pulito ---
function generateCleanHtml() {
    const indentContainer = '        '; // 8 spazi per l'indentazione
    let finalHtml = '';
    const canvasElements = buildCanvas.querySelectorAll('.canvas-element');

    if (canvasElements.length === 0) {
        return ''; // Ritorna stringa vuota se il canvas e' vuoto
    }

    canvasElements.forEach(wrapper => {
        // Clona l'elemento interno (h1, p, img, button, card div) per non modificare l'originale
        const elementToExport = wrapper.querySelector(':scope > *:not(.element-controls):not(.hover-info)'); // Seleziona il figlio diretto che non sia il controllo di eliminazione
        if (elementToExport) {
            const clone = elementToExport.cloneNode(true);

            // Rimuovi attributi specifici del builder dall'elemento clonato e dai suoi figli
            const removeAttributes = (el) => {
                el.removeAttribute('contenteditable');
                // Rimuovi stili inline specifici del builder
                if (el.tagName !== 'HR') {
                    el.removeAttribute('style'); // Rimuovi stili inline (es. cursor: pointer)
                }
                el.removeAttribute('title'); // Rimuovi tooltip specifici del builder
                el.removeAttribute('tabindex');
                el.removeAttribute('draggable');
                el.classList.remove('selected', 'canvas-element', 'card-image-editable', 'card-button-editable'); // Rimuovi classi del builder

                // Rimuovi listener specifici (non direttamente possibile, ma rimuovendo attributi/classi si inattivano)
                if (el.classList.contains('card-image-editable')) {
                    el.classList.remove('card-image-editable');
                }
                if (el.classList.contains('card-button-editable')) {
                    el.classList.remove('card-button-editable');
                }
                // Rimuovi placeholder images se necessario
                if (el.tagName === 'IMG' && el.getAttribute('src')?.startsWith('https://placehold.co')) {
                    // Potresti voler rimuovere l'elemento o lasciare il placeholder
                    // console.log("Placeholder image found:", el.src);
                }
                 // Gestisci link placeholder se necessario
                if (el.tagName === 'A' && el.getAttribute('href') === '#') {
                    // console.log("Placeholder link found:", el);
                }

                // Pulisci ricorsivamente i figli
                el.querySelectorAll('*').forEach(child => removeAttributes(child));
            };

            removeAttributes(clone);

             // Aggiungi un margine inferiore standard per spaziatura
             clone.classList.add('mb-3'); // Usa margine Bootstrap
            
            // Indenta ogni linea dell'HTML pulito creato dall'utente
            const elementHtml = clone.outerHTML;
            const indentedElementHtml = indentContainer + elementHtml.replace(/\n/g, '\n' + indentContainer);
            finalHtml += indentedElementHtml + '\n\n';
        }
    });
    return finalHtml.trim(); // Ritorna solo il contenuto del body pulito
}


// Definisci l'handler per il click sul pulsante di copia
const handleCopyHtmlClick = () => {
    if (!exportedHtmlCodeTextarea || !exportedHtmlCodeTextarea.value) {
        console.warn('Nessun contenuto da copiare o textarea non trovata.');
        return;
    }
    exportedHtmlCodeTextarea.select();
    try {
        document.execCommand('copy');
        // Fornisci feedback all'utente
        copyHtmlButton.textContent = 'Copiato!';
        setTimeout(() => { copyHtmlButton.innerHTML = '<strong>Copia negli appunti</strong>'; }, 2000);
    } catch (err) {
        console.error('Errore nella copia negli appunti:', err);
        alert('Impossibile copiare automaticamente. Seleziona e copia manualmente.');
    }
    window.getSelection().removeAllRanges(); // Deseleziona il testo
};


// Listener per il pulsante di copia
// Rimuovi prima di aggiungere
copyHtmlButton.removeEventListener('click', handleCopyHtmlClick);
copyHtmlButton.addEventListener('click', handleCopyHtmlClick);

// Definisci l'handler per l'evento 'show.bs.modal'
const handleExportModalShow = () => {
    const bodyContent = generateCleanHtml();
    

    if (!codeBlock || !exportedHtmlCodeTextarea || !copyHtmlButton) {
        console.error('Elementi del modal di  esportazione non trovati.');
        return;
    }

    if (!bodyContent) {
        codeBlock.textContent = 'Il canvas è vuoto.';
        codeBlock.className = 'language-text'; // Indica a Prism di trattarlo come testo semplice
        exportedHtmlCodeTextarea.value = '';
        copyHtmlButton.disabled = true;
    } else {
        const fullPageHtml = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagina Generata</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { padding: 15px; background-color: #fff; }
        .container{ 
            display: grid;
            grid-template-columns: repeat(${typeof pageColumnCount !== 'undefined' ? pageColumnCount : 1}, 1fr);
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${bodyContent}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"><\/script> <!-- Escape closing script tag -->
</body>
</html>`;

        codeBlock.textContent = fullPageHtml;
        codeBlock.className = 'language-html'; // Imposta la classe per Prism
        exportedHtmlCodeTextarea.value = fullPageHtml; // Per la copia
        copyHtmlButton.disabled = false;
    }

    // Evidenzia il codice con PrismJS
    if (typeof Prism !== 'undefined' && Prism.highlightElement) {
        Prism.highlightElement(codeBlock);
    }
    
    copyHtmlButton.innerHTML = '<strong>Copia negli appunti</strong>'; // Resetta il testo del pulsante
    copyHtmlButton.disabled = false; // Abilita copia
};


// Genera l'HTML pulito quando il modal viene mostrato
const exportModalElement = document.getElementById('exportHtmlModal');
if (exportModalElement) {
    exportModalElement.removeEventListener('show.bs.modal', handleExportModalShow);
    exportModalElement.addEventListener('show.bs.modal', handleExportModalShow);
}
