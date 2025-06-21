Welcome to the project!  
🔗 [Italiano (README.it.md)](README.it.md)

# Page Builder VanillaJS (daros)

A simple drag-and-drop Page Builder built entirely in Vanilla JavaScript, with Bootstrap support for structure and styling.

## Description

This project is a web application that allows you to build HTML page layouts visually, by dragging predefined components onto a workspace (canvas). It offers basic functionality for editing, previewing, and exporting the generated HTML code.

**Online Demo:** Try the live version here: [https://page-builder-daros.vercel.app/](https://page-builder-daros.vercel.app/)

![Page Builder Interface Preview](screenshot/demo_ENG.gif)

## Main Features

*   **Drag & Drop:** Drag available components from the sidebar directly onto the canvas to build your page.
*   **Component Editing:** Modify the properties of added components (text, attributes, styles) by double-clicking on them or using the "Edit" button in the Info-Box that appears upon selection.
*   **HTML Import:** Paste existing HTML code to add elements to the canvas. **Note:** Currently, import supports only the addition of top-level elements (not complex nested structures within a single imported block).
*   **Live Preview:** View a real-time preview of the page you're building in a modal window.
*   **HTML Export:** Generate and export clean HTML code corresponding to the layout created on the canvas.
*   **Vanilla JavaScript:** Written entirely in pure JavaScript, without dependencies on external JS frameworks (such as React, Vue, Angular, jQuery, etc.).

## Dependencies

*   **Bootstrap 5:** Used for the grid, UI components (modals, buttons, cards, etc.) and general styling.
*   **Bootstrap Icons:** Used for icons in the interface.
*   **Prism.js:** Used for HTML code syntax highlighting in the export modal.

## How It Works

1.  **Adding Components:** Select a component from the left sidebar (e.g. Heading, Paragraph, Image) and drag it into the canvas area on the right.
2.  **Editing:** Double-click on a component in the canvas or select it and click "Edit" to open its specific options (e.g. changing a heading level, a link's URL, an input's type).
3.  **Layout Configuration:** Click on the gear icon (⚙) to access settings and define the column structure of the main layout.
4.  **Import:** Use the "Import" button to paste HTML code. Recognised elements will be added to the canvas.
5.  **Preview:** Click on "Preview" to see how the final page will appear.
6.  **Export:** Click on "Export" to get the HTML code of the created page, ready to be copied.

## Current Limitations

*   During HTML import, only HTML elements that are direct children of the BODY tag or of the DIV with 'container' class are considered. Elements nested deeper are ignored.

---

_Developed by [Dario Rosina](https://github.com/dariorosina)_