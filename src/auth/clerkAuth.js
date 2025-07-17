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
exports.getToken = getToken;
const vscode = __importStar(require("vscode"));
async function getToken(context) {
    const stored = await context.secrets.get("token");
    if (stored) {
        return stored;
    }
    const choice = await vscode.window.showInformationMessage("You're not signed in. Please sign in to continue", "Sign in");
    if (choice === "Sign in") {
        vscode.env.openExternal(vscode.Uri.parse("https://projects.codecrate.duraidmustafa.com/account/token"));
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
//# sourceMappingURL=clerkAuth.js.map