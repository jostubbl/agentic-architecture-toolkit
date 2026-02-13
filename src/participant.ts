import * as vscode from 'vscode';
import { writeArtifact } from './artifacts';
import { getActiveFileContext, getManifestContext, getPipelineArtifactContext } from './context';
import { PromptLoader } from './prompts';
import { AGENTIC_COMMANDS, AgenticSlashCommand } from './types';
import { toWorkspaceUri } from './workspace';

export interface ParticipantState {
  lastCommand?: AgenticSlashCommand;
}

function toSlashCommand(command: string | undefined): AgenticSlashCommand | undefined {
  if (!command) {
    return undefined;
  }

  if (AGENTIC_COMMANDS.includes(command as AgenticSlashCommand)) {
    return command as AgenticSlashCommand;
  }

  return undefined;
}

function nextCommand(command: AgenticSlashCommand): AgenticSlashCommand | undefined {
  const order: AgenticSlashCommand[] = [
    'manifest',
    'deliberate',
    'gauntlet',
    'darwin',
    'implement',
    'review',
    'fix',
    'chaos'
  ];

  const index = order.indexOf(command);
  if (index < 0 || index === order.length - 1) {
    return undefined;
  }

  return order[index + 1];
}

function timeStamp(): string {
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function createSessionSlug(input: string): string {
  const base = input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50);
  return base || `session-${timeStamp()}`;
}

function artifactPathFor(command: AgenticSlashCommand, userInput: string): string {
  const slug = createSessionSlug(userInput);
  switch (command) {
    case 'deliberate':
      return `.github/war-room/${slug}/SUMMARY.md`;
    case 'gauntlet':
      return `.github/gauntlet/${slug}/threat-matrix.md`;
    case 'darwin':
      return `.github/darwin/${slug}/comparison.md`;
    case 'implement':
      return `.github/war-room/${slug}/implementation-log.md`;
    case 'review':
      return `.github/code-reviews/SUMMARY-${timeStamp()}.md`;
    case 'fix':
      return `.github/code-reviews/fix-log-${timeStamp()}.md`;
    case 'chaos':
      return `.github/chaos/REPORT-${timeStamp()}.md`;
    case 'manifest':
      return `.github/manifests/${slug}.md`;
    default:
      return `.github/manifests/${slug}.md`;
  }
}

async function getCommandContext(command: AgenticSlashCommand): Promise<string[]> {
  const contexts: Array<string | undefined> = [];

  const active = await getActiveFileContext();
  contexts.push(active);

  if (command === 'manifest' || command === 'implement') {
    contexts.push(await getManifestContext());
  }

  if (command === 'gauntlet' || command === 'darwin' || command === 'implement' || command === 'review' || command === 'fix' || command === 'chaos') {
    contexts.push(await getPipelineArtifactContext());
  }

  return contexts.filter((entry): entry is string => Boolean(entry));
}

export function createAgenticHandler(loader: PromptLoader, state: ParticipantState): vscode.ChatRequestHandler {
  return async (request, _context, stream, token) => {
    const command = toSlashCommand(request.command) ?? 'manifest';
    state.lastCommand = command;

    stream.progress(`Preparing ${command} pipeline context...`);

    const prompt = await loader.getPrompt(command);
    const projectStyles = await loader.getProjectStyles();
    const commandContext = await getCommandContext(command);

    const userInput = request.prompt?.trim() || 'No additional user input provided.';
    const autoSaveArtifacts = vscode.workspace.getConfiguration('agenticToolkit').get<boolean>('autoSaveArtifacts', false);

    const assembledPrompt = [
      `ROLE PROMPT (${command}) [source=${prompt.source}]`,
      prompt.body,
      projectStyles ? `PROJECT STYLES\n${projectStyles}` : 'PROJECT STYLES\nNo project-styles.md present. Infer conventions from repo.',
      commandContext.length ? `WORKSPACE CONTEXT\n${commandContext.join('\n\n---\n\n')}` : 'WORKSPACE CONTEXT\nNo additional workspace artifacts found yet.',
      `USER REQUEST\n${userInput}`
    ].join('\n\n====================\n\n');

    const messages = [vscode.LanguageModelChatMessage.User(assembledPrompt)];
    const response = await request.model.sendRequest(messages, {}, token);
    let fullText = '';

    for await (const chunk of response.text) {
      fullText += chunk;
      stream.markdown(chunk);
    }

    let artifactPath: string | undefined;
    if (autoSaveArtifacts && fullText.trim()) {
      artifactPath = artifactPathFor(command, userInput);
      await writeArtifact(artifactPath, fullText);
      stream.progress(`Saved output to ${artifactPath}`);
      const artifactUri = toWorkspaceUri(artifactPath);
      if (artifactUri) {
        stream.reference(artifactUri);
      }
    }

    return {
      metadata: {
        command,
        source: prompt.source,
        artifactPath
      }
    };
  };
}

export const followupProvider: vscode.ChatFollowupProvider = {
  provideFollowups(result) {
    const data = result.metadata as { command?: AgenticSlashCommand } | undefined;
    const command = data?.command;
    if (!command) {
      return [];
    }

    const next = nextCommand(command);
    if (!next) {
      return [];
    }

    return [
      {
        prompt: `/${next}`,
        label: `Run /${next}`,
        command: next
      },
      {
        prompt: `/${command}`,
        label: `Refine /${command} output`,
        command
      },
      {
        prompt: '/manifest',
        label: 'Sync manifest state',
        command: 'manifest'
      }
    ];
  }
};
