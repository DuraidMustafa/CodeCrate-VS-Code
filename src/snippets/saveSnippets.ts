import * as vscode from "vscode";
import { detectLanguage } from "../utils/language-detector";
export const saveSnippets = (token: string, triggerLoadSnippet: () => void) => {
  const disposable = vscode.commands.registerCommand(
    "extension.saveSnippet",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText) {
        vscode.window.showErrorMessage("No code selected.");
        return;
      }
      const userShortcut = await vscode.window.showInputBox({
        placeHolder: "Add a shortcut for this snippet (optional)",
        prompt: "e.g. for quick search or labeling purposes",
        ignoreFocusOut: true,
      });
      const language = detectLanguage(selectedText);
      const snippetPayload = {
        code: selectedText,
        language,
        shortcut: userShortcut || null,
      };

      try {
        await saveSnippetToAPI(snippetPayload);
        triggerLoadSnippet();
        vscode.window.showInformationMessage("Snippet saved!");
      } catch (err) {
        console.log(err);
        vscode.window.showErrorMessage("Snippet save failed.");
      }
    },
  );
  return disposable;
  async function saveSnippetToAPI(payload: any) {
    const response = await fetch(
      "https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/saveSnippet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data: any = await response.json();
    if (!data.success) {
      throw new Error("Failed to save snippet");
    }
  }
};
