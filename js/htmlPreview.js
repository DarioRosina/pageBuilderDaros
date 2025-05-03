// --- Preview Logic ---
// Definisci l'handler per il click sul pulsante di anteprima
const handlePreviewClick = () => {
    const bodyContent = generateCleanHtml();
    if (!bodyContent) {
        alert("Il canvas è vuoto. Aggiungi elementi prima di visualizzare l'anteprima.");
        return;
    }

    // Ottieni riferimenti alla modale e all'iframe
    const previewModalElement = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');

    if (!previewModalElement || !previewFrame) {
        console.error("Elemento modale #previewModal o iframe #previewFrame non trovato nel DOM.");
        alert("Errore: Impossibile trovare gli elementi necessari per l'anteprima modale.");
        return;
    }

    const previewModal = bootstrap.Modal.getOrCreateInstance(previewModalElement);

    // Create the full HTML structure for the preview
    const fullPageHtml = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anteprima Pagina</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
/* Stili specifici per l'anteprima dentro l'iframe se necessario */
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

    // Imposta il contenuto dell'iframe usando srcdoc
    // srcdoc e' preferibile a document.write per gli iframe
    previewFrame.srcdoc = fullPageHtml;

    // Mostra la modale
    previewModal.show();
};


previewButton.removeEventListener('click', handlePreviewClick); // Rimuovi se gia' presente
previewButton.addEventListener('click', handlePreviewClick);
