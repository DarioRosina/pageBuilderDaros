// Crea l'elemento HTML corrispondente al tipo di componente
// elementToWrap: parametro opzionale specificato se il componente e' stato editato e deve essere wrappato
function createComponentElement(type, elementToWrap = null) {
    const elementWrapper = document.createElement('div');
    with(elementWrapper) {
        classList.add('canvas-element', 'mb-3'); // Aggiungi classi per stile
        dataset.componentType = type; // Salva il tipo per riferimento futuro
        setAttribute('tabindex', '0'); // Rende l'elemento focusabile per la selezione
        setAttribute('draggable', 'false');
        style.position = 'relative'; // Necessario per posizionare l'info box
    }

    // Crea l'info box per l'hover 
    const hoverInfoDiv = document.createElement('div');
    hoverInfoDiv.classList.add('hover-info');

    // --- Update controls container ---
    const controls = document.createElement('div');
    controls.classList.add('element-controls');

    // --- Add Drag Handle Button ---
    const dragHandleButton = document.createElement('button');
    with(dragHandleButton) {
        classList.add('control-button', 'drag-handle-button');
        innerHTML = '<i class="bi bi-grip-vertical"></i>'; // Grip icon
        title = 'Trascina per riordinare';
        type = 'button';
        setAttribute('draggable', 'true'); // Make the handle draggable
    }
    controls.appendChild(dragHandleButton);

    // Move Up Button
    const moveUpButton = document.createElement('button');
    with(moveUpButton) {
        classList.add('control-button', 'move-up-button');
        innerHTML = '<i class="bi bi-arrow-up-short"></i>'; // Bootstrap Icon
        title = 'Sposta Su';
    }
    controls.appendChild(moveUpButton);

    // Move Down Button
    const moveDownButton = document.createElement('button');
    with(moveDownButton) {
        classList.add('control-button', 'move-down-button');
        innerHTML = '<i class="bi bi-arrow-down-short"></i>'; // Bootstrap Icon
        title = 'Sposta Giù';
    }
    controls.appendChild(moveDownButton);

    // Duplicate Button
    const duplicateButton = document.createElement('button');
    with(duplicateButton) {
        classList.add('control-button', 'duplicate-button');
        innerHTML = '<i class="bi bi-copy"></i>';
        title = 'Duplica';
    }
    controls.appendChild(duplicateButton);

     // Aggiunge il pulsante di eliminazione
    const deleteButton = document.createElement('button');
    with(deleteButton) {
        classList.add('control-button', 'delete-button');
        innerHTML = '<i class="bi bi-trash"></i>'; // Carattere 'x' per eliminare
        title = 'Elimina';
        type = 'button';
    }
    controls.appendChild(deleteButton);
    elementWrapper.appendChild(controls);

    let element; // Dichiarato qui
    let tagNameDisplay = ''; // Per mostrare il nome del tag
    let hasDoubleClickAction = false; // Flag per sapere se aggiungere il bottone modifica

    // --- Aggiornata Logica per usare elementToWrap o creare nuovo elemento ---
    switch (type) {
        case 'heading':
            // Se elementToWrap non e' fornito, crea un nuovo H1 di default
            element = elementToWrap || document.createElement('h1');
            tagNameDisplay = element.tagName.toLowerCase();
            if (!elementToWrap) { // Applica stili/contenuto di default solo se l'elemento viene creato nuovo
                element.textContent = 'Titolo Modificabile';
            }
            // Applica attributi e listener comuni
            with(element) {
                setAttribute('contenteditable', 'true');
                title = 'Doppio click per cambiare livello (H1-H6)';
                removeEventListener('dblclick', promptChangeHeadingLevel);
                addEventListener('dblclick', promptChangeHeadingLevel);
                setAttribute('draggable', 'false');
            }
            hasDoubleClickAction = true;
            break;
        case 'paragraph':
            element = elementToWrap || document.createElement('p');
            tagNameDisplay = 'p';
            if (!elementToWrap) {
                element.textContent = 'Questo è un paragrafo modificabile. Clicca per editarlo.';
            }
            with(element) {
                setAttribute('contenteditable', 'true');
                setAttribute('draggable', 'false');
            }
            break;
        case 'input':
            element = elementToWrap || document.createElement('input');
            tagNameDisplay = 'input';

            if(!elementToWrap){
                element.type = 'text'; // Tipo di default
                element.placeholder = 'Campo di input';
                element.classList.add('form-control'); // CLASSE BOOTSTRAP
            } else {
                element.classList.add('form-control');
            }

            with(element) {
                title = 'Doppio click per cambiare livello (H1-H6)';
                removeEventListener('dblclick', promptChangeInputAttributes);
                addEventListener('dblclick', promptChangeInputAttributes);
                setAttribute('draggable', 'false');
                // Aggiungi prevenzione comportamento predefinito per tipi specifici
                removeEventListener('click', preventInputDefaultBehavior);
                addEventListener('click', preventInputDefaultBehavior);
            }
            hasDoubleClickAction = true;
            break;
        case 'image':
            element = elementToWrap || document.createElement('img');
            tagNameDisplay = 'img';
            if (!elementToWrap) {
                with(element) {
                    src = 'https://placehold.co/600x300/e9ecef/adb5bd?text=Immagine';
                    alt = 'Immagine';
                    classList.add('img-fluid', 'rounded');
                }
            }
            with(element) {
                style.cursor = 'pointer';
                title = 'Doppio click per cambiare attributi (src, width, height)';
                removeEventListener('dblclick', promptChangeImageAttributes); // Rimuovi prima per sicurezza
                addEventListener('dblclick', promptChangeImageAttributes);
                setAttribute('draggable', 'false');
            }
            hasDoubleClickAction = true;
            break;
        case 'button':
            element = elementToWrap || document.createElement('button');
            tagNameDisplay = 'button';
            if (!elementToWrap) {
                with(element) {
                    textContent = 'Testo Pulsante';
                    classList.add('btn', 'btn-primary', 'rounded-pill');
                }
            }
            with(element) {
                setAttribute('contenteditable', 'true');
                // Assicurati che sia type="button" anche se fornito
                setAttribute('type', 'button');
                setAttribute('draggable', 'false');
            }
            break;
        case 'card':
            element = elementToWrap || document.createElement('div');
            tagNameDisplay = 'card';
            if (!elementToWrap) {
                with(element) {
                    classList.add('card', 'shadow-sm');
                    innerHTML = `
                        <img src="https://placehold.co/600x200/e9ecef/adb5bd?text=Immagine+Card" class="card-img-top card-image-editable" alt="Immagine Card" title="Clicca per cambiare immagine">
                        <div class="card-body">
                            <h5 class="card-title" contenteditable="true">Titolo Card</h5>
                            <p class="card-text" contenteditable="true">Testo della card modificabile.</p>
                            <a href="#" class="btn btn-sm btn-outline-secondary card-button-editable" contenteditable="true">Azione</a>
                        </div>
                    `;
                }
            } else {
                 // Assicurati che le classi base ci siano se l'elemento e' fornito
                 element.classList.add('card'); // Aggiungi 'card' se non presente
            }

            // Configura elementi interni (sia per nuovi che per forniti)
            const cardImage = element.querySelector('.card-img-top, .card-image-editable'); // Trova l'immagine
            if(cardImage) {
                cardImage.classList.add('card-image-editable'); // Assicura la classe per il selettore
                with(cardImage) {
                    style.cursor = 'pointer';
                    title = 'Doppio click per cambiare attributi (src, width, height)';
                    removeEventListener('dblclick', promptChangeImageAttributes);
                    addEventListener('dblclick', promptChangeImageAttributes);
                    setAttribute('draggable', 'false');
                }
            }
            const cardTitle = element.querySelector('.card-title');
            if (cardTitle) {
                cardTitle.setAttribute('contenteditable', 'true');
                cardTitle.setAttribute('draggable', 'false');
            }
            const cardText = element.querySelector('.card-text');
            if (cardText) {
                cardText.setAttribute('contenteditable', 'true');
                cardText.setAttribute('draggable', 'false');
            }
            const cardButton = element.querySelector('.btn, .card-button-editable'); // Trova il bottone
            if (cardButton) {
                with(cardButton){
                    classList.add('card-button-editable'); // Assicura la classe
                    setAttribute('contenteditable', 'true');
                    setAttribute('draggable', 'false');
                }
            }
            // L'elemento card (div) stesso non deve essere trascinabile
            element.setAttribute('draggable', 'false');
            hasDoubleClickAction = true;
            break;
        case 'link':
            element = elementToWrap || document.createElement('a');
            tagNameDisplay = 'a';
            if (!elementToWrap) {
                element.textContent = 'Testo del Link Modificabile';
                element.setAttribute('href', '#');
            }
            with(element) {
                setAttribute('contenteditable', 'true');
                title = 'Doppio click per cambiare URL';
                removeEventListener('dblclick', promptChangeLinkHref);
                addEventListener('dblclick', promptChangeLinkHref);
                setAttribute('draggable', 'false');
                // Aggiungi prevenzione click in edit mode
                removeEventListener('click', preventLinkClickInEdit);
                addEventListener('click', preventLinkClickInEdit);
            }
            hasDoubleClickAction = true;
            break;
        case 'horizontal-rule':
            element = elementToWrap || document.createElement('hr');
            tagNameDisplay = 'hr';
            // L'elemento HR non ha contenuto modificabile o attributi speciali da gestire qui
            // Assicurati che non sia trascinabile direttamente
            element.setAttribute('draggable', 'false');
            element.title = 'Doppio click per modificare altezza';
            element.removeEventListener('dblclick', promptChangeHrHeight); // Rimuovi per sicurezza
            element.addEventListener('dblclick', promptChangeHrHeight);
            hasDoubleClickAction = true;
            break;
        default:
            console.warn(`Tipo di componente sconosciuto: ${type}. Nessun elemento creato.`);
            return null; // Nessun elemento valido da wrappare
    }


    // --- Popola e aggiungi l'info box ---
    const tagNameSpan = document.createElement('span');
    tagNameSpan.classList.add('tag-name');
    tagNameSpan.textContent = `<${tagNameDisplay}>`;
    hoverInfoDiv.appendChild(tagNameSpan);

    if (hasDoubleClickAction) {
        const editButton = document.createElement('button');
        with(editButton) {
            classList.add('control-button', 'edit-button');
            innerHTML = '<i class="bi bi-pencil-square"></i>';
            title = 'Modifica (come doppio click)';
            type = 'button';
            // Assegna un ID temporaneo per ritrovarlo dopo la clonazione
            // (assicurati che questo ID sia unico se necessario, o usa un altro metodo per trovarlo)
            // In alternativa, potremmo non clonare qui e usare removeEventListener se abbiamo la reference
            // Ma per coerenza con deleteButton, usiamo la clonazione.
            // Non aggiungiamo ID qui, lo troveremo tramite classe nel contesto.
        }

        hoverInfoDiv.appendChild(editButton);
        // Trova il bottone specifico all'interno di questo hoverInfoDiv
        const currentEditButton = hoverInfoDiv.querySelector('.edit-button');
        if (currentEditButton) {
            // Rimuovi listener esistenti clonando il nodo
            const clonedEditButton = currentEditButton.cloneNode(true);
            hoverInfoDiv.replaceChild(clonedEditButton, currentEditButton);

            // Aggiungi il nuovo listener al bottone clonato
            clonedEditButton.addEventListener('click', handleEditButtonClick);
        } else {
            console.error("Impossibile trovare editButton appena creato nell'hoverInfoDiv.");
        }
    }
    elementWrapper.appendChild(hoverInfoDiv); // Aggiungi l'info box al wrapper

    // Aggiungo element al wrapper, listener di selezione, etc.

    // Se siamo arrivati qui, un elemento valido e' stato creato o fornito
    with(elementWrapper){
        appendChild(element); // Aggiunge l'elemento (nuovo o fornito) al wrapper
        // Aggiungi listener per la selezione al wrapper
        removeEventListener('click', handleElementSelection);
        addEventListener('click', handleElementSelection);
        removeEventListener('focus', handleElementSelection);
        addEventListener('focus', handleElementSelection); // Anche per accessibilita' da tastiera
    }

    return elementWrapper; // Ritorna il wrapper completo
}

// --- FUNZIONI HELPER per Hover Info ---
function showHoverInfo(event) {
    const wrapper = event.currentTarget;
    const hoverInfo = wrapper.querySelector('.hover-info');
    if (hoverInfo) {
        hoverInfo.style.display = 'flex'; // Mostra l'info box
    }
}

function hideHoverInfo(event) {
    const wrapper = event.currentTarget;
    const hoverInfo = wrapper.querySelector('.hover-info');
    if (hoverInfo) {
        hoverInfo.style.display = 'none'; // Nascondi l'info box
    }
}