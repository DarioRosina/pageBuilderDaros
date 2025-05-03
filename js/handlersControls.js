// Funzione globale per gestire l'eliminazione di un elemento
function deleteElement(event) {
    event.stopPropagation(); // Impedisce la propagazione ad altri listener (es. selezione)
    const button = event.currentTarget; // Il bottone che ha scatenato l'evento
    const elementWrapper = button.closest('.canvas-element'); // Trova il wrapper genitore

    if (!elementWrapper) return; // Se non trova il wrapper, esce

    // Ottieni riferimenti alla modale e al pulsante di conferma
    const deleteModalElement = document.getElementById('deleteConfirmModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    if (!deleteModalElement || !confirmDeleteButton) {
        console.error("Elemento modale #deleteConfirmModal o pulsante #confirmDeleteButton non trovato.");
        // Fallback a confirm() se la modale non e' trovata? O mostra un errore.
        if (confirm('Errore: Modale non trovata. Vuoi eliminare comunque?')) {
            elementWrapper.remove();
            if (selectedElement === elementWrapper) selectedElement = null;
            checkCanvasEmpty();
        }
        return;
    }

    const deleteModal = bootstrap.Modal.getOrCreateInstance(deleteModalElement);

    // --- Gestore per il click sul pulsante "Elimina" della modale ---
    const handleConfirmDelete = () => {
        // Rimuovi il listener per evitare esecuzioni multiple
        confirmDeleteButton.removeEventListener('click', handleConfirmDelete);

        // Esegui l'eliminazione
        elementWrapper.remove();
        // Se l'elemento eliminato era quello selezionato, deselezionalo
        if (selectedElement === elementWrapper) {
            selectedElement = null;
        }
        checkCanvasEmpty(); // Aggiorna lo stato del canvas

        deleteModal.hide(); // Chiudi la modale dopo l'eliminazione
    };

    confirmDeleteButton.replaceWith(confirmDeleteButton.cloneNode(true)); // Clona per rimuovere vecchi listener
    const newConfirmButton = document.getElementById('confirmDeleteButton'); // Ottieni il nuovo bottone
    newConfirmButton.addEventListener('click', handleConfirmDelete, { once: true }); // Usa { once: true } per semplicita'

    // --- Imposta il focus sul pulsante Elimina quando la modale e' mostrata ---
    deleteModalElement.removeEventListener('shown.bs.modal', setVisibleFocus);
    deleteModalElement.addEventListener('shown.bs.modal', setVisibleFocus, { once: true });
    // --- Rimuovi la classe quando la modale e' nascosta ---

    // Rimuovi vecchi listener prima di aggiungere
    deleteModalElement.removeEventListener('hidden.bs.modal', removeVisibleFocus);
    deleteModalElement.addEventListener('hidden.bs.modal', removeVisibleFocus, { once: true });

    // Mostra la modale di conferma
    deleteModal.show();
}


// Funzione per duplicare un elemento selezionato
function duplicateElement(event) {
    event.stopPropagation(); // Impedisce la selezione dell'elemento padre
    const elementWrapper = event.target.closest('.canvas-element');
    if (!elementWrapper) return;

    const clone = elementWrapper.cloneNode(true); // Clona l'intero wrapper
    clone.draggable = false; // <<<< ASSICURA CHE ANCHE IL CLONE NON SIA TRASCINABILE DAL WRAPPER
    clone.classList.remove('selected'); // Rimuovi la classe 'selected' dal clone se presente

    // --- Selettore Modificato ---
    // Trova l'elemento di contenuto principale, escludendo i controlli.
    // Questo selettore cerca figli diretti del clone che siano i tipi di contenuto noti.
    // Assicurati che i tuoi elementi di contenuto (h1, p, img, ecc.) siano figli diretti del wrapper.
    const contentElement = clone.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > img, :scope > button:not(.control-button), :scope > a, :scope > .card, :scope > hr');
    // ':scope >' cerca solo figli diretti.
    // 'button:not(.control-button)' esclude i pulsanti di controllo se hanno quella classe.
    // Se la struttura e' diversa (es. il contenuto e' dentro un altro div), adatta il selettore.

    if (!contentElement) {
        console.error("Elemento di contenuto non trovato nel clone!", clone);
        // Potrebbe essere necessario un selettore diverso se la struttura HTML e' cambiata.
    } else {
        console.log("Elemento di contenuto trovato nel clone:", contentElement);
        // --- Aggiunta specifica per Horizontal Rule (HR) ---
        if (contentElement.tagName === 'HR') {
            console.log('Riattacco dblclick listener al clone hr:', contentElement);
            with(contentElement){
                // Rimuovi prima di aggiungere
                removeEventListener('dblclick', promptChangeHrHeight);
                addEventListener('dblclick', promptChangeHrHeight);
                title = 'Doppio click per modificare altezza';
            }
        }
        // --- Aggiunta specifica per Heading ---
        if (/^H[1-6]$/.test(contentElement.tagName)) {
            console.log('Riattacco dblclick listener al clone heading:', contentElement);
            with(contentElement){
                // Rimuovi prima di aggiungere
                removeEventListener('dblclick', promptChangeHeadingLevel);
                addEventListener('dblclick', promptChangeHeadingLevel);
                title = 'Doppio click per cambiare livello (H1-H6)';
            }
        }
        // --- Fine aggiunta per Heading ---
        
        // --- Aggiunta specifica per Input ---
        if (contentElement.tagName === 'INPUT') {
            console.log('Riattacco dblclick listener al clone input:', contentElement);
            with(contentElement){
                // Rimuovi prima di aggiungere
                removeEventListener('dblclick', promptChangeInputAttributes);
                addEventListener('dblclick', promptChangeInputAttributes);
                title = 'Doppio click per cambiare attributi';
            }
        }
        // --- Fine aggiunta per Heading ---

        // --- Aggiunta specifica per Input ---
        if (contentElement.tagName === 'IMG') {
            console.log('Riattacco dblclick listener al clone immagine:', contentElement);
             // Rimuovi prima di aggiungere
            with(contentElement){
                removeEventListener('dblclick', promptChangeImageAttributes);
                addEventListener('dblclick', promptChangeImageAttributes);
                title = 'Doppio click per cambiare attributi (src, width, height)';
                style.cursor = 'pointer';
            }
        }
        // --- Aggiunta specifica per Immagine Card ---
        if (contentElement.classList.contains('card')) {
            const cardImageClone = contentElement.querySelector('.card-image-editable');
            if (cardImageClone) {
                console.log('Riattacco dblclick listener al clone immagine card:', cardImageClone);
                with(cardImageClone){
                    // Rimuovi prima di aggiungere
                    removeEventListener('dblclick', promptChangeImageAttributes);
                    addEventListener('dblclick', promptChangeImageAttributes);
                    title = 'Doppio click per cambiare attributi (src, width, height)';
                    style.cursor = 'pointer';
                }
            }
        }
        // --- Aggiunta specifica per Link ---
        if (contentElement.tagName === 'A') {
            console.log('Riattacco dblclick listener al clone link:', contentElement);
            with(contentElement){
                // Rimuovi prima di aggiungere (dblclick)
                removeEventListener('dblclick', promptChangeLinkHref);
                addEventListener('dblclick', promptChangeLinkHref);
                title = 'Doppio click per cambiare URL';
                removeEventListener('click', preventLinkClickInEdit);
                addEventListener('click', preventLinkClickInEdit);
            }
        }
    }

    // Inserisci il clone dopo l'originale
    elementWrapper.parentNode.insertBefore(clone, elementWrapper.nextSibling);

    // Riattiva i listener per i controlli sul clone (delete, duplicate, move, drag)
    // Assicurati che addControlListeners gestisca correttamente il drag handle del clone
    addControlListeners(clone);
    
    // Seleziona il nuovo elemento clonato
    handleElementSelection({ currentTarget: clone });

    console.log('Elemento duplicato:', clone);
    checkCanvasEmpty(); // Aggiorna lo stato del canvas
}


function moveElementUp(event) {
    event.stopPropagation(); // Prevent triggering parent selection
    const elementWrapper = event.target.closest('.canvas-element');
    if (!elementWrapper) return;

    const prevElement = elementWrapper.previousElementSibling;
    if (prevElement && prevElement.classList.contains('canvas-element')) {
        buildCanvas.insertBefore(elementWrapper, prevElement);

        // --- Re-apply selection logic ---
        handleElementSelection({ target: elementWrapper });
        elementWrapper.focus();
        
        // Optional: Scroll into view if needed
        elementWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        elementWrapper.classList.add('element-moved');
        setTimeout(() => elementWrapper.classList.remove('element-moved'), 300);
    }
}


function moveElementDown(event) {
    event.stopPropagation(); // Prevent triggering parent selection
    const elementWrapper = event.target.closest('.canvas-element');
    if (!elementWrapper) return;

    const nextElement = elementWrapper.nextElementSibling;
    if (nextElement) {
        // Move the element in the DOM
        buildCanvas.insertBefore(nextElement, elementWrapper);

        // --- Re-apply selection logic ---
        // Ensure the moved element retains focus and selection state visually
        // This assumes handleElementSelection correctly sets the .selected class
        // and removes it from others.
        handleElementSelection({ target: elementWrapper }); // Simulate a selection event on the moved element
        elementWrapper.focus(); // Explicitly set focus

        // Optional: Scroll into view if needed
        elementWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        elementWrapper.classList.add('element-moved');
        setTimeout(() => elementWrapper.classList.remove('element-moved'), 300);
    }
}


// Funzione helper per aggiungere listener ai pulsanti di controllo
function addControlListeners(elementWrapper) {
    const deleteBtn = elementWrapper.querySelector('.delete-button');
    if (deleteBtn) {
        // Rimuovi eventuali listener precedenti prima di aggiungere quello nuovo
        // Nota: Se prima usavi una funzione anonima, removeEventListener non funzionava correttamente.
        // Ora usiamo la funzione nominata globale.
        deleteBtn.removeEventListener('click', deleteElement);
        deleteBtn.addEventListener('click', deleteElement); // Usa la funzione globale
    }

    const duplicateBtn = elementWrapper.querySelector('.duplicate-button');
    if (duplicateBtn) {
        // Rimuovi prima di aggiungere (usa la funzione nominata 'duplicateElement')
        duplicateBtn.removeEventListener('click', duplicateElement);
        duplicateBtn.addEventListener('click', duplicateElement);
    }

    const moveUpBtn = elementWrapper.querySelector('.move-up-button');
    if (moveUpBtn) {
         // Rimuovi prima di aggiungere (usa la funzione nominata 'moveElementUp')
        moveUpBtn.removeEventListener('click', moveElementUp);
        moveUpBtn.addEventListener('click', moveElementUp);
    }

    const moveDownBtn = elementWrapper.querySelector('.move-down-button');
    if (moveDownBtn) {
         // Rimuovi prima di aggiungere (usa la funzione nominata 'moveElementDown')
        moveDownBtn.removeEventListener('click', moveElementDown);
        moveDownBtn.addEventListener('click', moveElementDown);
    }

    // --- AGGIUNTA: Gestione del pulsante Modifica ---
    const editBtn = elementWrapper.querySelector('.edit-button');
    if (editBtn) {
        // Clona il nodo per rimuovere vecchi listener
        const clonedEditBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(clonedEditBtn, editBtn);
        // Aggiungi il listener alla funzione globale handleEditButtonClick
        clonedEditBtn.addEventListener('click', handleEditButtonClick);
    }

    // Listener per il drag handle
    const dragHandle = elementWrapper.querySelector('.drag-handle-button');
    if (dragHandle) {
        // Assicurati che il drag handle sia effettivamente trascinabile
        dragHandle.draggable = true; // Potrebbe essere ridondante se gia' impostato in HTML, ma sicuro

        // Rimuovi eventuali listener vecchi prima di aggiungerne nuovi
        dragHandle.removeEventListener('dragstart', handleElementDragStart);
        dragHandle.addEventListener('dragstart', handleElementDragStart);
        dragHandle.removeEventListener('dragend', handleElementDragEnd);
        dragHandle.addEventListener('dragend', handleElementDragEnd);
    }
}


// --- Funzioni per gestire il focus sulla modale di conferma ---
const setVisibleFocus = () => {
    const confirmButton = document.getElementById('confirmDeleteButton');
    if (confirmButton) {
        confirmButton.focus();
        // Aggiungi una classe per indicare visivamente il focus (opzionale)
        confirmButton.classList.add('force-focus-visible');
        console.log('Focus set on confirmDeleteButton');
    } else {
        console.error('confirmDeleteButton not found in setVisibleFocus');
    }
};


const removeVisibleFocus = () => {
    const confirmButton = document.getElementById('confirmDeleteButton');
    if (confirmButton) {
        // Rimuovi la classe aggiunta (opzionale)
        confirmButton.classList.remove('force-focus-visible');
        console.log('Focus class removed from confirmDeleteButton');
    }
};