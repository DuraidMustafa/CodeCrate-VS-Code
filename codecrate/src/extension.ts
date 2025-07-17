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
  const disposable = saveSnippets(token, triggerLoadSnippet);
  context.subscriptions.push(disposable);
}
