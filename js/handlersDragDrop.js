// --- Add Drag Handlers for Canvas Elements ---
function handleElementDragStart(event) {
    // --- Verifica che il drag inizi dall'handle ---
    if (!event.target.classList.contains('drag-handle-button')) {
        console.log('[handleElementDragStart] Drag prevented. Event target is not the drag handle button:', event.target);
        event.preventDefault(); // Impedisce l'inizio del trascinamento
        return;
    }

    const target = event.target.closest('.canvas-element');

    // --- Verifica se il drag e' gia' iniziato per questo elemento ---
    if (target && target.classList.contains('dragging')) {
        console.warn('[handleElementDragStart] Drag start ignored, element already dragging:', target);
        event.preventDefault(); // Impedisce un secondo avvio del drag
        return; // Esce per evitare logica duplicata
    }

    if (!target) {
        // Questo non dovrebbe accadere se l'handle e' dentro un .canvas-element, ma e' un controllo di sicurezza
        console.error('[handleElementDragStart] Drag prevented. Could not find parent .canvas-element for handle:', event.target);
        event.preventDefault();
        return;
    }

    console.log('[handleElementDragStart] Drag initiated from handle for element:', target);
    draggedElement = target; // Memorizza l'elemento .canvas-element che stiamo trascinando

    // Optional: Add a slight delay to allow the browser to render the drag image
    setTimeout(() => {
        if (draggedElement) { // Check if drag hasn't ended prematurely
            draggedElement.classList.add('dragging'); // Style the element being dragged (e.g., opacity)
        }
    }, 0);

    event.dataTransfer.effectAllowed = 'move';
    // You can optionally set data, though it might not be strictly needed if using the global variable
    try {
        event.dataTransfer.setData('text/plain', target.dataset.componentType || 'canvas-element'); // Indicate type or just that it's an element
    } catch (error) {
        console.error('[handleElementDragStart] Error setting dataTransfer:', error);
    }
}

// --- Event Listener Drag & Drop ---

// Definisci gli handler per i componenti della sidebar
const handleSidebarDragStart = (e) => {
    draggedComponentType = e.target.closest('.draggable-component').dataset.componentType;
    e.dataTransfer.setData('text/plain', draggedComponentType); // Necessario per Firefox
    e.dataTransfer.effectAllowed = 'copy';
    e.target.closest('.draggable-component').classList.add('dragging');
    if (buildCanvas.contains(initialMessage)) {
        initialMessage.style.display = 'none';
    }
};

const handleSidebarDragEnd = (e) => {
    // Rimuovi stile (se necessario, ma spesso non serve per la sidebar)
    // e.target.closest('.draggable-component').classList.remove('dragging');
    draggedComponentType = null; // Resetta il tipo
    if (placeholder && placeholder.parentNode) {
        placeholder.remove();
    }
    checkCanvasEmpty();
};

// Entra nell'area del canvas
// Definisci l'handler
const handleCanvasDragEnter = (e) => {
    e.preventDefault();
    buildCanvas.classList.add('drag-over');
};


// Si muove sopra l'area del canvas (Logica Semplificata)
// Definisci l'handler
const handleCanvasDragOver = (e) => {
    e.preventDefault(); // Necessario per permettere il drop

    // Imposta l'effetto visivo del cursore
    if (draggedElement) { // Se si sta riordinando un elemento esistente
        e.dataTransfer.dropEffect = 'move';
    } else { // Se si sta trascinando un nuovo componente
        e.dataTransfer.dropEffect = 'copy';
    }

    // Calcola la posizione di drop basandosi solo sulla Y
    const dropPos = getDropPosition(e.clientY);
    const targetNode = dropPos.element; // L'elemento prima del quale inserire (puo' essere null)

    // Assicurati che l'elemento placeholder esista
    createPlaceholder(); // Questa funzione crea il div se non esiste gia'

    // Inserisci o sposta il placeholder nella posizione calcolata
    if (targetNode) {
        // Se abbiamo trovato un elemento target, inserisci il placeholder prima di esso
        if (placeholder.nextElementSibling !== targetNode) { // Ottimizzazione minima: sposta solo se non e' gia' li'
            console.log('[Drag Over] Inserting placeholder before:', targetNode); // Log
            console.log(`draggedElement: ${draggedElement}`);
            buildCanvas.insertBefore(placeholder, targetNode);
        }
    } else {
        // Se targetNode e' null (siamo sotto tutti gli elementi o canvas vuoto),
        // aggiungi il placeholder alla fine.
        if (buildCanvas.lastElementChild !== placeholder) { // Ottimizzazione minima: sposta solo se non e' gia' li'
            console.log('[Drag Over] Appending placeholder.'); // Log
            buildCanvas.appendChild(placeholder);
        }
    }
};


// Lascia l'area del canvas
// Definisci l'handler
const handleCanvasDragLeave = (e) => {
    // Condizione piu' conservativa: rimuovi il placeholder solo se usciamo dal documento o da buildCanvas stesso
    // e non stiamo entrando in un figlio di buildCanvas
    if (e.relatedTarget === null || (e.relatedTarget !== buildCanvas && !buildCanvas.contains(e.relatedTarget))) {
        if (placeholder && placeholder.parentNode) {
            console.log('[Drag Leave] Removing placeholder because mouse left canvas area.');
            placeholder.remove();
        }
        buildCanvas.classList.remove('drag-over');
    }
};

// Rilascio sul canvas
// Definisci l'handler
const handleCanvasDrop = (e) => {
    e.preventDefault();
    buildCanvas.classList.remove('drag-over'); // Rimuovi classe visuale
    console.log('[Drop Event] Triggered');
    console.log(`draggedElement: ${draggedElement}`);

    // Rimuovi il messaggio iniziale se presente
    if (buildCanvas.contains(initialMessage)) {
        initialMessage.remove();
    }

    // --- Handle drop for both new components and existing elements ---
    if (draggedElement) { // Caso 1: Riordinamento di un elemento esistente
        console.log('[Drop Event] Reordering existing element:', draggedElement);
        console.log('[Drop Event] Drop clientY:', e.clientY);

        // Calcola la posizione di drop *al momento del drop*
        const finalDropPos = getDropPosition(e.clientY);
        console.log('[Drop Event] Final drop position calculated:', finalDropPos);

        // Verifica lo stato del placeholder PRIMA di qualsiasi operazione
        const placeholderExists = !!(placeholder && placeholder.parentNode);
        console.log('[Drop Event] Placeholder exists in DOM before replacement attempt?', placeholderExists);

        if (placeholderExists) {
            console.log('[Drop Event] Replacing placeholder with dragged element.');
            buildCanvas.replaceChild(draggedElement, placeholder); // Sostituzione placeholder
            draggedElement.classList.remove('dragging');
            handleElementSelection({ currentTarget: draggedElement });
        } else {
            // Se il placeholder non c'e', prova a inserire nella posizione calcolata se possibile
            console.warn('[Drop Event] Placeholder not found in DOM during drop!');
            if (finalDropPos && finalDropPos.element) {
                console.warn('[Drop Event] Attempting insertion before calculated target element as fallback.');
                buildCanvas.insertBefore(draggedElement, finalDropPos.element);
                draggedElement.classList.remove('dragging');
                handleElementSelection({ currentTarget: draggedElement });
            } else {
                // Fallback finale: aggiungi alla fine
                console.warn('[Drop Event] Placeholder and target element not found. Appending element as last resort.');
                buildCanvas.appendChild(draggedElement);
                draggedElement.classList.remove('dragging');
            }
        }
        // draggedElement viene resettato piu' avanti

    } else { // Caso 2: Aggiunta di un nuovo componente dalla barra laterale
        console.log('[Drop Event] Adding new component from sidebar.');
        const type = e.dataTransfer.getData('text/plain') || draggedComponentType;
        console.log('[Drop Event] Component type:', type);
        if (!type) {
            console.error('[Drop Event] No component type found in dataTransfer!');
            if (placeholder && placeholder.parentNode) placeholder.remove();
            return;
        }

        const newElement = createComponentElement(type);
        if (!newElement) {
            console.error('[Drop Event] Failed to create element for type:', type);
            if (placeholder && placeholder.parentNode) placeholder.remove();
            return;
        }

        const placeholderExists = !!(placeholder && placeholder.parentNode);
        console.log('[Drop Event] Placeholder exists in DOM for new component?', placeholderExists);

        if (placeholderExists) {
            console.log('[Drop Event] Replacing placeholder with new element.');
            buildCanvas.replaceChild(newElement, placeholder);
        } else {
             // Se il placeholder non c'e', prova a inserire nella posizione calcolata se possibile
            const finalDropPos = getDropPosition(e.clientY); // Ricalcola per sicurezza
            console.warn('[Drop Event] Placeholder not found for new component.');
            if (finalDropPos && finalDropPos.element) {
                console.warn('[Drop Event] Attempting insertion before calculated target element as fallback.');
                buildCanvas.insertBefore(newElement, finalDropPos.element);
            } else {
                console.warn('[Drop Event] Placeholder and target element not found. Appending new element.');
                buildCanvas.appendChild(newElement);
            }
        }

        addControlListeners(newElement); // Assicurati che addControlListeners applichi lo stesso pattern remove/add

        // Rimuovi prima di aggiungere (usa la funzione nominata 'handleElementSelection')
        newElement.removeEventListener('click', handleElementSelection);
        newElement.addEventListener('click', handleElementSelection);

        handleElementSelection({ currentTarget: newElement }); // Seleziona il nuovo elemento
        draggedComponentType = null;
    }

    // Rimuovi il placeholder se ANCORA presente (non dovrebbe succedere se replaceChild ha funzionato)
    if (placeholder && placeholder.parentNode) {
        console.warn('[Drop Event] Placeholder still in DOM after drop logic. Removing it.');
        placeholder.remove();
    }

    // Reset global dragged element reference
    if (draggedElement) {
        draggedElement.classList.remove('dragging'); // Assicurati che la classe sia rimossa
        draggedElement = null;
        console.log('[Drop Event] Reset draggedElement to null.');
    }

    checkCanvasEmpty();
    console.log('[Drop Event] Completed.');
};


function handleElementDragEnd(e) {
    console.log('[Drag End] Triggered for element:', e.target.closest('.canvas-element')); // LOG: Drag End avviato

    // Rimuovi la classe 'dragging' dall'elemento trascinato
    // Lo facciamo anche nel drop, ma e' bene averlo anche qui come fallback
    const element = e.target.closest('.canvas-element');
    if (element) {
        element.classList.remove('dragging');
    }

    // Rimuovi il placeholder se esiste ancora (potrebbe rimanere se il drop avviene fuori dal canvas)
    if (placeholder && placeholder.parentNode) {
        console.log('[Drag End] Removing placeholder.'); // LOG: Rimozione placeholder
        placeholder.remove();
    }
    buildCanvas.classList.remove('drag-over'); // Rimuovi lo stato visuale dal canvas
    checkCanvasEmpty(); // Controlla se il canvas e' vuoto
}

/* LISTENERS SIDEBAR */

draggableComponents.forEach(component => {
    component.removeEventListener('dragstart', handleSidebarDragStart);
    component.addEventListener('dragstart', handleSidebarDragStart);

    component.removeEventListener('dragend', handleSidebarDragEnd);
    component.addEventListener('dragend', handleSidebarDragEnd);
});


/* LISTENERS CANVAS */

buildCanvas.removeEventListener('dragover', handleCanvasDragOver);
buildCanvas.addEventListener('dragover', handleCanvasDragOver);

buildCanvas.removeEventListener('dragleave', handleCanvasDragLeave);
buildCanvas.addEventListener('dragleave', handleCanvasDragLeave);

buildCanvas.removeEventListener('drop', handleCanvasDrop);
buildCanvas.addEventListener('drop', handleCanvasDrop);
