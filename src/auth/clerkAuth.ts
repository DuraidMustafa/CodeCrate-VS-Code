import * as vscode from "vscode";

export async function getToken(
  context: vscode.ExtensionContext,
): Promise<string | null> {
  const stored = context.globalState.get<string>("clerkToken");
  if (stored) {
    return stored;
  }

  const choice = await vscode.window.showInformationMessage(
    "You're not signed in. Please sign in to continue",
    "Sign in",
  );
  

  if (choice === "Sign in") {
    vscode.env.openExternal(
      vscode.Uri.parse(
        "https://projects.codecrate.duraidmustafa.com/account/token",
      ),
    );
  }

  const token = await vscode.window.showInputBox({
    prompt: "Paste your Clerk token from the website",
    password: true,
    ignoreFocusOut: true,
  });

  if (token) {
    console.log(token);

    await context.globalState.update("clerkToken", token);
    vscode.window.showInformationMessage("Signed in successfully!");
    const stored = context.globalState.get<string>("clerkToken");
    console.log(stored);
    return token;
  }

  return null;
}
