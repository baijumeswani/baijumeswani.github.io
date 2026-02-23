# Design Specification: Interactive Terminal Website (v2.0)

This document outlines the design and functionality for a personal profile website with an interactive terminal interface. This revision adds a fully specified game design, expanded command set, modern TypeScript-first tech stack, deployment pipeline, testing strategy, and hardened accessibility, SEO, and security posture.

## 1. Overview

The website will present a modern, sleek terminal interface as the primary method of user interaction. It will provide a unique and engaging way for visitors to learn about you. The core experience revolves around a command-line interface where users can type commands to display information, get fun facts, and even play a game.

## 2. Visual Design and User Experience (UX)

The goal is to emulate a modern terminal, but with a polished, web-native feel.

*   **Theme**: Ships with a **dark** theme (dark gray / navy blue background, light text) and a **light** theme. The default is determined by the user's OS preference via `prefers-color-scheme`, and can be toggled at runtime with the `theme` command (see §4.9). The chosen preference is persisted in `localStorage`.
*   **Font**: A monospaced font is essential. Good choices include 'Fira Code', 'Source Code Pro', 'Roboto Mono', or 'Menlo'.
*   **Cursor**: A blinking block or line cursor will be present, indicating the terminal is ready for input.
*   **Prompt**: The command prompt will be simple and clean, like `user@baijumeswani.github.io:~$`. We can add emojis for a fun touch, e.g., `💻 user@baijumeswani.github.io:~$`.
*   **Animations**: Command outputs will appear instantly, but we can add subtle fade-in or typing animations for a more dynamic feel. All animations must respect the `prefers-reduced-motion` media query — when the user prefers reduced motion, animations are disabled.
*   **Responsiveness**: The terminal interface will be fully responsive and usable on devices of all sizes. Use CSS `dvh` units for viewport height to handle mobile browser chrome correctly, and prefer `container queries` for responsive terminal sizing over media queries alone.

## 3. Core Terminal Functionality

*   **Input**: A text input field will be styled to look like part of the terminal. It will have focus by default.
*   **Output**: Command outputs will be appended to the terminal history, scrolling up as new commands are entered.
*   **Command History**: The up and down arrow keys will cycle through previously entered commands.
*   **Autocompletion**: Pressing the `Tab` key will attempt to autocomplete the current command.
    *   If exactly one command matches, it is completed in-place.
    *   If multiple commands match (e.g., `s` → `skills`, `social`), all matches are displayed below the prompt.
    *   If no commands match, nothing happens (no visual flash or error).
    *   As the user types, a ghost-text suggestion (dimmed, non-selectable) of the closest matching command appears inline, similar to the fish shell.
*   **Keyboard Shortcuts**:
    *   `Ctrl+C` — cancel the current input line (and exit the game if running).
    *   `Ctrl+L` — clear the terminal (equivalent to `clear`).
    *   `Escape` — exit any modal state (game, `about` pagination).
*   **Error Handling**: If a user enters an unknown command, the terminal will display a helpful error message, e.g., `command not found: <command>. Type '?' for a list of available commands.`.
*   **Copy / Paste**: Users can select and copy any text in the terminal output (contact info, social links, etc.). Standard browser copy behavior must not be broken by the custom input handling.
*   **Initial State**: On page load, the following sequence is displayed:
    1.  An ASCII art banner with the site owner's name.
    2.  A welcome message.
    3.  The full output of the `?` command, so users immediately see available commands.
    4.  After 5 seconds of inactivity, a subtle hint fades in: `Try typing "about" to get started…`

    **Welcome Banner Example:**
    ```
     ____        _   _         __  __
    | __ )  __ _(_) (_)_   _  |  \/  | ___  _____      ____ _ _ __ (_)
    |  _ \ / _` | | | | | | | | |\/| |/ _ \/ __\ \ /\ / / _` | '_ \| |
    | |_) | (_| | | | | |_| | | |  | |  __/\__ \\ V  V / (_| | | | | |
    |____/ \__,_|_|_/ |\__,_| |_|  |_|\___||___/ \_/\_/ \__,_|_| |_|_|
                  |__/
    Welcome to my interactive website!ß

    Available commands:

      about      - Learn more about me
      projects   - View my projects and demos
      experience - See my work history
      skills     - List my technical skills
      contact    - Display my contact information
      social     - Show links to my social media profiles
      fun        - Display a random fun fact
      play       - Play a game
      theme      - Toggle dark / light theme
      history    - Show command history
      clear      - Clear the terminal screen
      ?          - Show this help message
    ```

## 4. Command Reference

### 4.1. `?` or `help` - Help Command

*   **Description**: Displays a list of all available commands and a brief description of each.
*   **Aliases**: `help`
*   **Output Format**: A clean, aligned list. Each command name is rendered as a clickable element that executes the command when clicked.

    ```
    Available commands:

      about      - Learn more about me
      projects   - View my projects and demos
      experience - See my work history
      skills     - List my technical skills
      contact    - Display my contact information
      social     - Show links to my social media profiles
      fun        - Display a random fun fact
      play       - Play a game
      theme      - Toggle dark / light theme
      history    - Show command history
      clear      - Clear the terminal screen
      ?          - Show this help message
    ```

### 4.2. `about` - About Me

*   **Description**: Shares a personal bio / introduction. Paginated to mimic the `more` command.
*   **Content**: A concise bio and optional ASCII art portrait. Education and work history are covered by the dedicated `experience` command.
*   **Pagination**:
    *   Content is split into pages. Page size is dynamically calculated based on the visible terminal height (in character rows).
    *   A `--More-- (page X/Y)` prompt is shown at the bottom.
    *   Pressing `Enter` or `Space` displays the next page.
    *   Pressing `q` or `Escape` exits pagination and returns to the main prompt.
    *   On window resize mid-pagination, the page size recalculates for the next page.

### 4.3. `skills` - Skills

*   **Description**: Lists your technical skills, grouped by category.
*   **Output Format**:
    ```
    Languages:  JavaScript, Python, HTML/CSS
    Frameworks: React, Node.js, Express
    Databases:  MongoDB, PostgreSQL
    Tools:      Git, Docker, Webpack
    ```

### 4.4. `contact` - Contact Information

*   **Description**: Displays your contact information.
*   **Output Format**:
    ```
    📧 Email: your.email@example.com  [click to copy]
    ```
*   **Email Obfuscation**: The raw email address must not appear in the initial HTML or JavaScript source to prevent bot scraping. It should be assembled at runtime (e.g., reverse a string, decode base64, or split across variables).
*   **Interaction**: The email is rendered as a clickable `mailto:` link. A "click to copy" button next to it copies the address to the clipboard and briefly shows a ✅ confirmation.

### 4.5. `social` - Social Media

*   **Description**: Provides links to your social media profiles.
*   **Output Format**:
    ```
    GitHub:     https://github.com/your-username      [↗]
    LinkedIn:   https://linkedin.com/in/your-username  [↗]
    Twitter:    https://twitter.com/your-username      [↗]
    ```
*   **Interaction**: Each link is clickable, opens in a new tab with `rel="noopener noreferrer"`, and has a copy-to-clipboard affordance.

### 4.6. `fun` - Fun Fact

*   **Description**: Displays a random fun fact.
*   **Data Source**: Fun facts are stored as a TypeScript module at `src/data/funFacts.ts` (a simple `string[]` export). This avoids an unnecessary network fetch compared to a JSON file in `public/`.
*   **Output**: A single fun fact is chosen at random and displayed. E.g., `💡 Fun Fact: A shrimp's heart is in its head.`
*   **Deduplication**: The terminal tracks recently shown facts within the session and avoids repeating them until all facts have been shown.

### 4.7. `play` - Play a Game

*   **Description**: Launches an interactive, terminal-based game.
*   **Game**: A simplified version of "Crazy Climber".

#### 4.7.1. Rendering

*   The game is rendered as **ASCII characters** inside a `<pre>` block within the terminal view. No `<canvas>` — keeping it pure terminal aesthetic.
*   The game viewport is **40 columns × 24 rows** (scaled to fit the terminal width; on narrow screens it shrinks proportionally).
*   Characters are color-coded using inline `<span>` styles:
    *   Player `@` — green.
    *   Building walls `|` — gray.
    *   Ledges / floors `───` — white.
    *   Windows `[ ]` — cyan (open) / red (closing).
    *   Falling objects `*` — yellow.
    *   Score/HUD — bold white.

#### 4.7.2. Game Loop

*   Driven by `requestAnimationFrame` with a **delta-time accumulator** targeting **10 simulation ticks per second** (grid-based movement).
*   Rendering runs at the display's native refresh rate; simulation is decoupled.

#### 4.7.3. Game States

```
  [Start Screen] ──Enter──▶ [Playing] ──hit──▶ [Game Over]
       ▲                      │    ▲               │
       │                   Esc/P   │            Enter
       │                      ▼    │               │
       │                   [Paused]                 │
       └────────────────────────────────────────────┘
```

*   **Start Screen**: Shows controls and the current high score. Press `Enter` to begin.
*   **Playing**: The active game.
*   **Paused**: Pressing `Escape` or `P` pauses. Game state is frozen; "PAUSED" overlay is shown. Press again to resume.
*   **Game Over**: Shows final score, high score, and "Press Enter to retry or Q to quit."

#### 4.7.4. Player Movement

*   **Grid-based**: The player moves exactly one cell per input.
*   **Controls**: `Arrow Keys` or `W` / `A` / `S` / `D`.
*   The player can move **up, down, left, right** (no diagonal).
*   The player cannot move through walls or off-screen.

#### 4.7.5. Camera / Scrolling

*   The building scrolls **downward** as the player climbs. The player is kept in the **lower third** of the viewport.
*   Scrolling is smooth (per-tick, one row at a time when the player crosses the threshold).

#### 4.7.6. Obstacles & Difficulty

| Obstacle | Character | Behavior | First appears |
|---|---|---|---|
| Falling debris | `*` | Falls straight down, 1 cell/tick | Floor 1 |
| Closing window | `[X]` | Window snaps shut for 3 ticks, hurts if player is inside | Floor 3 |
| Bird | `>` or `<` | Flies horizontally across the screen | Floor 5 |

*   **Spawn rules**: Obstacles spawn randomly with increasing frequency. Base interval is **every 20 ticks**, decreasing by **1 tick per 5 floors** (minimum 8 ticks).
*   **Collision**: The player occupies a single cell. If an obstacle occupies the same cell on any tick, the player is hit → Game Over.

#### 4.7.7. Scoring

*   **+10 points** per floor climbed.
*   **+5 points** per obstacle successfully dodged (passes the player's row without collision).
*   Displayed in a HUD bar at the top of the game viewport: `Score: 150  |  Floor: 12  |  High: 300`

#### 4.7.8. High Score Persistence

*   The high score is stored in `localStorage` under the key `terminal-climber-highscore`.
*   Displayed on the start screen and game-over screen.

#### 4.7.9. ASCII Mockup (Sample Frame)

```
 Score: 80  |  Floor: 6  |  High: 200
 ────────────────────────────────────────
 |          *                          |
 |                          >          |
 |    [ ]         [ ]         [ ]      |
 |────────────────────────────────────-|
 |                                     |
 |    [ ]    @    [ ]         [X]      |
 |─────────────────────────────────────|
 |                                     |
```

#### 4.7.10. Mobile Controls

*   On touch devices, a translucent **D-pad overlay** appears in the bottom-right corner with ▲ ▼ ◀ ▶ buttons.
*   Buttons have a minimum touch target of **44 × 44 px** per WCAG guidelines.
*   Swipe gestures are **not** used (too imprecise for grid movement).

#### 4.7.11. Exiting

*   Pressing `Ctrl+C`, `Escape` (from the pause screen), or `Q` (from the game-over screen) returns the user to the terminal prompt.

### 4.8. `projects` - Projects

*   **Description**: Lists notable projects with a short description and links.
*   **Data Source**: `src/data/projects.ts` — an array of `{ name, description, repoUrl, demoUrl? }` objects.
*   **Output Format**:
    ```
    ┌─────────────────────────────────────────────────┐
    │ 📂 Project Name                                 │
    │    Short description of the project.            │
    │    Repo: https://github.com/user/project  [↗]  │
    │    Demo: https://project.example.com      [↗]  │
    └─────────────────────────────────────────────────┘
    ```
*   Links open in a new tab with `rel="noopener noreferrer"`.

### 4.9. `experience` - Work Experience

*   **Description**: Displays a chronological work history timeline.
*   **Data Source**: `src/data/experience.ts` — an array of `{ title, company, period, highlights: string[] }` objects.
*   **Output Format**:
    ```
    ── 2024 – Present ─────────────────────────
    Senior Engineer @ Company Inc.
      • Led migration to microservices
      • Reduced build times by 40%

    ── 2021 – 2024 ────────────────────────────
    Software Engineer @ Startup Co.
      • Built real-time data pipeline
    ```
*   Paginated if the list exceeds the terminal viewport height.

### 4.10. `theme` - Toggle Theme

*   **Description**: Toggles between dark and light themes.
*   **Output**: `🎨 Theme switched to <light|dark>.`
*   The preference is saved to `localStorage` and applied immediately. Theme switching uses the **View Transitions API** for a smooth crossfade (falls back to instant swap in unsupported browsers).

### 4.11. `history` - Command History

*   **Description**: Displays a numbered list of all commands entered in the current session.
*   **Output Format**:
    ```
      1  about
      2  skills
      3  play
      4  history
    ```

### 4.12. `clear` - Clear Terminal

*   **Description**: Clears all output from the terminal.
*   **Behavior**: The welcome banner and help listing are **not** re-displayed. The terminal is left with only a fresh prompt. Equivalent to `Ctrl+L`.

---

## 5. Accessibility (A11y)

*   **Semantic HTML**: Use semantic HTML5 elements (`<main>`, `<section>`, `<nav>`) to structure the content, even though it looks like a terminal.
*   **ARIA Roles & Live Regions**:
    *   The terminal output area uses `role="log"` with `aria-live="polite"` so screen readers announce new command output without interrupting the user.
    *   The input field has an `aria-label="Terminal command input"`.
    *   The game area uses `role="application"` to signal that custom keyboard handling is in effect.
*   **Focus Management**: After a command executes, focus returns to the input field. When entering the game or `about` pagination, focus moves to the game/pagination container. On exit, focus returns to the input.
*   **Skip Link**: A visually hidden skip link at the top of the page allows assistive-technology users to jump directly to the terminal input.
*   **Keyboard Navigation**: Ensure all interactive elements are reachable and operable via the keyboard.
*   **Keyboard Trap Prevention**: The terminal captures keyboard input, but users must always be able to `Tab` out of the terminal to reach browser UI and any external links rendered in command output.
*   **Focus Indicators**: Custom focus styles (e.g., a visible outline or highlight) are provided for all interactive elements. Default browser focus rings are preserved or enhanced — never removed.
*   **Color Contrast**: All text colors meet **WCAG AA** contrast ratios (≥ 4.5:1 for normal text, ≥ 3:1 for large text) in both dark and light themes.
*   **Reduced Motion**: All animations respect the `prefers-reduced-motion: reduce` media query. When active, typing animations, fade-ins, and the game's visual effects are disabled or simplified.
*   **Game Accessibility**: The Crazy Climber game is inherently visual and not fully accessible to screen-reader users. A notice is displayed when the game starts: `"Note: This game requires visual interaction and keyboard/touch controls."` The rest of the site remains fully accessible.

## 6. SEO, Metadata, and Social Sharing

*   **Static-Site Generation (SSG)**: The Vite build produces fully pre-rendered HTML at build time (using `vite-plugin-ssg` or an Astro wrapper). All textual content (about, skills, projects, experience, contact) is present in the initial HTML as semantic elements, which are then progressively enhanced into the terminal UI via JavaScript. This avoids hidden-content penalties and ensures the site is fully indexable.
*   **Title Tag**: `<title>Baiju Meswani</title>`.
*   **Meta Description**: `<meta name="description" content="Software engineer portfolio presented as an interactive terminal. Explore projects, skills, and experience.">`.
*   **Open Graph & Twitter Card Tags**:
    ```html
    <meta property="og:title" content="Baiju Meswani" />
    <meta property="og:description" content="An interactive terminal-based website." />
    <meta property="og:image" content="https://baijumeswani.github.io/og-image.png" />
    <meta property="og:url" content="https://baijumeswani.github.io" />
    <meta name="twitter:card" content="summary_large_image" />
    ```
    A 1200×630 px OG image (`public/og-image.png`) showing a screenshot of the terminal is included.
*   **Structured Data (JSON-LD)**: A `Person` schema is embedded in the page `<head>`:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Baiju Meswani",
      "url": "https://baijumeswani.github.io",
      "sameAs": [
        "https://github.com/baijumeswani",
        "https://linkedin.com/in/baijumeswani"
      ]
    }
    ```
*   **`robots.txt`**: Allows all crawlers. Located at `public/robots.txt`.
*   **`sitemap.xml`**: Auto-generated at build time. Located at `public/sitemap.xml`.
*   **Favicon & Web App Manifest**: A `favicon.ico`, `apple-touch-icon.png`, and `manifest.json` (PWA-ready) are included in `public/`.

## 7. Mobile Experience

*   **Viewport**: The viewport meta tag is set to `<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">` to handle mobile browser chrome and virtual keyboards correctly.
*   **Height Units**: Use `dvh` (dynamic viewport height) instead of `vh` to avoid the 100vh overflow bug on mobile browsers.
*   **Touch Input**: The terminal input is easy to tap and focus. When the on-screen keyboard opens, the page scrolls to keep the input field visible above the keyboard.
*   **Auto-Scroll**: After every command output, the terminal auto-scrolls to the bottom so the latest output and prompt are always visible.
*   **Command History Gestures**: Swiping **up** / **down** on the terminal output area cycles through command history (equivalent to arrow keys).
*   **Game Controls**: See §4.7.10 — a translucent D-pad overlay with ▲ ▼ ◀ ▶ buttons appears on touch devices. Buttons meet the 44×44 px minimum touch target (WCAG).

## 8. Technology Stack

*   **Language**: **TypeScript** (strict mode). All source files use `.ts` / `.tsx` extensions.
*   **Frontend Framework**: **React 19+** (with **Vite 6+**).
*   **Styling**: **Tailwind CSS v4** — chosen for its utility-first approach, zero-runtime overhead, and ease of theming via CSS custom properties.
*   **State Management**: React's built-in hooks (`useState`, `useReducer`, `useContext`). Terminal state is modeled with `useReducer` using a typed action union:
    *   `EXECUTE_COMMAND`, `CLEAR`, `NAVIGATE_HISTORY`, `SET_INPUT`, `SET_THEME`, `ENTER_GAME`, `EXIT_GAME`.
*   **Command Architecture**: Commands are registered in a `CommandRegistry` (`Map<string, CommandHandler>`). Each `CommandHandler` is a function:
    ```ts
    type CommandHandler = (args: string[], ctx: TerminalContext) => CommandOutput;
    ```
    Adding a new command requires only adding an entry to the registry — no switch/if-else chains.
*   **Terminal Library (optional)**: Consider **xterm.js** for authentic terminal behavior (scrollback, ANSI codes, cursor movement). Evaluate whether the added bundle size (~200 KB) is justified vs. a lighter custom implementation.
*   **Package Manager**: **pnpm** (faster installs, strict dependency resolution).
*   **Linting & Formatting**: **ESLint** (flat config) + **Prettier**. Enforced via **Husky** pre-commit hooks and **lint-staged**.
*   **Testing**:
    *   **Unit / Integration**: **Vitest** + **@testing-library/react**.
    *   **End-to-End**: **Playwright** (test critical flows: type command → see output, play game → game over, theme toggle).
    *   **Accessibility Audit**: **axe-core** integrated into Vitest tests.
*   **Deployment**: GitHub Pages via a **GitHub Actions** workflow:
    1.  On push to `main`, run `pnpm install && pnpm build`.
    2.  Deploy the `dist/` folder to the `gh-pages` branch.
    3.  Vite `base` config is set to `'/'` (custom domain / user site).
*   **Analytics (optional)**: **Plausible** or **Umami** — privacy-respecting, no-cookie analytics. Script loaded asynchronously.

## 9. Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions: build → deploy to gh-pages
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── og-image.png              # 1200×630 Open Graph image
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt
│   ├── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Terminal.tsx
│   │   ├── Input.tsx
│   │   ├── Output.tsx
│   │   ├── Game.tsx
│   │   ├── GameControls.tsx      # Mobile D-pad overlay
│   │   ├── WelcomeBanner.tsx
│   │   └── SkipLink.tsx          # Hidden skip-to-input link
│   ├── commands/
│   │   ├── registry.ts           # CommandRegistry map
│   │   ├── about.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── contact.ts
│   │   ├── social.ts
│   │   ├── fun.ts
│   │   ├── play.ts
│   │   ├── theme.ts
│   │   ├── history.ts
│   │   ├── clear.ts
│   │   └── help.ts
│   ├── hooks/
│   │   ├── useTerminal.ts        # Terminal reducer + dispatch
│   │   ├── useCommandHistory.ts
│   │   ├── useGameLoop.ts
│   │   └── useTheme.ts
│   ├── data/
│   │   ├── about.ts
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── funFacts.ts           # string[] (no network fetch)
│   │   └── social.ts
│   ├── types/
│   │   ├── terminal.ts           # TerminalState, TerminalAction, CommandOutput
│   │   ├── commands.ts           # CommandHandler, CommandRegistry
│   │   └── game.ts               # GameState, Obstacle, Player
│   ├── styles/
│   │   └── global.css            # Tailwind directives + CSS custom properties
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   │   ├── commands.test.ts
│   │   └── useTerminal.test.ts
│   ├── integration/
│   │   └── terminal.test.tsx
│   └── e2e/
│       ├── commands.spec.ts      # Playwright
│       └── game.spec.ts
├── docs/
│   └── design_spec.md
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## 10. Security

*   **Input Sanitization**: All user input is rendered as **plain text** — never injected as raw HTML. React's default JSX escaping handles this, but no use of `dangerouslySetInnerHTML` is permitted for user-supplied content.
*   **Content Security Policy (CSP)**: A strict CSP is set via a `<meta>` tag (GitHub Pages does not support custom headers):
    ```html
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';">
    ```
*   **External Links**: All links that open in a new tab include `rel="noopener noreferrer"`.
*   **Email Obfuscation**: See §4.4. The email address is not present as a plain string in the HTML source or JS bundle.
*   **Subresource Integrity (SRI)**: If any external CDN assets are used (e.g., fonts), they include `integrity` and `crossorigin` attributes.
*   **Dependencies**: `pnpm audit` is run in CI. Renovate or Dependabot is configured for automated dependency updates.

## 11. Performance

*   **Bundle Size Budget**: The production JS bundle must be ≤ **150 KB gzipped** (excluding optional xterm.js).
*   **Core Web Vitals Targets**: LCP < 2.5s, FID < 100ms, CLS < 0.1.
*   **Lighthouse Score**: Target ≥ **95** on Performance, Accessibility, Best Practices, and SEO.
*   **Font Loading**: Monospace fonts are loaded with `font-display: swap` and preloaded via `<link rel="preload">`.
*   **Code Splitting**: The game module (`Game.tsx` and `useGameLoop.ts`) is **lazy-loaded** via `React.lazy()` — it is only fetched when the user runs the `play` command.

## 12. Future Enhancements

*   **"File System"**: Simulate a simple file system (`ls`, `cd`, `cat`).
*   **API Integration**: Pull in recent blog posts or GitHub activity via the GitHub API.
*   **Sound Effects**: Add subtle sound effects for key presses, command execution, and game events.
*   **Additional Themes**: Offer themed color schemes beyond dark/light (e.g., Solarized, Monokai, Dracula).
*   **PWA Offline Support**: Add a service worker for full offline capability.
*   **Multiplayer / Leaderboard**: A global high-score leaderboard for the game (requires a backend).

This specification provides a comprehensive foundation for the initial build, covering functionality, architecture, deployment, testing, accessibility, and security.