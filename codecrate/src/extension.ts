import * as vscode from "vscode";
import { getToken } from "./auth/clerkAuth";
import { loadSnippets } from "./snippets/loadSnippets";

export async function activate(context: vscode.ExtensionContext) {
  const token = await getToken(context);
  if (!token) {
    vscode.window.showWarningMessage(
      "Authentication required to use the extension.",
    );
    return;
  }
  loadSnippets(context, token);
}

export function deactivate() {}
