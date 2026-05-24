🔗 [English version (CHANGELOG.md)](CHANGELOG.md)

# Changelog

Tutte le modifiche rilevanti apportate a questo progetto saranno documentate in questo file.

Il formato si basa su [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-05-24

### Changed

- Refactor del rendering dei componenti con un registry centrale, rimuovendo dal renderer la logica `switch` basata sul tipo.

- Spostata nel registry dei componenti la logica per trovare il target del doppio click e per dichiarare il supporto alla selezione automatica del testo, cosi' i nuovi tipi possono essere estesi aggiungendo metadati al registry invece di modificare handler condivisi.

- Migliorato il comportamento della selezione: cliccando un elemento editabile gia' selezionato, l'elemento resta selezionato per facilitare l'editing inline.

### Fixed

- Aggiunti controlli difensivi alla selezione testo differita per evitare focus o selezione su nodi DOM rimossi o sostituiti prima dell'esecuzione asincrona.

- Spostate le restrizioni sul click predefinito degli input nella definizione registry del componente input e aggiunti controlli piu' sicuri sui target degli eventi negli handler di editing.


## [1.0.2] - 2026-05-23

### Changed

- Refactor del flusso di gestione dello stage con una struttura basata su registry, centralizzando registrazione e recupero degli stage.

- Migliorata l'organizzazione della logica relativa allo stage per rendere piu' semplici manutenzione ed estensioni future.

## [1.0.1] - 2025-06-21

### Added

- Nuovo gestore dell'evento doppio click per i componenti nella sidebar per aggiungere in fondo al canvas il componente selezionato.

- Quando viene selezionato nel canvas un elemento Header, Paragraph, BUTTON o Anchor (link) seleziona in automatico tutto il testo editabile presente nell'elemento.

### Fixed

- Aggiunti i gestori di eventi all'elemento clonato di tipo INPUT (come già veniva fatto per tutti gli altri componenti).

- Quando un elemento input (di tipo: date, time, datetime-local, month, week, color e file) viene selezionato nel canvas, viene disabilitato il suo comportamento predefinito.


