# Agentic Toolkit

Agentic Toolkit is a VS Code extension that packages the Agentic Architecture Handbook workflow as a chat participant and context-menu actions.

## Features

- Chat participant: `@agentic`
- Slash commands: `/deliberate`, `/gauntlet`, `/darwin`, `/implement`, `/review`, `/fix`, `/chaos`, `/manifest`
- Context menu bridge commands:
  - Agentic: Run Gauntlet
  - Agentic: Orchestrate
  - Agentic: War Room
  - Agentic: Code Review
- Prompt loading strategy:
  1. Workspace override from `.github/prompts/*.prompt.md`
  2. Bundled default prompt from extension `prompts/` directory
- Project customization via `project-styles.md` at workspace root
- Optional artifact autosave via setting `agenticToolkit.autoSaveArtifacts`

## Usage

1. Open Chat and type `@agentic`.
2. Run a slash command, for example: `@agentic /manifest Build a secure feature flag system`.
3. Or right-click a file and use an Agentic context action to open chat with the matching command.
4. To persist command output automatically, enable `agenticToolkit.autoSaveArtifacts` in settings.

When autosave is enabled, command outputs are written to pipeline folders such as `.github/war-room/`, `.github/gauntlet/`, `.github/darwin/`, `.github/code-reviews/`, `.github/chaos/`, and `.github/manifests/`.

## Pipeline

`DRAFTING → RED_TEAMING → REFINING → APPROVED → IMPLEMENTING → COMPLETED`

Default flow:

1. `/manifest`
2. `/deliberate`
3. `/gauntlet`
4. `/darwin` (optional)
5. `/implement`
6. `/review`
7. `/fix`
8. `/chaos`

## Development

- Install dependencies: `npm install`
- Compile: `npm run compile`
- Watch mode: `npm run watch`
- Package VSIX: `npm run package`
- Debug: press `F5` in VS Code
