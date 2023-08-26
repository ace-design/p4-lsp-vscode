import { workspace, ExtensionContext, window, ProgressLocation } from "vscode";
import * as vscode from "vscode";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import axios from "axios";
import { Plugin } from "./plugin";
import * as path from "path";
import { getWebviewContent } from "./settingUI";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient;
let pluginsAr = [];
const getSavedData = async (context) => {
  //Read Json
  const fileUri = vscode.Uri.file(
    path.join(context.extensionPath, "files", "lsp.json")
  );
  let dataArray = JSON.parse(fs.readFileSync(fileUri.fsPath, "utf-8"));
  for (let item of dataArray) {
    window.showInformationMessage(`${JSON.stringify(item)}`);
    const plugin = new Plugin(
      item["path"],
      item["active"],
      item["name"],
      item["arguments"],
      item["onTrigger"]
    );
    pluginsAr.push(plugin);
  }
};

function openWebView(data: string) {
  const panel = vscode.window.createWebviewPanel(
    "binaryLocations",
    "Binary Locations",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  // Load the webview content from an HTML file

  panel.webview.html = `<p>${data}<p>`;
}
export async function activate(context: ExtensionContext) {
  // Register the command
  getSavedData(context);
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.showMyMessage", () => {
      const panel = vscode.window.createWebviewPanel(
        "binaryLocations",
        "Binary Locations",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          enableFindWidget: true,
        }
      );

      // Load the webview content from an HTML file

      panel.webview.html = getWebviewContent(pluginsAr);

      // Set up message listener
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "saveLocations":
              const selectedLocations = message.locations;
              // Handle the selected locations here
              const fileUri = vscode.Uri.file(
                path.join(context.extensionPath, "files", "lsp.json")
              );

              let stringData = JSON.stringify(selectedLocations);
              vscode.window.showInformationMessage(
                `Received locations: ${stringData}`
              );
              fs.writeFileSync(fileUri.fsPath, stringData);
              return;
            case "alert":
              vscode.window.showErrorMessage(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
  const lspConfig = workspace.getConfiguration("p4.p4_lsp", null);
  let bin_path = lspConfig.get<string | null>("path", null);

  if (!bin_path) {
    window.showInformationMessage(
      `No language server path specified. Installing latest version.`
    );
    bin_path = await installExecutable(context);
  }

  const serverOptions: ServerOptions = {
    command: bin_path,
  };

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: "file", language: "p4" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
    },
    initializationOptions: [
      {
        name: "nofel",
        path: "python3 Users/noelchungathgregory/Documents/PLugins/test.py",
        on: ["Save"],
        arguments: [{ key: "f", value: "fd" }],
        state: true,
      },
    ],
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "p4_lsp",
    "P4 Language Server",
    serverOptions,
    clientOptions
  );
  client.onNotification("custom", (notification: any) => {
    if (notification.message.length > 0 && notification.data.length <= 0) {
      vscode.window.showInformationMessage(notification.message);
    } else if (
      notification.message.length > 0 &&
      notification.data.length > 0
    ) {
      vscode.window
        .showInformationMessage(notification.message, "LSP Result")
        .then((selection) => {
          if (notification.data.length > 0 && selection === "LSP Result") {
            openWebView(notification.data); // Open the webview panel with the data
          }
        });
    } else {
      if (notification.data.length > 0) {
        openWebView(notification.data); // Open the webview panel with the data
      }
    }
  });

  // Start the client. This will also launch the server
  return client.start().catch((reason) => {
    window.showWarningMessage(
      `Failed to run P4 Language Server (P4_LSP): ${reason}`
    );
    client = null;
  });
}

// Modified version of https://github.com/ziglang/vscode-zig/blob/fd7e111d3ca4f518ec929568e2aaa9a5b588094e/src/zls.ts#L57
async function installExecutable(
  context: ExtensionContext
): Promise<string | null> {
  return window.withProgress(
    {
      title: "Installing p4_lsp...",
      location: ProgressLocation.Notification,
    },
    async (progress) => {
      const tag = await getVersionTag();
      const binName = getBinaryName();

      const exe = (
        await axios.get(
          `https://github.com/ace-design/p4-lsp/releases/download/${tag}/${binName}`,
          {
            responseType: "arraybuffer",
          }
        )
      ).data;

      progress.report({ message: "Installing..." });
      const installDir = vscode.Uri.joinPath(
        context.globalStorageUri,
        "p4_lsp_install"
      );
      if (!fs.existsSync(installDir.fsPath)) mkdirp.sync(installDir.fsPath);

      const lsBinPath = vscode.Uri.joinPath(
        installDir,
        `p4_lsp${process.platform === "win32" ? ".exe" : ""}`
      ).fsPath;
      const lsBinTempPath = lsBinPath + ".tmp";

      // Create a new executable file.
      // Do not update the existing file in place, to avoid code-signing crashes on macOS.
      // https://developer.apple.com/documentation/security/updating_mac_software
      fs.writeFileSync(lsBinTempPath, exe, "binary");
      fs.chmodSync(lsBinTempPath, 0o755);
      fs.renameSync(lsBinTempPath, lsBinPath);

      const config = workspace.getConfiguration("p4.p4_lsp");
      await config.update("path", lsBinPath, true);

      return lsBinPath;
    }
  );
}

async function getVersionTag(): Promise<string | null> {
  return axios
    .get("https://api.github.com/repos/ace-design/p4-lsp/releases/latest")
    .then(function (response) {
      return response.data.tag_name;
    })
    .catch(function (error) {
      return null;
    });
}

function getBinaryName(): string | null {
  const platform = process.platform;
  const architecture = process.arch;

  if (architecture === "x64") {
    if (platform === "linux") return "p4_lsp-Linux-x86_64-musl";
    else if (platform === "darwin") return "p4_lsp-Darwin-x86_64";
    else if (platform === "win32") return "p4_lsp-Windows-x86_64.exe";
  } else if (architecture === "arm64") {
    if (platform === "darwin") return "p4_lsp-Darwin-aarch64";
    if (platform === "linux") return "p4_lsp-Linux-aarch64-musl";
  }

  return null;
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
