# Design Specification: Interactive Terminal Website (v1.1)

This document outlines the design and functionality for a personal profile website with an interactive terminal interface. This revised version includes enhancements for a more complete and accessible initial launch.

## 1. Overview

The website will present a modern, sleek terminal interface as the primary method of user interaction. It will provide a unique and engaging way for visitors to learn about you. The core experience revolves around a command-line interface where users can type commands to display information, get fun facts, and even play a game.

## 2. Visual Design and User Experience (UX)

The goal is to emulate a modern terminal, but with a polished, web-native feel.

*   **Theme**: A dark theme is recommended for an authentic terminal look (e.g., dark gray or navy blue background, light text). We can also consider offering a light theme option.
*   **Font**: A monospaced font is essential. Good choices include 'Fira Code', 'Source Code Pro', 'Roboto Mono', or 'Menlo'.
*   **Cursor**: A blinking block or line cursor will be present, indicating the terminal is ready for input.
*   **Prompt**: The command prompt will be simple and clean, like `user@baijumeswani.github.io:~$`. We can add emojis for a fun touch, e.g., `💻 user@baijumeswani.github.io:~$`.
*   **Animations**: Command outputs will appear instantly, but we can add subtle fade-in or typing animations for a more dynamic feel.
*   **Responsiveness**: The terminal interface will be fully responsive and usable on devices of all sizes.

## 3. Core Terminal Functionality

*   **Input**: A text input field will be styled to look like part of the terminal. It will have focus by default.
*   **Output**: Command outputs will be appended to the terminal history, scrolling up as new commands are entered.
*   **Command History**: The up and down arrow keys will cycle through previously entered commands.
*   **Autocompletion**: Pressing the `Tab` key will attempt to autocomplete the current command.
*   **Error Handling**: If a user enters an unknown command, the terminal will display a helpful error message, e.g., `command not found: <command>. Type '?' for a list of available commands.`.
*   **Initial State**: On page load, a welcome banner will be displayed, followed by the output of the `?` command to immediately guide the user.

    **Welcome Banner Example:**
    ```
    Welcome to my interactive portfolio!
    Type '?' to see the list of available commands.
    ```

## 4. Command Reference

### 4.1. `?` or `help` - Help Command

*   **Description**: Displays a list of all available commands and a brief description of each.
*   **Aliases**: `help`
*   **Output Format**: A clean, aligned list.

    ```
    Available commands:

      about    - Learn more about me
      skills   - List my technical skills
      contact  - Display my contact information
      social   - Show links to my social media profiles
      fun      - Display a random fun fact
      play     - Play a game
      clear    - Clear the terminal screen
      ?        - Show this help message
    ```

### 4.2. `about` - About Me

*   **Description**: Shares details about you. The output will be paginated to mimic the `more` command.
*   **Content**: Can include text (bio, education, experience) and even ASCII art.
*   **Interaction**:
    *   The first "page" of content is displayed.
    *   A `--More--` prompt is shown at the bottom.
    *   Pressing `Enter` displays the next page.
    *   Pressing `q` exits the `about` command and returns to the main terminal prompt.

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
    Email: your.email@example.com
    ```
    *(Suggestion: The email can be a `mailto:` link to open the user's default email client.)*

### 4.5. `social` - Social Media

*   **Description**: Provides links to your social media profiles.
*   **Output Format**:
    ```
    GitHub:     https://github.com/your-username
    LinkedIn:   https://linkedin.com/in/your-username
    Twitter:    https://twitter.com/your-username
    ```
    *(Suggestion: These links should be clickable and open in a new tab.)*

### 4.6. `fun` - Fun Fact

*   **Description**: Displays a random fun fact.
*   **Data Source**: Fun facts will be stored in a simple JSON file, e.g., `funfacts.json`.
*   **Output**: A single fun fact is chosen at random and displayed. E.g., `💡 Fun Fact: A shrimp's heart is in its head.`

### 4.7. `play` - Play a Game

*   **Description**: Launches an interactive, terminal-based game.
*   **Game**: A simplified version of "Crazy Climber".
*   **Gameplay**:
    *   The game "screen" will be rendered within the terminal view, using characters and colors to draw the game elements.
    *   The player character (`@`) will climb a building (represented by characters like `|` and `-`).
    *   Obstacles (e.g., falling objects `*`, closing windows `[ ]`) will appear.
    *   **Controls**: Use `Arrow Keys` or `W`, `A`, `S`, `D` for movement.
    *   The goal is to climb as high as possible without getting hit.
*   **Exiting**: Pressing `Control+C` will stop the game and return the user to the terminal prompt.

## 5. Accessibility (A11y)

*   **Semantic HTML**: Use semantic HTML5 elements (`<main>`, `<section>`, `<nav>`) to structure the content, even though it looks like a terminal.
*   **ARIA Roles**: Use ARIA (Accessible Rich Internet Applications) roles to define the terminal interface for screen readers. For example, the command history can be a `role="log"`.
*   **Keyboard Navigation**: Ensure all interactive elements are reachable and operable via the keyboard.
*   **Color Contrast**: Ensure that text colors have sufficient contrast against the background to be readable by people with low vision.

## 6. SEO and Metadata

*   **Title Tag**: The `<title>` of the page will be descriptive (e.g., "Your Name - Interactive Portfolio").
*   **Meta Description**: A meta description will be provided to summarize the page content for search engines.
*   **Hidden Content**: The core content (about, skills, contact) will be present in the initial HTML (perhaps hidden visually but available to screen readers and search engines) to ensure the site is indexable.

## 7. Mobile Experience

*   **Viewport**: The viewport meta tag will be correctly set to ensure the site scales properly on mobile devices.
*   **Touch Input**: The terminal input will be easy to tap and focus. We will ensure the on-screen keyboard does not obscure the input area.
*   **Game Controls**: For the game on mobile, we can consider adding on-screen buttons for movement if keyboard input is not available.

## 8. Technology Stack

*   **Frontend Framework**: **React** (with **Vite**).
*   **Styling**: **Styled-components** or **Tailwind CSS**.
*   **State Management**: React's built-in hooks (`useState`, `useReducer`, `useContext`).

## 9. Project Structure (Example for a React App)

```
/
├── public/
│   ├── index.html
│   └── funfacts.json
├── src/
│   ├── components/
│   │   ├── Terminal.js
│   │   ├── Input.js
│   │   ├── Output.js
│   │   └── Game.js
│   ├── styles/
│   │   └── global.css
│   ├── hooks/
│   │   └── useTerminal.js
│   ├── data/
│   │   ├── about.js
│   │   └── skills.js
│   ├── App.js
│   └── index.js
└── docs/
    └── design_spec.md
```

## 10. Future Enhancements

*   **Themes**: Allow users to switch between different color themes.
*   **"File System"**: Simulate a simple file system (`ls`, `cat`).
*   **API Integration**: Pull in recent blog posts or project updates.
*   **Sound Effects**: Add subtle sound effects for commands and game actions.

This revised specification provides a more robust foundation for the initial build.