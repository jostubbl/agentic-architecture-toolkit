import * as vscode from 'vscode';

export function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
  return vscode.workspace.workspaceFolders?.[0];
}

export function toWorkspaceUri(relativePath: string): vscode.Uri | undefined {
  const folder = getWorkspaceFolder();
  if (!folder) {
    return undefined;
  }

  return vscode.Uri.joinPath(folder.uri, ...relativePath.split('/'));
}

export async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

export async function readUtf8File(uri: vscode.Uri): Promise<string> {
  const bytes = await vscode.workspace.fs.readFile(uri);
  return new TextDecoder('utf-8').decode(bytes);
}
