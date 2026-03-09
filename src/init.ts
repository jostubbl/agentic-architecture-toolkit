import * as vscode from 'vscode';
import { ensureDirectory } from './artifacts';
import { AGENTIC_COMMANDS } from './types';
import { fileExists, toWorkspaceUri } from './workspace';

const PROJECT_STYLES_TEMPLATE = `# Project Styles

Fill in your project-specific constraints. The Agentic Toolkit reads this file and enforces these rules across all pipeline prompts.

## Language & Runtime

<!-- e.g., TypeScript 5.x, Node.js 20 -->

## Frameworks & Libraries

<!-- List allowed and preferred libraries, and any that are disallowed -->

## Error Handling

<!-- Pattern used in this project: throw, Result<T, E>, error codes, etc. -->

## Naming Conventions

<!-- e.g., camelCase for variables, PascalCase for types, kebab-case for files -->

## Code Style

<!-- Tabs vs spaces, line length, quote style, etc. -->

## Security Requirements

<!-- Sensitive data handling, authentication patterns, authorization rules -->

## Testing Framework

<!-- e.g., Jest, Vitest, pytest, Go test, etc. -->

## Build Toolchain

<!-- e.g., esbuild, webpack, cmake, cargo, etc. -->

## File Structure

<!-- Key directories and their purpose -->
`;

const MANIFEST_TEMPLATE = `# FEATURE MANIFEST
# SYSTEM INSTRUCTION: Read the 'Status' field. Execute instructions for that state. Update 'Status' when done.
Status: DRAFTING

## 1. Executive Summary

(Describe the feature here)

## 2. Architecture & Design

(AI Architect fills this during DRAFTING)

## 3. Threat Model & Risks

(AI Red Team fills this during RED_TEAMING)

## 4. Refinements

(Engineer fixes design based on risks during REFINING)

## 5. Implementation Plan

(Builder creates detailed plan during APPROVED → IMPLEMENTING)

## 6. Completion Notes

(Final summary during COMPLETED)
`;

interface InitResult {
  created: string[];
  skipped: string[];
}

async function writeIfAbsent(relativePath: string, bytes: Uint8Array, result: InitResult): Promise<void> {
  const destUri = toWorkspaceUri(relativePath);
  if (!destUri) {
    return;
  }

  if (await fileExists(destUri)) {
    result.skipped.push(relativePath);
    return;
  }

  const parentPath = relativePath.split('/').slice(0, -1).join('/');
  if (parentPath) {
    await ensureDirectory(parentPath);
  }

  await vscode.workspace.fs.writeFile(destUri, bytes);
  result.created.push(relativePath);
}

export async function initSpecKit(extensionUri: vscode.Uri): Promise<void> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showErrorMessage('Agentic: No workspace folder is open. Open a folder first.');
    return;
  }

  const result: InitResult = { created: [], skipped: [] };

  for (const command of AGENTIC_COMMANDS) {
    const filename = `${command}.prompt.md`;
    const srcUri = vscode.Uri.joinPath(extensionUri, 'prompts', filename);
    try {
      const bytes = await vscode.workspace.fs.readFile(srcUri);
      await writeIfAbsent(`.github/prompts/${filename}`, bytes, result);
    } catch (err) {
      console.error(`[agentic] Failed to read bundled prompt ${filename}: ${err}`);
    }
  }

  const instructionsSrc = vscode.Uri.joinPath(extensionUri, '.github', 'copilot-instructions.md');
  try {
    const bytes = await vscode.workspace.fs.readFile(instructionsSrc);
    await writeIfAbsent('.github/copilot-instructions.md', bytes, result);
  } catch (err) {
    console.error(`[agentic] Failed to read bundled copilot-instructions.md: ${err}`);
  }

  await writeIfAbsent('project-styles.md', new TextEncoder().encode(PROJECT_STYLES_TEMPLATE), result);
  await writeIfAbsent('manifest.md', new TextEncoder().encode(MANIFEST_TEMPLATE), result);

  const parts: string[] = [];
  if (result.created.length > 0) {
    parts.push(`Created ${result.created.length} file(s).`);
  }
  if (result.skipped.length > 0) {
    parts.push(`Skipped ${result.skipped.length} existing file(s).`);
  }

  if (parts.length === 0) {
    vscode.window.showInformationMessage('Agentic: Spec Kit is already up to date. Nothing to create.');
  } else {
    vscode.window.showInformationMessage(`Agentic Spec Kit initialized. ${parts.join(' ')}`);
  }
}
