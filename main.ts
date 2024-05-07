import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Canvas, CanvasEdge, CanvasNode, ItemView, } from 'obsidian';
// import { CanvasEdgeData } from "obsidian/canvas";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// add duve to tge ribbon
		this.addRibbonIcon('dices', 'Greet', () => {
			new Notice('Hello, world!');
		});

		const canvasView = app.workspace.getActiveViewOfType(ItemView);
		console.log('🎹 canvasView', canvasView);

		const checking = false;
		// this.canvas = new CanvasEdgeData(this.app);
		// Register a click event listener specifically for image clicks in the MarkdownView
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;

			// Check if the clicked element is an image within a MarkdownView
			if (target.tagName === 'IMG' && this.app.workspace.getActiveViewOfType(MarkdownView)) {
				evt.preventDefault();  // Prevent any default behavior
				this.openImageModal(target as HTMLImageElement);
			}
			// console.log('🎹 this', this);


			const canvasView = this.app.workspace.getActiveViewOfType(ItemView);
			if (canvasView?.getViewType() === "canvas") {
				// If checking is true, we're simply "checking" if the command can be run.
				// If checking is false, then we want to actually perform the operation.
				if (!checking) {
					// @ts-ignore
					const canvas = canvasView?.canvas;
					const currentSelection = canvas?.selection;
					// console.log('🎹 currentSelection.size', currentSelection.size, currentSelection);

					if (currentSelection.size > 1) {
						return;
					}

					if (currentSelection.size === 1) {
						// check if file path ends with an image extension
						const node = currentSelection.values().next().value;
						const filePath = node.filePath;
						const isImageOrVideo = /\.(png|jpe?g|gif|bmp|svg|webp|ico|tiff?|mp4|mov|avi|wmv|flv|mkv)$/i.test(filePath);
						console.log('🎹 node image?', !!isImageOrVideo, node.id, node);

						if (isImageOrVideo) {
							// new ExampleModal().open();
							const modal = new ExampleModal(this.app);
							modal.open();
						}


						// const node = canvas.createTextNode({
						// 	pos: {
						// 		x: 0,
						// 		y: 0,
						// 		height: 500,
						// 		width: 400
						// 	},
						// 	size: {
						// 		x: 0,
						// 		y: 0,
						// 		height: 500,
						// 		width: 400
						// 	},
						// 	text: "",
						// 	focus: true,
						// 	save: true,
						// });

						// canvas.addNode(node);
						canvas.requestSave();
						// if (!node) return;

						setTimeout(() => {
							// node.startEditing();
							// canvas.zoomToSelection();
						}, 0);
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}


			}
		});

		// Additional plugin initialization...
	}

	onunload() {
		// Clean up when the plugin is unloaded
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	openImageModal(image: HTMLImageElement) {
		const modal = new ImageModal(this.app, image.src);
		modal.open();
	}


}

class ImageModal extends Modal {
	imageUrl: string;

	constructor(app: App, imageUrl: string) {
		super(app);
		this.imageUrl = imageUrl;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h1', { text: 'Image Details' });
		contentEl.createEl('img', {
			attr: {
				src: this.imageUrl,
				alt: 'Loaded Image'
			},
			cls: 'modal-image-preview'
		});
		contentEl.createEl('p', { text: `URL: ${this.imageUrl}` });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}


export class ExampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.setText("Look at me, I'm a modal! 👀");
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
