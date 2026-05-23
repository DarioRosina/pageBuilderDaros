// Registry centrale dei componenti disponibili nel builder.
// Per aggiungere un nuovo tipo basta aggiungere una voce con:
// - create(elementToWrap): crea/configura il nodo DOM del componente
// - matches(loadedElement): riconosce il componente durante l'import HTML
const componentRegistry = {
    'heading': {
        matches: loadedElement => /^H[1-6]$/.test(loadedElement.tagName),
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('h1');

            if (!elementToWrap) {
                element.textContent = 'Titolo Modificabile';
            }

            with(element) {
                setAttribute('contenteditable', 'true');
                title = 'Doppio click per cambiare livello (H1-H6)';
                removeEventListener('dblclick', promptChangeHeadingLevel);
                addEventListener('dblclick', promptChangeHeadingLevel);
                setAttribute('draggable', 'false');
            }

            return {
                element,
                tagNameDisplay: element.tagName.toLowerCase(),
                hasDoubleClickAction: true
            };
        }
    },
    'paragraph': {
        matches: loadedElement => loadedElement.tagName === 'P',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('p');

            if (!elementToWrap) {
                element.textContent = 'Questo è un paragrafo modificabile. Clicca per editarlo.';
            }

            with(element) {
                setAttribute('contenteditable', 'true');
                setAttribute('draggable', 'false');
            }

            return {
                element,
                tagNameDisplay: 'p',
                hasDoubleClickAction: false
            };
        }
    },
    'input': {
        matches: loadedElement => loadedElement.tagName === 'INPUT',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('input');

            if (!elementToWrap) {
                element.type = 'text';
                element.placeholder = 'Campo di input';
            }

            element.classList.add('form-control');

            with(element) {
                title = 'Doppio click per cambiare livello (H1-H6)';
                removeEventListener('dblclick', promptChangeInputAttributes);
                addEventListener('dblclick', promptChangeInputAttributes);
                setAttribute('draggable', 'false');
                removeEventListener('click', preventInputDefaultBehavior);
                addEventListener('click', preventInputDefaultBehavior);
            }

            return {
                element,
                tagNameDisplay: 'input',
                hasDoubleClickAction: true
            };
        }
    },
    'image': {
        matches: loadedElement => loadedElement.tagName === 'IMG',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('img');

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
                removeEventListener('dblclick', promptChangeImageAttributes);
                addEventListener('dblclick', promptChangeImageAttributes);
                setAttribute('draggable', 'false');
            }

            return {
                element,
                tagNameDisplay: 'img',
                hasDoubleClickAction: true
            };
        }
    },
    'button': {
        matches: loadedElement => loadedElement.tagName === 'BUTTON',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('button');

            if (!elementToWrap) {
                with(element) {
                    textContent = 'Testo Pulsante';
                    classList.add('btn', 'btn-primary', 'rounded-pill');
                }
            }

            with(element) {
                setAttribute('contenteditable', 'true');
                setAttribute('type', 'button');
                setAttribute('draggable', 'false');
            }

            return {
                element,
                tagNameDisplay: 'button',
                hasDoubleClickAction: false
            };
        }
    },
    'card': {
        matches: loadedElement => loadedElement.tagName === 'DIV' && loadedElement.classList.contains('card'),
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('div');

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
                element.classList.add('card');
            }

            const cardImage = element.querySelector('.card-img-top, .card-image-editable');
            if (cardImage) {
                cardImage.classList.add('card-image-editable');
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

            const cardButton = element.querySelector('.btn, .card-button-editable');
            if (cardButton) {
                with(cardButton) {
                    classList.add('card-button-editable');
                    setAttribute('contenteditable', 'true');
                    setAttribute('draggable', 'false');
                }
            }

            element.setAttribute('draggable', 'false');

            return {
                element,
                tagNameDisplay: 'card',
                hasDoubleClickAction: true
            };
        }
    },
    'link': {
        matches: loadedElement => loadedElement.tagName === 'A',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('a');

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
                removeEventListener('click', preventLinkClickInEdit);
                addEventListener('click', preventLinkClickInEdit);
            }

            return {
                element,
                tagNameDisplay: 'a',
                hasDoubleClickAction: true
            };
        }
    },
    'horizontal-rule': {
        matches: loadedElement => loadedElement.tagName === 'HR',
        create(elementToWrap = null) {
            const element = elementToWrap || document.createElement('hr');

            element.setAttribute('draggable', 'false');
            element.title = 'Doppio click per modificare altezza';
            element.removeEventListener('dblclick', promptChangeHrHeight);
            element.addEventListener('dblclick', promptChangeHrHeight);

            return {
                element,
                tagNameDisplay: 'hr',
                hasDoubleClickAction: true
            };
        }
    }
};

function getComponentDefinition(type) {
    return componentRegistry[type] || null;
}

function getComponentTypeFromElement(loadedElement) {
    const registryEntry = Object.entries(componentRegistry)
        .find(([, definition]) => definition.matches(loadedElement));

    return registryEntry ? registryEntry[0] : null;
}

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

    const componentDefinition = getComponentDefinition(type);
    if (!componentDefinition) {
        console.warn(`Tipo di componente sconosciuto: ${type}. Nessun elemento creato.`);
        return null; // Nessun elemento valido da wrappare
    }

    // Il renderer non conosce i singoli tipi: delega creazione e setup al registry.
    const { element, tagNameDisplay, hasDoubleClickAction } = componentDefinition.create(elementToWrap);

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
