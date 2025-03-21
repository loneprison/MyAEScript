
/**
 * 将文本内容复制到剪贴板。
 *
 * 根据不同操作系统（Windows 或其他）选择合适的命令来执行复制操作。
 * 在 macOS 上使用 `pbcopy`，在 Windows 上使用 `clip`。
 *
 * @param {string} content 要复制的文本内容。
 * @returns {void} 无返回值。
 * @since 0.1.0
 * @category utils
 * @example
 *
 * ```ts
 * copyToClipboard("Hello, world!");
 * // 结果：将 "Hello, world!" 复制到剪贴板。
 * ```
 */

function copyToClipboard(content: string): void {
    let cmd: string;
    const isWindows = $.os.indexOf("Windows") !== -1;

    // 将内容转换为字符串,TS里面其实没必要这个步骤，但是为了考虑不完全在TS里编译出来的代码的情况加上这条
    content = content.toString();

    // 根据操作系统选择合适的命令
    if (!isWindows) {
        cmd = 'echo "' + content + '" | pbcopy';
    } else {
        cmd = 'cmd.exe /c cmd.exe /c "echo ' + content + ' | clip"';
    }

    // 执行系统命令
    system.callSystem(cmd);
}

export default copyToClipboard