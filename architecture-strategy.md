# The Agentic Architecture Handbook

**Philosophy:** Don't just manage AI. **Engineer with AI.**

## I. Core Philosophy

Most developers use AI as a "Smart Intern" (Chat  Code).
**We use AI as a "Task Force"** (Spec  Red Team  Architect  Builder  QA).

* **Inversion:** Don't just write code. Write the *environment* that forces the code to be robust.
* **Adversarial Design:** Trust is good; **Proof is better.** Use AI to attack your own designs before implementation.
* **State Persistence:** The "Brain" is not the chat window. The "Brain" is a **Living Document** (`manifest.md`) that tracks the project state.

---

## II. The Workflows

### 1. The Orchestrator (The "Living Document")

**Goal:** A self-correcting loop for spec generation and implementation.
**Mechanism:** A single Markdown file (`manifest.md`) acts as the state machine.

**The Prompt Template (`.github/prompts/manifest.md`):**

```markdown
# FEATURE MANIFEST
# SYSTEM INSTRUCTION: Read the 'Status' field. Execute instructions for that state. Update 'Status' when done.
Status: DRAFTING  # Options: DRAFTING -> RED_TEAMING -> REFINING -> APPROVED -> IMPLEMENTING -> COMPLETED

## 1. Executive Summary
(User Input--Example: "Implement RDP Handshake with TLS 1.3")

## 2. Architecture & Design
(AI Architect fills this)

## 3. Threat Model & Risks
(AI Red Team fills this)

## STATE LOGIC
**IF STATUS == DRAFTING:** Architect drafts Section 2. Next: RED_TEAMING.
**IF STATUS == RED_TEAMING:** Security Researcher attacks Section 2. Next: REFINING.
**IF STATUS == REFINING:** Engineer fixes Section 2 based on risks. Next: APPROVED.
**IF STATUS == APPROVED:** Builder implements code. Next: COMPLETED.

```

### 2. The Gauntlet (Adversarial TDD)

**Goal:** Prevent "Happy Path" coding by writing hostile tests *first*.
**Mechanism:** The AI acts as a Hostile QA.

**The Workflow:**

1. **Trigger:** `Run Gauntlet on [Feature]`.
2. **AI Action:** Generates `tests/Test_[Feature].cpp`.
* *Constraint:* Must include buffer overflows, null inputs, and race conditions.
* *Constraint:* Do **not** write implementation yet.


3. **User Action:** Review the tests. Add one "Impossible" test case.
4. **AI Action:** Write `src/[Feature].cpp` until all tests pass.

### 3. The Dungeon Master (Chaos Engineering)

**Goal:** Test the *environment*, not just the code.
**Mechanism:** AI generates infrastructure scripts to break the app.

**The Prompt:**

> "Act as a Chaos Engineer. Write a Linux shell script using `tc qdisc` (Traffic Control) to simulate a 'SatCom in a Thunderstorm' scenario: 600ms latency, 15% packet loss, and random jitter. Run my C++ client inside this environment."

### 4. The Darwin Protocol (Genetic Optimization)

**Goal:** Find the *best* solution, not just *a* solution.
**Mechanism:** Breed code variants.

**The Prompt:**

> "Generate 3 distinct C++ implementations for [Problem]:
> 1. **The Speedster:** Optimized for raw performance (unsafe).
> 2. **The Tank:** Optimized for safety/error handling (verbose).
> 3. **The Hybrid:** Combine the speed of #1 with the safety of #2."
> 
> 

---

## III. The Tooling: "Agentic Toolkit" Extension

Instead of copying prompts, build a VS Code Extension to run them natively.

### 1. The Experience

* **Right-Click** on a file  **"Agentic: Run Gauntlet"**.
* **Right-Click** on a manifest  **"Agentic: Orchestrate"**.
* **Result:** A split-screen view where you watch the Spec/Tests/Code being written in real-time.

### 2. The Implementation Blueprint (`extension.ts`)

This TypeScript logic connects VS Code's context to the AI model.

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Command: Run Gauntlet
    let disposable = vscode.commands.registerCommand('agentic.gauntlet', async () => {
        // 1. Get Code
        const editor = vscode.window.activeTextEditor;
        const code = editor.document.getText();

        // 2. Build Prompt
        const prompt = `ROLE: Hostile QA. TASK: Break this code with GoogleTests.\n\n${code}`;

        // 3. Call AI (VS Code LM API)
        const [model] = await vscode.lm.selectChatModels({ family: 'gpt-4' });
        const response = await model.sendRequest([vscode.LanguageModelChatMessage.User(prompt)], {}, new vscode.CancellationTokenSource().token);

        // 4. Stream Result to New File
        const doc = await vscode.workspace.openTextDocument({ content: '', language: 'cpp' });
        const streamEditor = await vscode.window.showTextDocument(doc);
        // ... (streaming logic) ...
    });

    context.subscriptions.push(disposable);
}

```

---

## IV. Advanced Tactics

### 1. The "Context Baton"

**Problem:** Losing context between prompts.
**Solution:** Force the AI to summarize the state before handing off.
**Instruction:** *"At the end of your response, output a code block titled `CONTEXT_BATON`. Summarize the architectural decisions, discarded ideas, and hidden constraints. The next agent will read this."*

### 2. The "Confessional" (Automated ADRs)

**Problem:** No one writes Architecture Decision Records.
**Solution:** AI interrogates you on `git commit`.
**Workflow:**

* You commit complex code.
* AI Hook: *"I see you changed `shared_ptr` to `unique_ptr`. Why?"*
* You: *"To prevent cyclical leaks."*
* AI Action: Generates `docs/ADR-005_SmartPointers.md`.

### 3. Voice Command ("The Commute Commander")

**Problem:** Best ideas happen away from the keyboard.
**Solution:** High-fidelity voice specs.
**Workflow:** Record a voice note walking through the logic  AI converts it to a Spec  You review it when you arrive at your desk.

---

**Next Step:**
To begin, create the **`manifest.md`** file in your repository root and try running the "Drafting  Red Teaming" loop on your next feature.