// Gestore del doppio click per i componenti della sidebar
function handleSidebarDoubleClick(event) {
    // Trova il componente più vicino
    const component = event.target.closest('.draggable-component');
    
    if (!component) {
        console.warn('[handleSidebarDoubleClick] Nessun componente trovato');
        return;
    }
    
    // Ottieni il tipo di componente
    const componentType = component.dataset.componentType;
    
    if (!componentType) {
        console.warn('[handleSidebarDoubleClick] Tipo di componente non trovato');
        return;
    }
    
    console.log(`[handleSidebarDoubleClick] Aggiunta componente: ${componentType}`);
    
    // Nascondi il messaggio iniziale se presente
    const initialMessage = buildCanvas.querySelector('.initial-message');
    if (initialMessage) {
        initialMessage.style.display = 'none';
    }
    
    // Crea il nuovo elemento usando la factory esistente
    const newElement = createComponentElement(componentType);
    
    // Aggiungi l'elemento alla fine del canvas
    buildCanvas.appendChild(newElement);
    
    // Aggiungi i listener per i controlli (pulsanti delete, duplicate, move, edit, drag)
    addControlListeners(newElement);
    
    // Aggiungi il listener per la selezione dell'elemento
    newElement.removeEventListener('click', handleElementSelection);
    newElement.addEventListener('click', handleElementSelection);
    
    // Scorri verso il nuovo elemento
    newElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Seleziona automaticamente il nuovo elemento usando la funzione riutilizzabile
    selectElement(newElement, true); // true per abilitare la selezione automatica del testo
    
    console.log(`[handleSidebarDoubleClick] Componente ${componentType} aggiunto con successo`);
}

// Funzione per inizializzare i gestori del doppio click sui componenti della sidebar
function initializeSidebarDoubleClickHandlers() {
    // Seleziona tutti i componenti draggable della sidebar
    const sidebarComponents = document.querySelectorAll('#components-sidebar .draggable-component');
    
    console.log(`[initializeSidebarDoubleClickHandlers] Inizializzazione gestori per ${sidebarComponents.length} componenti`);
    
    // Aggiungi il gestore del doppio click a ogni componente
    sidebarComponents.forEach(component => {
        // Rimuovi eventuali listener esistenti per evitare duplicati
        component.removeEventListener('dblclick', handleSidebarDoubleClick);
        
        // Aggiungi il nuovo listener
        component.addEventListener('dblclick', handleSidebarDoubleClick);
        
        // Aggiungi un attributo per indicare che il doppio click è attivo
        component.setAttribute('title', component.getAttribute('title') || 'Doppio click per aggiungere alla fine del canvas');
    });
    
    console.log('[initializeSidebarDoubleClickHandlers] Gestori del doppio click inizializzati');
}