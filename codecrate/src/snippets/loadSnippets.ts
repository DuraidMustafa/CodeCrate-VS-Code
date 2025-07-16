import * as vscode from "vscode";
export async function loadSnippets(
  context: vscode.ExtensionContext,
  token: string,
) {
  const response = await fetch(
    "http://localhost:3000/api/vscode/snippets/getAllSnippets",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = (await response.json()) as { snippets: Array<any> };

  const snippets = data.snippets;

  for (const snippet of snippets) {
    const provider = vscode.languages.registerCompletionItemProvider(
      { scheme: "file" },
      {
        provideCompletionItems(document, position) {
          const item = new vscode.CompletionItem(
            snippet.shortcut,
            vscode.CompletionItemKind.Snippet,
          );

          item.insertText = new vscode.SnippetString(snippet.code);
          item.documentation = new vscode.MarkdownString(snippet.description);
          item.filterText = snippet.shortcut;
          item.sortText = "0" + snippet.shortcut;

          return [item];
        },
      },
      ...[...new Set(snippet.shortcut)].map((ch: any) => ch[0]), // trigger on first char
    );

    context.subscriptions.push(provider);
  }
}
