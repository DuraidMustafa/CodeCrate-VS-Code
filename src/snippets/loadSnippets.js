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
exports.loadSnippets = loadSnippets;
const vscode = __importStar(require("vscode"));
async function loadSnippets(context, token) {
    const response = await fetch("https://projects.codecrate.duraidmustafa.com/api/vscode/snippets/getAllSnippets", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = (await response.json());
    const snippets = data.snippets;
    for (const snippet of snippets) {
        const provider = vscode.languages.registerCompletionItemProvider({ scheme: "file" }, {
            provideCompletionItems(document, position) {
                const item = new vscode.CompletionItem(snippet.shortcut, vscode.CompletionItemKind.Snippet);
                item.insertText = new vscode.SnippetString(snippet.code);
                item.documentation = new vscode.MarkdownString(snippet.description);
                item.filterText = snippet.shortcut;
                item.sortText = "0" + snippet.shortcut;
                return [item];
            },
        }, ...[...new Set(snippet.shortcut)].map((ch) => ch[0]));
        context.subscriptions.push(provider);
    }
}
//# sourceMappingURL=loadSnippets.js.map