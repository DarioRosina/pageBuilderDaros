// --- Funzione per chiedere e cambiare attributi per elementi H1...H6 ---
function promptChangeHeadingLevel(event) {
    const currentElement = event.target.closest('h1, h2, h3, h4, h5, h6');
    if (!currentElement) return;

    event.preventDefault(); // Previene comportamenti di default se l'evento e' su un link o altro

    const currentLevel = parseInt(currentElement.tagName.substring(1), 10);
    const wrapper = currentElement.closest('.canvas-element'); // Trova il wrapper genitore
    if (!wrapper) {
        console.error("Impossibile trovare il wrapper .canvas-element per l'heading.");
        return;
    }

    // Ottieni riferimenti alla modale e ai suoi controlli
    const headingModalElement = document.getElementById('headingLevelModal');
    if (!headingModalElement) {
        console.error("Elemento modale #headingLevelModal non trovato nel DOM.");
        return;
    }
    const headingModal = bootstrap.Modal.getOrCreateInstance(headingModalElement);
    const headingLevelSelect = document.getElementById('headingLevelSelect');
    const saveHeadingLevelButton = document.getElementById('saveHeadingLevelButton');

    if (!headingLevelSelect || !saveHeadingLevelButton) {
        console.error("Elementi select o button della modale heading non trovati.");
        return;
    }

    // Imposta il valore corrente nel select
    headingLevelSelect.value = currentLevel;

    // --- Gestore per il click sul pulsante "Salva Modifiche" ---
    const handleSaveClick = () => {
        const newLevel = parseInt(headingLevelSelect.value, 10);

        if (isNaN(newLevel) || newLevel < 1 || newLevel > 6) {
            console.error("Livello heading non valido selezionato:", headingLevelSelect.value);
            return; // Non fare nulla se il valore non e' valido
        }

        if (newLevel === currentLevel) {
            headingModal.hide(); // Chiudi se non ci sono modifiche
            return;
        }

        // Crea il nuovo elemento heading
        const newHeadingElement = document.createElement(`h${newLevel}`);
        newHeadingElement.textContent = currentElement.textContent; // Copia il testo
        // Copia attributi importanti (es. contenteditable, title, listeners)
        newHeadingElement.setAttribute('contenteditable', 'true');
        newHeadingElement.title = 'Doppio click per cambiare livello (H1-H6)';
        newHeadingElement.removeEventListener('dblclick', promptChangeHeadingLevel); // Rimuovi vecchi listener se presenti
        newHeadingElement.addEventListener('dblclick', promptChangeHeadingLevel);
        newHeadingElement.setAttribute('draggable', 'false');
        // Potresti voler copiare anche classi specifiche se necessario

        // Sostituisci il vecchio elemento con il nuovo nel DOM
        // Assicurati che currentElement sia figlio diretto del wrapper
        if (currentElement.parentNode === wrapper) {
            wrapper.replaceChild(newHeadingElement, currentElement);
        } else {
            // Fallback se la struttura e' diversa
            console.error("Impossibile trovare l'elemento heading originale come figlio diretto del wrapper.");
            const oldHeading = wrapper.querySelector(currentElement.tagName);
            if(oldHeading) {
                wrapper.replaceChild(newHeadingElement, oldHeading);
            }
        }

        // Aggiorna il tag nell'info box
        const hoverInfo = wrapper.querySelector('.hover-info');
        if (hoverInfo) {
            const tagNameSpan = hoverInfo.querySelector('.tag-name');
            if (tagNameSpan) {
                tagNameSpan.textContent = `<h${newLevel}>`; // Aggiorna il testo
            }
        }

        console.log(`Heading level changed from H${currentLevel} to H${newLevel}`);

        headingModal.hide(); // Chiudi la modale dopo aver salvato
    };

    saveHeadingLevelButton.replaceWith(saveHeadingLevelButton.cloneNode(true)); // Modo semplice per rimuovere tutti i listener
    const newSaveButton = document.getElementById('saveHeadingLevelButton'); // Ottieni il riferimento al nuovo bottone clonato
    newSaveButton.addEventListener('click', handleSaveClick);

    // Autofocus sul select quando la modale e' mostrata
    // Rimuovi listener precedenti per sicurezza
    headingModalElement.removeEventListener('shown.bs.modal', focusHeadingSelect);
    // Aggiungi il nuovo listener
    headingModalElement.addEventListener('shown.bs.modal', focusHeadingSelect, { once: true }); // Usa { once: true } per eseguirlo solo una volta per apertura

    // Mostra la modale
    headingModal.show();
}


// --- Funzione per chiedere e cambiare attributi per elemento IMAGE ---
function promptChangeImageAttributes(event) {
    const imgElement = event.target.closest('img'); // Trova l'elemento img cliccato
    if (!imgElement) return;

    event.preventDefault();

    // Ottieni riferimenti alla modale e ai suoi controlli
    const imageModalElement = document.getElementById('imageAttributesModal');
    if (!imageModalElement) {
        console.error("Elemento modale #imageAttributesModal non trovato nel DOM.");
        return;
    }
    const imageModal = bootstrap.Modal.getOrCreateInstance(imageModalElement);
    const imageSrcInput = document.getElementById('imageSrcInput');
    const imageWidthInput = document.getElementById('imageWidthInput');
    const imageHeightInput = document.getElementById('imageHeightInput');
    const saveImageAttributesButton = document.getElementById('saveImageAttributesButton');
    const imagePreview = document.getElementById('imagePreview');
    const imageError = document.getElementById('imageError');

    if (!imageSrcInput || !imageWidthInput || !imageHeightInput || !saveImageAttributesButton || !imagePreview || !imageError) {
        console.error("Uno o più elementi della modale immagine non trovati.");
        return;
    }

    // --- Funzione per aggiornare l'anteprima ---
    const updatePreview = () => {
        const src = imageSrcInput.value.trim();
        imageError.classList.add('d-none'); // Nascondi errore precedente
        if (src) {
            const tempImg = new Image();
            tempImg.onload = () => {
                imagePreview.innerHTML = ''; // Pulisci anteprima precedente
                tempImg.style.maxWidth = '100%';
                tempImg.style.maxHeight = '200px'; // Limita altezza anteprima
                imagePreview.appendChild(tempImg);
                imageError.classList.add('d-none');
            };
            tempImg.onerror = () => {
                imagePreview.innerHTML = '<small>Anteprima non disponibile.</small>';
                imageError.classList.remove('d-none');
            };
            tempImg.src = src;
        } else {
            imagePreview.innerHTML = '<small>Nessun URL immagine fornito.</small>';
        }
    };

    // Imposta i valori correnti negli input
    imageSrcInput.value = imgElement.getAttribute('src') || '';
    imageWidthInput.value = imgElement.getAttribute('width') || '';
    imageHeightInput.value = imgElement.getAttribute('height') || '';

    // Mostra l'anteprima iniziale e aggiungi listener per aggiornarla
    updatePreview();
    imageSrcInput.removeEventListener('input', updatePreview); // Rimuovi listener precedenti
    imageSrcInput.addEventListener('input', updatePreview);

    // --- Gestore per il click sul pulsante "Salva Modifiche" ---
    const handleSaveClick = () => {
        const newSrc = imageSrcInput.value.trim();
        const newWidth = imageWidthInput.value.trim();
        const newHeight = imageHeightInput.value.trim();

        // Rimuovi listener per evitare esecuzioni multiple
        saveImageAttributesButton.removeEventListener('click', handleSaveClick);
        imageSrcInput.removeEventListener('input', updatePreview); // Rimuovi anche questo

        let hasError = false;

        // Update Src
        if (newSrc !== (imgElement.getAttribute('src') || '')) {
            if (newSrc === '') {
                 // Se l'utente cancella l'URL, potresti voler mettere un placeholder
                 imgElement.src = 'https://placehold.co/300x150/e9ecef/adb5bd?text=Immagine'; // Placeholder
                 imgElement.removeAttribute('onerror'); // Rimuovi vecchio handler errore
            } else {
                imgElement.src = newSrc;
                // Aggiungi fallback se l'immagine fallisce a caricarsi DOPO l'aggiornamento
                imgElement.onerror = function() {
                    this.onerror = null; // Prevent infinite loops
                    this.src = 'https://placehold.co/300x150/dc3545/ffffff?text=Errore+URL'; // Error placeholder
                    // Potresti voler riaprire la modale o mostrare un messaggio persistente
                    console.warn("URL immagine aggiornato non valido o non caricabile.");
                    // Non impostare hasError qui, l'errore e' gestito dall'onerror
                };
                // Verifica immediata (opzionale, l'onerror e' piu' robusto)
                const tempImgCheck = new Image();
                tempImgCheck.onerror = () => {
                    imageError.classList.remove('d-none'); // Mostra errore nella modale se possibile
                    // Potresti decidere di non chiudere la modale qui
                }
                tempImgCheck.src = newSrc;
            }
        }


        // Update Width
        if (newWidth === '') {
            imgElement.removeAttribute('width');
        } else if (!isNaN(parseInt(newWidth)) && parseInt(newWidth) > 0) {
            imgElement.setAttribute('width', parseInt(newWidth));
        } else if (newWidth !== '') { // Se non e' vuoto ma non e' un numero valido
            alert("Larghezza non valida. Inserisci solo un numero positivo (es: 150).");
            hasError = true; // Impedisce la chiusura della modale
        }

        // Update Height
        if (newHeight === '') {
            imgElement.removeAttribute('height');
        } else if (!isNaN(parseInt(newHeight)) && parseInt(newHeight) > 0) {
            imgElement.setAttribute('height', parseInt(newHeight));
        } else if (newHeight !== '') { // Se non e' vuoto ma non e' un numero valido
            alert("Altezza non valida. Inserisci solo un numero positivo (es: 100).");
            hasError = true; // Impedisce la chiusura della modale
        }

        // Update title
        imgElement.title = 'Doppio click per cambiare attributi (src, width, height)';

        if (!hasError) {
            imageModal.hide(); // Chiudi la modale solo se non ci sono stati errori di validazione immediati
        } else {
            // Se c'e' stato un errore, riattacca il listener al bottone Salva
            // perche' la modale non si e' chiusa
            reattachSaveListener();
        }
    };

    saveImageAttributesButton.replaceWith(saveImageAttributesButton.cloneNode(true));
    const newSaveButton = document.getElementById('saveImageAttributesButton');
    newSaveButton.addEventListener('click', handleSaveClick);

    // --- Autofocus sull'input src quando la modale e' mostrata ---
    // Rimuovi listener precedenti per sicurezza
    imageModalElement.removeEventListener('shown.bs.modal', focusImageSrcInput);
    // Aggiungi il nuovo listener
    imageModalElement.addEventListener('shown.bs.modal', focusImageSrcInput, { once: true });

    // Mostra la modale
    imageModal.show();

    // Pulisci l'errore all'apertura
    imageError.classList.add('d-none');
}


// --- Funzione per chiedere e cambiare attributi per elemento LINK ---
function promptChangeLinkHref(event) {
    const linkElement = event.target.closest('a'); // Trova l'elemento <a> cliccato
    if (!linkElement) return;

    // Prevent default link navigation during editing
    event.preventDefault();

    // Ottieni riferimenti alla modale e ai suoi controlli
    const linkModalElement = document.getElementById('linkHrefModal');
    if (!linkModalElement) {
        console.error("Elemento modale #linkHrefModal non trovato nel DOM.");
        return;
    }
    const linkModal = bootstrap.Modal.getOrCreateInstance(linkModalElement);
    const linkHrefInput = document.getElementById('linkHrefInput');
    const linkTargetSelect = document.getElementById('linkTargetSelect'); // NUOVO: Ottieni il select
    const saveLinkHrefButton = document.getElementById('saveLinkHrefButton');

    if (!linkHrefInput || !linkTargetSelect || !saveLinkHrefButton) { // NUOVO: Aggiunto controllo per linkTargetSelect
        console.error("Uno o più elementi della modale link non trovati.");
        return;
    }

    // Imposta i valori correnti negli input
    linkHrefInput.value = linkElement.getAttribute('href') || '#';
    linkTargetSelect.value = linkElement.getAttribute('target') || ''; // NUOVO: Imposta il target corrente

    // --- Autofocus sull'input href quando la modale e' mostrata ---
    linkModalElement.removeEventListener('shown.bs.modal', focusLinkHrefInput);
    linkModalElement.addEventListener('shown.bs.modal', focusLinkHrefInput, { once: true }); // Usa { once: true }


    // --- Gestore per il click sul pulsante "Salva Modifiche" ---
    const handleSaveClick = () => {
        const newHref = linkHrefInput.value.trim();
        const newTarget = linkTargetSelect.value; // NUOVO: Leggi il valore del target

        // Rimuovi listener per evitare esecuzioni multiple (gestito da replaceWith sotto)
        // saveLinkHrefButton.removeEventListener('click', handleSaveClick);

        const currentHref = linkElement.getAttribute('href') || '#';
        const currentTarget = linkElement.getAttribute('target') || ''; // NUOVO: Leggi il target corrente

        let changed = false;

        // Update href
        if (newHref !== currentHref) {
            if (newHref === '') {
                linkElement.setAttribute('href', '#'); // Imposta a '#' se vuoto
            } else {
                linkElement.setAttribute('href', newHref);
            }
            changed = true;
        }

        // Update target
        if (newTarget !== currentTarget) {
            if (newTarget) { // Se e' stato selezionato un target (diverso da "")
                linkElement.setAttribute('target', newTarget);
            } else { // Se e' stato selezionato "" (default _self)
                linkElement.removeAttribute('target'); // Rimuovi l'attributo
            }
            changed = true;
        }


        // Update title se l'href e' cambiato
        if (changed) { // Aggiorna il titolo se href o target sono cambiati
            const finalHref = linkElement.getAttribute('href'); // Leggi l'href finale
            const finalTarget = linkElement.getAttribute('target'); // Leggi il target finale

            let titleText = 'Link';
            if (finalHref && finalHref !== '#') {
                titleText = `Link a: ${finalHref}`;
            } else {
                titleText = 'Link (nessun URL specificato)';
            }
            if (finalTarget) {
                titleText += ` (apre in ${finalTarget})`;
            }
            linkElement.title = titleText;
        }

        linkModal.hide(); // Chiudi la modale
    };

    saveLinkHrefButton.replaceWith(saveLinkHrefButton.cloneNode(true));
    const newSaveButton = document.getElementById('saveLinkHrefButton');
    newSaveButton.addEventListener('click', handleSaveClick);

    // Mostra la modale
    linkModal.show();
}


// --- Funzione per chiedere e cambiare attributi per elemento HR ---
function promptChangeHrHeight(event) {
    event.stopPropagation(); // Impedisce la propagazione ad altri listener (es. selezione)
    const targetElement = event.target.closest('hr'); // Assicurati di prendere l'elemento HR
    if (!targetElement) return;

    currentHrElement = targetElement; // Salva l'HR cliccato

    if (!hrAttributesModalElement) {
        console.error("Elemento modale #hrAttributesModal non trovato nel DOM.");
        return;
    }

    if (!hrHeightInput || !saveHrAttributesButton) {
        console.error("Elementi input (#hrHeightInput) o bottone (#saveHrAttributesButton) non trovati nella modale HR.");
        return;
    }

    // Imposta il valore corrente nell'input
    const currentHeight = currentHrElement.style.height || ''; // Leggi dallo stile inline prima
    // Se lo stile inline e' vuoto o 'auto', potresti voler prendere il valore calcolato, ma e' piu' complesso.
    // Per ora, ci basiamo sullo stile inline per semplicita'.
    hrHeightInput.value = currentHeight ? parseInt(currentHeight, 10) : ''; // Mostra solo il numero se presente

    // --- Gestore per il click sul pulsante "Salva Modifiche" ---
    const handleSaveClick = () => {
        // Rimuovi il listener dal bottone (gestito da replaceWith sotto, ma buona pratica averlo qui)
        // saveHrAttributesButton.removeEventListener('click', handleSaveClick); // Non necessario con replaceWith

        if (!currentHrElement) {
            console.error("Nessun elemento HR corrente selezionato per il salvataggio.");
            hrModal.hide();
            return;
        }

        const newHeightRaw = hrHeightInput.value.trim();
        let hasError = false;

        if (newHeightRaw === '' || newHeightRaw === null) {
            // Se vuoto, rimuovi gli stili specifici dell'altezza
            with(currentHrElement){
                style.removeProperty('height');
                style.removeProperty('border');
                style.removeProperty('border-top-width');
                style.removeProperty('margin-top');
                style.removeProperty('margin-bottom');
            }
            console.log("Stile altezza HR rimosso (default).");
        } else {
            const heightValue = parseInt(newHeightRaw, 10);
            if (!isNaN(heightValue) && heightValue >= 0) {
                if (heightValue === 0) {
                    // Per altezza 0, nascondi il bordo e azzera i margini verticali
                    with(currentHrElement){
                        style.height = '0px';
                        style.border = 'none';
                        style.marginTop = '0';
                        style.marginBottom = '0';
                    }
                    console.log("Altezza HR impostata a 0px.");
                } else {
                    // Imposta l'altezza specificata e ripristina stili potenzialmente rimossi
                    with(currentHrElement){
                        style.height = `${heightValue}px`;
                        style.borderTopWidth = `${heightValue}px`; // Spesso necessario per HR
                        style.removeProperty('border'); // Assicura che non sia 'none'
                        style.removeProperty('margin-top');
                        style.removeProperty('margin-bottom');
                        // Potrebbe essere necessario ripristinare il colore o altri stili di bordo se modificati
                        // style.borderStyle = 'solid'; // Esempio
                        // style.borderColor = 'currentColor'; // Esempio
                    }
                    console.log(`Altezza HR impostata a ${heightValue}px.`);
                }
            } else {
                // Valore non valido
                alert("Altezza non valida. Inserisci un numero positivo (es: 1) o lascia vuoto.");
                console.warn("Altezza HR non valida:", newHeightRaw);
                hasError = true; // Impedisce la chiusura della modale
            }
        }

        // Aggiorna il titolo per riflettere lo stato (opzionale)
        currentHrElement.title = 'Doppio click per modificare altezza';

        if (!hasError) {
            hrModal.hide(); // Chiudi la modale solo se non ci sono stati errori
            // currentHrElement = null; // Resetta qui o nell'evento 'hidden.bs.modal'
        } else {
            // Se c'e' stato un errore, riattacca il listener al bottone Salva
            // perche' la modale non si e' chiusa
            reattachSaveListener();
        }
    };

    saveHrAttributesButton.replaceWith(saveHrAttributesButton.cloneNode(true));
    const newSaveButton = document.getElementById('saveHrAttributesButton');
    newSaveButton.addEventListener('click', handleSaveClick);

    hrAttributesModalElement.removeEventListener('shown.bs.modal', focusHrInput);
    hrAttributesModalElement.addEventListener('shown.bs.modal', focusHrInput, { once: true });

    // Mostra la modale
    hrModal.show();
}


// --- Funzione per chiedere e cambiare attributi per elemento INPUT ---
function promptChangeInputAttributes(event) {
    event.stopPropagation(); 
    const targetElement = event.target.closest('input'); // Trova l'elemento input cliccato
    if (!targetElement) return;
    
    event.preventDefault(); // Previene comportamenti di default

    currentInputElement = targetElement; // Salva l'elemento input cliccato

    if (!inputModalElement) {
        console.error("Elemento modale #inputAttributesModal non trovato nel DOM.");
        return;
    }
    
    if (!inputTypeSelect || !saveInputTypeButton) {
        console.error("Elementi select o button della modale input non trovati.");
        return;
    }

    // Imposta il valore corrente nel select
    const currentType = currentInputElement.getAttribute('type') || 'text'; // Default a 'text' se non specificato
    inputTypeSelect.value = currentType;

    // --- Gestore per il click sul pulsante "Salva Modifiche" ---
    const handleSaveClick = () => {
        const newType = inputTypeSelect.value;

        if (newType === currentType) {
            inputModal.hide(); // Chiudi se non ci sono modifiche
            return;
        }

        // Aggiorna l'attributo type dell'elemento input
        currentInputElement.setAttribute('type', newType);

        // Aggiorna il titolo (opzionale)
        currentInputElement.title = `Doppio click per cambiare tipo (Attuale: ${newType})`;

        if (newType === 'email') {
            currentInputElement.placeholder = 'esempio@dominio.com';
        } else {
            currentInputElement.placeholder = 'Campo di input'; // Placeholder generico
        }

        console.log(`Input type changed from ${currentType} to ${newType}`);

        inputModal.hide(); // Chiudi la modale dopo aver salvato
    };

    // Rimuovi listener precedenti e aggiungi quello nuovo
    saveInputTypeButton.replaceWith(saveInputTypeButton.cloneNode(true));
    const newSaveButton = document.getElementById('saveInputTypeButton');
    newSaveButton.addEventListener('click', handleSaveClick);

    // --- Autofocus sul select quando la modale e' mostrata ---
    inputModalElement.removeEventListener('shown.bs.modal', focusInputSelect);
    inputModalElement.addEventListener('shown.bs.modal', focusInputSelect, { once: true });

    // Mostra la modale
    inputModal.show();
}


// --- Funzioni helper per focus ---
function focusElementById(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    }
}

const focusHeadingSelect = () => { focusElementById('headingLevelSelect') }
const focusImageSrcInput = () => { focusElementById('imageSrcInput') }
const focusLinkHrefInput = () => { focusElementById('linkHrefInput') }
const focusHrInput = () => { focusElementById('hrHeightInput') }
const focusInputSelect = () => { focusElementById('inputTypeSelect') }
