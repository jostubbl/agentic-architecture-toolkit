/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'node20',
    sourcemap: !production,
    minify: production,
    external: ['vscode'],
    outfile: 'dist/extension.js',
    logLevel: 'info'
  });

  if (watch) {
    await ctx.watch();
    return;
  }

  await ctx.rebuild();
  await ctx.dispose();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});