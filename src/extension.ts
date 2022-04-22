import { ExtensionContext, commands, window } from 'vscode';

import * as  translate from './translate/index'

// 扩展被激活的时候执行，第一次执行命令才会激活扩展
export function activate(context: ExtensionContext) {

	// 扩展被激活的时候执行
	console.log('Congratulations, your extension "terextension" is now active!');

	// 在 package.json 中声明的 command 需要在这里注册，
	// 参数必须匹配 package.json 中的 command 字段
	let disposable = commands.registerCommand('terextension.translate', () => {
		// 每次执行command，都会运行这里的代码
		// 显示消息框
		window.showInformationMessage('Hello World from TerExtension!');
		translate.init();
	});

	context.subscriptions.push(disposable);
}

// 扩展销毁的之后执行
export function deactivate() { }
