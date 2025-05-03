// --- Funzione per PARSARE HTML e RICOSTRUIRE il Canvas ---
function parseAndLoadHtml(htmlContent) {
    buildCanvas.innerHTML = ''; // Clear current canvas content
    selectedElement = null; // Reset selection

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent; // Parse the loaded HTML

    // --- Estrai il numero di colonne dallo stile ---
    try {
        const styleTag = tempDiv.querySelector('style');
        if (styleTag && styleTag.textContent) {
            const styleContent = styleTag.textContent;
            // Regex per trovare 'grid-template-columns: repeat(NUMERO, 1fr);'
            const columnRegex = /grid-template-columns:\s*repeat\((\d+),\s*1fr\);/i;
            const match = styleContent.match(columnRegex);

            if (match && match[1]) {
                const extractedColumns = parseInt(match[1], 10);
                if (!isNaN(extractedColumns) && extractedColumns > 0) {
                    // Assicurati che pageColumnCount sia accessibile globalmente
                    if (typeof pageColumnCount !== 'undefined') {
                        pageColumnCount = extractedColumns;
                        console.log(`Numero colonne importato dallo stile: ${pageColumnCount}`);
                        // Aggiorna l'input nella modale impostazioni se esiste
                        if (columnCountInput) {
                            columnCountInput.value = pageColumnCount;
                        }
                    } else {
                        console.warn("La variabile globale 'pageColumnCount' non è definita o accessibile.");
                    }
                } else {
                    console.log("Numero di colonne non valido trovato nello stile:", match[1]);
                }
            } else {
                console.log("Regola 'grid-template-columns: repeat(N, 1fr);' non trovata nello stile.");
            }
        } else {
            console.log("Nessun tag <style> trovato nell'<head> o è vuoto.");
        }
    } catch (error) {
        console.error("Errore durante l'estrazione del numero di colonne dallo stile:", error);
    }

    // --- Applica lo stile al canvas DOPO aver determinato pageColumnCount ---
    if (buildCanvas) {
        buildCanvas.style.display = 'grid';
        // Usa il valore finale di pageColumnCount (letto dal file o quello globale corrente)
        buildCanvas.style.gridTemplateColumns = `repeat(${pageColumnCount || 1}, 1fr)`; // Default a 1
        buildCanvas.style.gap = '10px';
        console.log(`Stile griglia applicato a buildCanvas dopo il parsing: ${buildCanvas.style.gridTemplateColumns}`);
    } else {
        console.error("Elemento buildCanvas non trovato per applicare lo stile dopo il parsing.");
    }

    // --- Find the container div element ---
    const containerDiv = tempDiv.querySelector('div.container');
    // Process children of the container, or the direct children of tempDiv if container isn't found
    const elementsToProcess = containerDiv ? containerDiv.children : tempDiv.children;
    // All'interno del ciclo forEach in parseAndLoadHtml
    Array.from(elementsToProcess).forEach(loadedElement => {

        let componentType = null;
        let elementToWrap = loadedElement; // The actual element (h1, p, img, etc.)

        // Determine component type based on the loaded element
        // This needs to be robust and match how elements are generated/saved
        // --- Modifica per controllare H1-H6 ---
        if (/^H[1-6]$/.test(loadedElement.tagName)) {
            componentType = 'heading';
        } else if (loadedElement.tagName === 'P') {
            componentType = 'paragraph';
        } else if (loadedElement.tagName === 'INPUT') {
            componentType = 'input';
        } else if (loadedElement.tagName === 'IMG') {
            componentType = 'image';
        } else if (loadedElement.tagName === 'BUTTON') {
            componentType = 'button';
        } else if (loadedElement.tagName === 'DIV' && loadedElement.classList.contains('card')) {
            componentType = 'card';
        // --- Add check for link ---
        } else if (loadedElement.tagName === 'A') {
            componentType = 'link';
        } else if (loadedElement.tagName === 'HR') {
            componentType = 'horizontal-rule';
        }
        // Add more checks if you have other component types

        if (componentType) {
            // Create the wrapper and controls for this element
            const elementWrapper = createComponentElement(componentType, elementToWrap);
            if (!elementWrapper) {
                console.error('[Drop Event] Failed to create element for type:', type);
                if (placeholder && placeholder.parentNode) placeholder.remove();
                return;
            }else{
                buildCanvas.appendChild(elementWrapper);
                addControlListeners(elementWrapper)
            }    

        } else {
            // Check if it's just a text node (like whitespace between elements) and ignore it silently
            if (loadedElement.nodeType !== Node.TEXT_NODE) {
                console.warn("Elemento caricato non riconosciuto:", loadedElement);
            }
            // Aggiungo facoltativamente gli elementi sconosciuti direttamente o li ignoro
            // buildCanvas.appendChild(loadedElement);
        }
    });

    checkCanvasEmpty(); // Aggiorno la visibilita' del messaggio iniziale
}
