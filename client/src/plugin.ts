

export class Plugin {
    private pluginPath: string;

    private pluginName: string;
    private state: boolean;

    constructor(pluginPath: string, state: boolean,pluginName:string) {
        this.pluginPath = pluginPath;
        this.state = state;
		this.pluginName=pluginName;
    }

	public getPath():string{
		return this.pluginPath;
	}
	public getName():string{
		return this.pluginName;
	}
	public getState():boolean{
		return this.state;
	}


    public runPlugin(): void {
        // Implement your plugin logic here

        console.log(`Running plugin: ${this.pluginName}`);
        console.log(`Running plugin with binary path: ${this.pluginPath}`);
        console.log('State Of Plugin:', this.state);
    }
}