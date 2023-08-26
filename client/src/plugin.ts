import { Hash } from "crypto";

export class Plugin {
  private pluginPath: string;

  private pluginName: string;
  private state: boolean;
  private arg: Map<string, string>;
  private onTrigger: string[];

  constructor(
    pluginPath: string,
    state: boolean,
    pluginName: string,
    arg: Map<string, string>,
    onTrigger: string[]
  ) {
    this.pluginPath = pluginPath;
    this.state = state;
    this.pluginName = pluginName;
    this.arg = arg;
    this.onTrigger = onTrigger;
  }

  public getPath(): string {
    return this.pluginPath;
  }
  public getName(): string {
    return this.pluginName;
  }
  public getState(): boolean {
    return this.state;
  }

  public getArg(): Map<string, string> {
    return this.arg;
  }

  public getOnTrigger(): string[] {
    return this.onTrigger;
  }

  public runPlugin(): void {
    // Implement your plugin logic here

    console.log(`Running plugin: ${this.pluginName}`);
    console.log(`Running plugin with binary path: ${this.pluginPath}`);
    console.log("State Of Plugin:", this.state);
  }
}
