// Definisci l'handler per il click sul pulsante di conferma
const handleImportConfirmClick = () => {
    const htmlToImport = importHtmlCode.value;
    importFeedback.innerHTML = ''; // Clear previous feedback

    if (!htmlToImport.trim()) {
        importFeedback.innerHTML = '<div class="alert alert-warning p-2">Inserisci del codice HTML da importare.</div>';
        return;
    }

    try {
        // Use the existing function to parse and load
        parseAndLoadHtml(htmlToImport);

        importFeedback.innerHTML = '<div class="alert alert-success p-2">Contenuto HTML importato con successo.</div>';

        // Optionally close the modal after success
        setTimeout(() => {
            const modalInstance = bootstrap.Modal.getInstance(importHtmlModalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
            importFeedback.innerHTML = ''; // Clear feedback after closing
            importHtmlCode.value = ''; // Clear textarea
        }, 50); // Reduced delay for faster feedback

    } catch (error) {
        console.error("Errore durante l'importazione HTML:", error);
        importFeedback.innerHTML = `<div class="alert alert-danger p-2">Errore durante l'importazione: ${error.message}</div>`;
    }
};

// --- Import HTML Logic ---
// Rimuovi prima di aggiungere
importConfirmButton.removeEventListener('click', handleImportConfirmClick);
importConfirmButton.addEventListener('click', handleImportConfirmClick);


// Definisci l'handler per l'evento 'hidden.bs.modal'
const handleImportModalHidden = () => {
    importFeedback.innerHTML = '';
    importHtmlCode.value = '';
};

importHtmlModalElement.removeEventListener('hidden.bs.modal', handleImportModalHidden);
importHtmlModalElement.addEventListener('hidden.bs.modal', handleImportModalHidden);

