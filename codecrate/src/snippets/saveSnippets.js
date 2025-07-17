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
exports.saveSnippets = void 0;
const vscode = __importStar(require("vscode"));
const language_detector_1 = require("../utils/language-detector");
const saveSnippets = (token, triggerLoadSnippet) => {
    const disposable = vscode.commands.registerCommand("extension.saveSnippet", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
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
        const language = (0, language_detector_1.detectLanguage)(selectedText);
        const snippetPayload = {
            code: selectedText,
            language,
            shortcut: userShortcut || null,
        };
        try {
            await saveSnippetToAPI(snippetPayload);
            triggerLoadSnippet();
            vscode.window.showInformationMessage("Snippet saved!");
        }
        catch (err) {
            console.log(err);
            vscode.window.showErrorMessage("Snippet save failed.");
        }
    });
    return disposable;
    async function saveSnippetToAPI(payload) {
        const response = await fetch("http://localhost:3000/api/vscode/snippets/saveSnippet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error("Failed to save snippet");
        }
    }
};
exports.saveSnippets = saveSnippets;
//# sourceMappingURL=saveSnippets.js.map