function handleEditButtonClick(event) {
  event.stopPropagation(); // Non selezionare l'elemento wrapper
  
  const wrapper = event.target.closest('.canvas-element');
  if (!wrapper) return; // Controllo di sicurezza
  console.log('handleEditButtonClick triggered for type:', wrapper.dataset.componentType);
  
  const currentType = wrapper.dataset.componentType; // Ottieni il tipo attuale dal wrapper
  let targetElementToDoubleClick = null;

  // Trova l'elemento target corretto su cui simulare il doppio click BASATO SUL TIPO ATTUALE
  switch (currentType) {
      case 'heading':
      case 'image':
      case 'link':
      case 'horizontal-rule':
          // Seleziona il figlio diretto che NON sono i controlli o l'info box
          targetElementToDoubleClick = wrapper.querySelector(':scope > *:not(.element-controls):not(.hover-info)');
          break;
      case 'input':
          targetElementToDoubleClick = wrapper.querySelector(':scope > input');
          break;
      case 'card':
          // La logica per la card cerca l'immagine modificabile all'interno dell'elemento card attuale
          const cardElement = wrapper.querySelector(':scope > .card'); // Trova l'elemento card nel wrapper
          if (cardElement) {
              targetElementToDoubleClick = cardElement.querySelector('.card-image-editable');
              if (!targetElementToDoubleClick) {
                  console.log("Nessun elemento .card-image-editable trovato per dblclick nella card.");
              }
          } else {
              console.warn("Elemento .card non trovato nel wrapper per il dblclick simulato.");
          }
          break;
      // Non serve gestire i casi senza hasDoubleClickAction
  }

  if (targetElementToDoubleClick && typeof targetElementToDoubleClick.dispatchEvent === 'function') {
      // Crea e invia un evento double-click all'elemento trovato
      const dblClickEvent = new MouseEvent('dblclick', {
          bubbles: true,
          cancelable: true,
          view: window
      });
      console.log('Simulating dblclick on:', targetElementToDoubleClick);
      targetElementToDoubleClick.dispatchEvent(dblClickEvent);
      console.log(`Triggered dblclick on ${targetElementToDoubleClick.tagName || 'card element'} via hover button`);
  } else if (currentType !== 'card' || (currentType === 'card' && !targetElementToDoubleClick)) {
      console.warn("Elemento target per doppio click non trovato o non valido per:", currentType);
  }
}


// Funzione per prevenire il click sui link quando sono in modalita' contenteditable
function preventLinkClickInEdit(event) {
    // event.currentTarget si riferisce all'elemento a cui e' attaccato il listener (il link <a>)
    if (event.currentTarget.getAttribute('contenteditable') === 'true') {
        event.preventDefault();
        console.log('Link click prevented during edit.'); // Log per debug
    }
}


function handleElementSelection(event) {
    const targetElement = event.currentTarget;
    if(targetElement==null)return
    
    if (selectedElement && selectedElement !== targetElement) {
        selectedElement.classList.remove('selected');
    }
    if (selectedElement !== targetElement) {
        targetElement.classList.add('selected');
        selectedElement = targetElement;
    } else {
        targetElement.classList.remove('selected');
        selectedElement = null;
    }
}
