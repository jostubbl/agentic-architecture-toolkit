import * as vscode from 'vscode';
import { toWorkspaceUri } from './workspace';

export async function ensureDirectory(relativePath: string): Promise<void> {
  const target = toWorkspaceUri(relativePath);
  if (!target) {
    return;
  }

  await vscode.workspace.fs.createDirectory(target);
}

export async function writeArtifact(relativePath: string, content: string): Promise<void> {
  const target = toWorkspaceUri(relativePath);
  if (!target) {
    throw new Error('No workspace is open.');
  }

  const parentPath = relativePath.split('/').slice(0, -1).join('/');
  if (parentPath) {
    await ensureDirectory(parentPath);
  }

  const encoded = new TextEncoder().encode(content);
  await vscode.workspace.fs.writeFile(target, encoded);
}
