# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-06-21

### Added

- New double-click event handler for components in the sidebar to add the selected component to the bottom of the canvas.

- When a Header, Paragraph, BUTTON, or Anchor (link) element is selected on the canvas, it automatically selects all the editable text present in the element.

### Fixed

- Added event handlers to the cloned INPUT element (as was already done for all other components).

- When an input element (of type: date, time, datetime-local, month, week, color, and file) is selected on the canvas, its default behavior is disabled.


