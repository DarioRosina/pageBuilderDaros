// --- Funzione per generare HTML pulito ---
function generateCleanHtml() {
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
                // Rimuovi stili inline specifici del builder, ma potresti voler mantenere alcuni stili essenziali
                // Considera se rimuovere tutti gli stili o solo quelli aggiunti dal builder
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

                // --- Specifically handle link cleaning if needed ---
                // The general attribute removal above should handle links,
                // but you could add specific checks here if necessary.
                // For example, ensure 'href' is preserved.
                // The current logic preserves href as it's not explicitly removed.

                // Pulisci ricorsivamente i figli
                el.querySelectorAll('*').forEach(child => removeAttributes(child));
            };

            removeAttributes(clone);

             // Aggiungi un margine inferiore standard per spaziatura
             clone.classList.add('mb-3'); // Usa margine Bootstrap

             // Ottieni l'HTML esterno dell'elemento pulito
            finalHtml += clone.outerHTML + '\n\n'; // Aggiungi a capo per leggibilita'
        }
    });
    return finalHtml.trim(); // Ritorna solo il contenuto del body pulito
}


// Definisci l'handler per il click sul pulsante di copia
const handleCopyHtmlClick = () => {
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
    const bodyContent = generateCleanHtml(); // Chiama la funzione riutilizzabile

    if (!bodyContent) {
        exportedHtmlCodeTextarea.value = '<p class="text-center text-muted">Il canvas è vuoto.</p>'; // Messaggio se vuoto
        copyHtmlButton.disabled = true; // Disabilita copia se vuoto
        return;
    }

    // Formatta l'output per essere una pagina HTML completa
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
    grid-template-columns: repeat(${pageColumnCount}, 1fr);
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

    exportedHtmlCodeTextarea.value = fullPageHtml;
    copyHtmlButton.innerHTML = '<strong>Copia negli appunti</strong>'; // Resetta il testo del pulsante
    copyHtmlButton.disabled = false; // Abilita copia
};


// Genera l'HTML pulito quando il modal viene mostrato
const exportModalElement = document.getElementById('exportHtmlModal');
if (exportModalElement) {
    exportModalElement.removeEventListener('show.bs.modal', handleExportModalShow);
    exportModalElement.addEventListener('show.bs.modal', handleExportModalShow);
}
