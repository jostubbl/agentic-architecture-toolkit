import * as vscode from 'vscode';
import { createAgenticHandler, followupProvider, ParticipantState } from './participant';
import { PromptLoader } from './prompts';

const PARTICIPANT_ID = 'agentic-toolkit.agentic';

async function openChatWithQuery(query: string): Promise<void> {
  await vscode.commands.executeCommand('workbench.action.chat.open', { query });
}

function queryFromCommand(command: string, uri?: vscode.Uri): string {
  const fileContext = uri ? `\n\nTarget file: ${uri.fsPath}` : '';
  return `@agentic /${command}${fileContext}`;
}

export function activate(context: vscode.ExtensionContext): void {
  const loader = new PromptLoader(context.extensionUri);
  const state: ParticipantState = {};
  const handler = createAgenticHandler(loader, state);

  const participant = vscode.chat.createChatParticipant(PARTICIPANT_ID, handler);
  participant.followupProvider = followupProvider;

  participant.onDidReceiveFeedback((feedback) => {
    const kind = feedback.kind === vscode.ChatResultFeedbackKind.Helpful ? 'helpful' : 'unhelpful';
    console.log(`[agentic] feedback: ${kind}`);
  });

  context.subscriptions.push(participant);

  const runGauntlet = vscode.commands.registerCommand('agentic.runGauntlet', async (uri?: vscode.Uri) => {
    await openChatWithQuery(queryFromCommand('gauntlet', uri));
  });

  const orchestrate = vscode.commands.registerCommand('agentic.orchestrate', async (uri?: vscode.Uri) => {
    await openChatWithQuery(queryFromCommand('manifest', uri));
  });

  const deliberate = vscode.commands.registerCommand('agentic.deliberate', async (uri?: vscode.Uri) => {
    await openChatWithQuery(queryFromCommand('deliberate', uri));
  });

  const review = vscode.commands.registerCommand('agentic.review', async (uri?: vscode.Uri) => {
    await openChatWithQuery(queryFromCommand('review', uri));
  });

  context.subscriptions.push(runGauntlet, orchestrate, deliberate, review);
}

export function deactivate(): void {}
