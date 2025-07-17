"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const clerkAuth_1 = require("./auth/clerkAuth");
const loadSnippets_1 = require("./snippets/loadSnippets");
const saveSnippets_1 = require("./snippets/saveSnippets");
async function activate(context) {
    const token = await (0, clerkAuth_1.getToken)(context);
    if (!token) {
        vscode.window.showWarningMessage("Authentication required to use the extension.");
        return;
    }
    const triggerLoadSnippet = () => {
        (0, loadSnippets_1.loadSnippets)(context, token);
    };
    triggerLoadSnippet();
    const viewSnippetsCmd = vscode.commands.registerCommand("extension.viewSnippets", async () => {
        // Fetch snippets
        const snippets = await fetchSnippets(token);
        if (!snippets || snippets.length === 0) {
            vscode.window.showInformationMessage("No snippets found.");
            return;
        }
        // Show snippets in a QuickPick list
        const selected = await vscode.window.showQuickPick(snippets.map((snip) => ({
            label: `${snip.title ? `Title: ${snip.title}` : "Title: Untitled"} ${snip.shortcut
                ? `Shortcut: ${snip.shortcut}`
                : "Shortcut: No Shortcut"}`,
            description: snip.language,
            detail: snip.code.slice(0, 80) + (snip.code.length > 80 ? "..." : ""),
            snippet: snip,
        })), { placeHolder: "Select a snippet to manage" });
        if (!selected)
            return;
        const snippet = selected.snippet;
        // Ask what to do
        const action = await vscode.window.showQuickPick(["📋 Copy to Clipboard", "❌ Delete Snippet"], {
            placeHolder: `Choose action for your snippet`,
        });
        if (!action)
            return;
        if (action === "📋 Copy to Clipboard") {
            await vscode.env.clipboard.writeText(snippet.code);
            vscode.window.showInformationMessage("Snippet copied to clipboard.");
        }
        else if (action === "❌ Delete Snippet") {
            await deleteSnippet(snippet._id, token);
        }
    });
    context.subscriptions.push(viewSnippetsCmd);
    const disposable = (0, saveSnippets_1.saveSnippets)(token, triggerLoadSnippet);
    context.subscriptions.push(disposable);
}
async function fetchSnippets(token) {
    const response = await fetch("https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/getAllSnippets", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data.snippets;
}
async function deleteSnippet(id, token) {
    const res = await fetch(`https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/deleteSnippet`, {
        body: JSON.stringify({ id }),
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) {
        vscode.window.showErrorMessage("Failed to delete snippet.");
        return;
    }
    vscode.window.showInformationMessage("Snippet deleted successfully.");
    return;
}
//# sourceMappingURL=extension.js.map