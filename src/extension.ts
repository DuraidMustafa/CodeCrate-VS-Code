import * as vscode from "vscode";
import { getToken } from "./auth/clerkAuth";
import { loadSnippets } from "./snippets/loadSnippets";
import { saveSnippets } from "./snippets/saveSnippets";

export async function activate(context: vscode.ExtensionContext) {
  const token = await getToken(context);
  if (!token) {
    vscode.window.showWarningMessage(
      "Authentication required to use the extension.",
    );
    return;
  }
  const triggerLoadSnippet = () => {
    loadSnippets(context, token);
  };
  triggerLoadSnippet();
  const viewSnippetsCmd = vscode.commands.registerCommand(
    "extension.viewSnippets",
    async () => {
      // Fetch snippets
      const snippets = await fetchSnippets(token);
      if (!snippets || snippets.length === 0) {
        vscode.window.showInformationMessage("No snippets found.");
        return;
      }

      // Show snippets in a QuickPick list
      const selected = await vscode.window.showQuickPick(
        snippets.map((snip) => ({
          label: `${snip.title ? `Title: ${snip.title}` : "Title: Untitled"} ${
            snip.shortcut
              ? `Shortcut: ${snip.shortcut}`
              : "Shortcut: No Shortcut"
          }`,
          description: snip.language,
          detail: snip.code.slice(0, 80) + (snip.code.length > 80 ? "..." : ""),
          snippet: snip,
        })),
        { placeHolder: "Select a snippet to manage" },
      );

      if (!selected) return;

      const snippet = selected.snippet;

      // Ask what to do
      const action = await vscode.window.showQuickPick(
        ["📋 Copy to Clipboard", "❌ Delete Snippet"],
        {
          placeHolder: `Choose action for your snippet`,
        },
      );

      if (!action) return;

      if (action === "📋 Copy to Clipboard") {
        await vscode.env.clipboard.writeText(snippet.code);
        vscode.window.showInformationMessage("Snippet copied to clipboard.");
      } else if (action === "❌ Delete Snippet") {
        await deleteSnippet(snippet._id, token);
      }
    },
  );

  context.subscriptions.push(viewSnippetsCmd);
  const disposable = saveSnippets(token, triggerLoadSnippet);
  context.subscriptions.push(disposable);
}
async function fetchSnippets(token: string): Promise<any[]> {
  const response = await fetch(
    "https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/getAllSnippets",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data: any = await response.json();
  return data.snippets;
}
async function deleteSnippet(id: string, token: string) {
  const res = await fetch(
    `https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/deleteSnippet`,
    {
      body: JSON.stringify({ id }),
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data: any = await res.json();
  if (!data.success) {
    vscode.window.showErrorMessage("Failed to delete snippet.");
    return;
  }
  vscode.window.showInformationMessage("Snippet deleted successfully.");
  return;
}
