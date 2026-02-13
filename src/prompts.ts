import * as vscode from 'vscode';
import { AGENTIC_COMMANDS, AgenticSlashCommand, PromptDefinition } from './types';
import { fileExists, readUtf8File, toWorkspaceUri } from './workspace';

function parseFrontmatter(raw: string): Omit<PromptDefinition, 'source'> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      name: 'unknown',
      body: raw
    };
  }

  const yaml = match[1];
  const body = match[2];
  const parsed: Record<string, string> = {};

  for (const line of yaml.split(/\r?\n/)) {
    const parts = line.split(':');
    if (parts.length < 2) {
      continue;
    }

    const key = parts[0].trim();
    const value = parts.slice(1).join(':').trim();
    parsed[key] = value;
  }

  return {
    name: parsed.name ?? 'unknown',
    description: parsed.description,
    model: parsed.model,
    agent: parsed.agent,
    body
  };
}

export class PromptLoader {
  constructor(private readonly extensionUri: vscode.Uri) {}

  async getPrompt(command: AgenticSlashCommand): Promise<PromptDefinition> {
    const workspaceUri = toWorkspaceUri(`.github/prompts/${command}.prompt.md`);
    if (workspaceUri && (await fileExists(workspaceUri))) {
      const text = await readUtf8File(workspaceUri);
      return {
        ...parseFrontmatter(text),
        source: 'workspace'
      };
    }

    const bundledUri = vscode.Uri.joinPath(this.extensionUri, 'prompts', `${command}.prompt.md`);
    const text = await readUtf8File(bundledUri);
    return {
      ...parseFrontmatter(text),
      source: 'bundled'
    };
  }

  async getProjectStyles(): Promise<string | undefined> {
    const stylesUri = toWorkspaceUri('project-styles.md');
    if (!stylesUri || !(await fileExists(stylesUri))) {
      return undefined;
    }

    return readUtf8File(stylesUri);
  }

  async getAvailablePrompts(): Promise<Record<AgenticSlashCommand, PromptDefinition>> {
    const entries = await Promise.all(
      AGENTIC_COMMANDS.map(async (command) => [command, await this.getPrompt(command)] as const)
    );

    return Object.fromEntries(entries) as Record<AgenticSlashCommand, PromptDefinition>;
  }
}
