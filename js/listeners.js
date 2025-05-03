/* DOCUMENT */

// Deseleziona l'elemento se si clicca fuori
document.addEventListener('click', (e) => {
    if (selectedElement && !selectedElement.contains(e.target) && !e.target.closest('.canvas-element')) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
    }
});
