import * as vscode from 'vscode';
import { fileExists, readUtf8File, toWorkspaceUri } from './workspace';

async function readDirectoryFiles(relativeDir: string): Promise<string[]> {
  const dirUri = toWorkspaceUri(relativeDir);
  if (!dirUri || !(await fileExists(dirUri))) {
    return [];
  }

  const entries = await vscode.workspace.fs.readDirectory(dirUri);
  const output: string[] = [];

  for (const [name, type] of entries) {
    if (type !== vscode.FileType.File) {
      continue;
    }

    const fileUri = vscode.Uri.joinPath(dirUri, name);
    const content = await readUtf8File(fileUri);
    output.push(`## ${relativeDir}/${name}\n\n${content}`);
  }

  return output;
}

export async function getActiveFileContext(): Promise<string | undefined> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }

  const path = editor.document.uri.fsPath;
  const text = editor.document.getText();
  return `Active file: ${path}\n\n${text}`;
}

export async function getManifestContext(): Promise<string | undefined> {
  const direct = toWorkspaceUri('manifest.md');
  if (direct && (await fileExists(direct))) {
    const content = await readUtf8File(direct);
    return `Manifest file (manifest.md):\n\n${content}`;
  }

  const manifestDir = toWorkspaceUri('.github/manifests');
  if (!manifestDir || !(await fileExists(manifestDir))) {
    return undefined;
  }

  const files = await readDirectoryFiles('.github/manifests');
  if (!files.length) {
    return undefined;
  }

  return files.join('\n\n');
}

export async function getPipelineArtifactContext(): Promise<string | undefined> {
  const sections = await Promise.all([
    readDirectoryFiles('.github/war-room'),
    readDirectoryFiles('.github/gauntlet'),
    readDirectoryFiles('.github/darwin'),
    readDirectoryFiles('.github/code-reviews'),
    readDirectoryFiles('.github/chaos')
  ]);

  const combined = sections.flat();
  if (!combined.length) {
    return undefined;
  }

  return combined.join('\n\n');
}
