// Funzione per salvare le impostazioni
const handleSaveSettings = () => {
    const newColumnCount = parseInt(columnCountInput.value, 10);
    settingsFeedback.innerHTML = ''; // Pulisci feedback precedente

    if (isNaN(newColumnCount) || newColumnCount < 1) {
        settingsFeedback.innerHTML = '<div class="alert alert-danger p-2">Inserisci un numero di colonne valido (minimo 1).</div>';
        columnCountInput.classList.add('is-invalid');
        return;
    }

    pageColumnCount = newColumnCount;
    columnCountInput.classList.remove('is-invalid');
    console.log(`Numero colonne aggiornato a: ${pageColumnCount}`);

    if (buildCanvas) {
        buildCanvas.style.display = 'grid';
        buildCanvas.style.gridTemplateColumns = `repeat(${pageColumnCount}, 1fr)`;
        buildCanvas.style.gap = '10px'; // Puoi rendere anche questo configurabile se vuoi
        console.log(`Stile griglia applicato a buildCanvas: ${buildCanvas.style.gridTemplateColumns}`);
    } else {
        console.error("Elemento buildCanvas non trovato per applicare lo stile.");
    }

    settingsFeedback.innerHTML = '<div class="alert alert-success p-2">Impostazioni salvate.</div>';

    // Chiudi la modale dopo un breve ritardo
    setTimeout(() => {
        const modalInstance = bootstrap.Modal.getInstance(settingsModalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
        settingsFeedback.innerHTML = ''; // Pulisci feedback dopo chiusura
    }, 250);
};


// Funzione per pre-compilare la modale quando viene mostrata
const handleSettingsModalShow = () => {
    columnCountInput.value = pageColumnCount;
    columnCountInput.classList.remove('is-invalid');
    settingsFeedback.innerHTML = '';
};



if (settingsModalElement && columnCountInput && saveSettingsButton && settingsFeedback) {
    // Rimuovi prima di aggiungere per sicurezza
    saveSettingsButton.removeEventListener('click', handleSaveSettings);
    saveSettingsButton.addEventListener('click', handleSaveSettings);

    settingsModalElement.removeEventListener('show.bs.modal', handleSettingsModalShow);
    settingsModalElement.addEventListener('show.bs.modal', handleSettingsModalShow);
} else {
    console.error("Elementi della modale Impostazioni non trovati. Verifica gli ID nel file HTML.");
}