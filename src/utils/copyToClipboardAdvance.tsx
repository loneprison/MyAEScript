/**
 * 将指定文本复制到系统剪贴板（高级方式）。
 *
 * 此函数通过创建临时文件并写入文本，然后根据操作系统使用对应的命令行工具将文本复制到剪贴板，
 * 最后删除临时文件。
 *
 * @param {string} text - 要复制到剪贴板的文本。
 * @returns {void}
 * @since 0.1.0
 * @category utils
 * @example
 */

function copyToClipboardAdvance(text) {
    let tempFile = new File(Folder.temp.fullName + '/temp.txt');
    tempFile.open('w');
    tempFile.encoding = 'UTF-8';
    tempFile.write(text);
    tempFile.close();

    if (Folder.fs === 'Windows') {
        const cmdCommand = 'cmd.exe /c cmd.exe /c "chcp 65001 > nul &&type ' + tempFile.fsName + ' | clip"';
        system.callSystem(cmdCommand);
    } else if (Folder.fs === 'Macintosh') {
        const osaCommand = 'cat "' + tempFile.fsName + '" | pbcopy';
        system.callSystem("osascript -e '" + osaCommand + "'");
    } else {
        alert('Unsupported operating system.');
    }

    // 删除临时文件
    tempFile.remove();
}


export default copyToClipboardAdvance