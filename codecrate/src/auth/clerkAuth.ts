import * as vscode from "vscode";

export async function getToken(
  context: vscode.ExtensionContext,
): Promise<string | null> {
  const stored = await context.secrets.get("token");

  if (stored) {
    return stored;
  }

  const choice = await vscode.window.showInformationMessage(
    "You're not signed in. Please sign in to continue",
    "Sign in",
  );

  if (choice === "Sign in") {
    vscode.env.openExternal(
      vscode.Uri.parse("http://localhost:3000/account/token"),
    );
  }

  const token = await vscode.window.showInputBox({
    prompt: "Paste your Clerk token from the website",
    password: true,
    ignoreFocusOut: true,
  });

  if (token) {
    await context.secrets.store("clerkToken", token);
    vscode.window.showInformationMessage("Signed in successfully!");
    return token;
  }

  return null;
}
