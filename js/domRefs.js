const buildCanvas = document.getElementById('build-canvas');
const draggableComponents = document.querySelectorAll('.draggable-component');
const initialMessage = buildCanvas.querySelector('.initial-message');

const importHtmlModalElement = document.getElementById('importHtmlModal');
const importHtmlCode = document.getElementById('importHtmlCode');
const importConfirmButton = document.getElementById('importConfirmButton');
const importFeedback = document.getElementById('importFeedback');

const exportedHtmlCodeTextarea = document.getElementById('exportedHtmlCode');
const copyHtmlButton = document.getElementById('copyHtmlButton');
const codeBlock = document.getElementById('exportedHtmlCodeBlock');

const previewButton = document.getElementById('previewButton');

let draggedComponentType = null; // Tipo di componente trascinato
let placeholder = null; // Elemento segnaposto per il drop
let selectedElement = null; // Elemento attualmente selezionato nel canvas
let draggedElement = null; // The actual .canvas-element being dragged

let currentHrElement = null; // Riferimento all'elemento HR selezionato
const hrAttributesModalElement = document.getElementById('hrAttributesModal');
const hrModal = bootstrap.Modal.getOrCreateInstance(hrAttributesModalElement);
const hrHeightInput = document.getElementById('hrHeightInput');
const saveHrAttributesButton = document.getElementById('saveHrAttributesButton');

let currentInputElement = null; // Riferimento all'elemento Input selezionato
const inputModalElement = document.getElementById('inputAttributesModal');
const inputModal = bootstrap.Modal.getOrCreateInstance(inputModalElement);
const inputTypeSelect = document.getElementById('inputTypeSelect');
const saveInputTypeButton = document.getElementById('saveInputTypeButton');

// --- Impostazioni Pagina ---
let pageColumnCount = 1;
const settingsModalElement = document.getElementById('settingsModal');
const columnCountInput = document.getElementById('columnCountInput');
const saveSettingsButton = document.getElementById('saveSettingsButton');
const settingsFeedback = document.getElementById('settingsFeedback');
