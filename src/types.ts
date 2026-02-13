export type AgenticSlashCommand =
  | 'deliberate'
  | 'gauntlet'
  | 'darwin'
  | 'implement'
  | 'review'
  | 'fix'
  | 'chaos'
  | 'manifest';

export const AGENTIC_COMMANDS: AgenticSlashCommand[] = [
  'deliberate',
  'gauntlet',
  'darwin',
  'implement',
  'review',
  'fix',
  'chaos',
  'manifest'
];

export interface PromptDefinition {
  name: string;
  description?: string;
  model?: string;
  agent?: string;
  body: string;
  source: 'workspace' | 'bundled';
}
