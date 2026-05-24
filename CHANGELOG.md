# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-05-24

### Changed

- Refactored component rendering to use a central component registry, removing type-based switch logic from the renderer.

- Moved double-click target lookup and automatic text-selection support into the component registry, so new component types can be extended by adding registry metadata instead of changing shared handlers.

- Improved component selection behavior so clicking an already selected editable element keeps it selected for inline editing.

### Fixed

- Added defensive checks around deferred text selection to avoid focusing or selecting DOM nodes that were removed or replaced before the async selection step runs.

- Moved input default-click restrictions into the input component registry definition and added safer event-target checks in edit handlers.


## [1.0.2] - 2026-05-23

### Changed

- Refactored the stage management flow to use a registry-based structure, centralizing stage registration and lookup.

- Improved the organization of stage-related logic to make future extensions and maintenance easier.

## [1.0.1] - 2025-06-21

### Added

- New double-click event handler for components in the sidebar to add the selected component to the bottom of the canvas.

- When a Header, Paragraph, BUTTON, or Anchor (link) element is selected on the canvas, it automatically selects all the editable text present in the element.

### Fixed

- Added event handlers to the cloned INPUT element (as was already done for all other components).

- When an input element (of type: date, time, datetime-local, month, week, color, and file) is selected on the canvas, its default behavior is disabled.


