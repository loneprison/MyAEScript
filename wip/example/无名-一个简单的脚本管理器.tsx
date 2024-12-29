import * as _ from "soil-ts";

// 获取当前应用程序路径
const context = this;
const appPath = _.getAppPath();
// 去掉路径的最后一个部分
const supportPath = _.trimPathRight(appPath, 1);
// 创建脚本路径
const scriptPath = _.createPath(supportPath, "Scripts");
// 创建ScriptUI面板路径
const scriptUIPath = _.createPath(scriptPath, "ScriptUI Panels");
// 默认脚本路径数组
const SCRIPT_PATHS_DEFAULT = [scriptPath, scriptUIPath];

// 运行脚本
runScript();

function runScript() {
    // 获取所有未知文件
    const unknownFiles = _.flatMap(SCRIPT_PATHS_DEFAULT, function (path) {
        return _.mapFiles(path, file => {
            return file.alias ? file.resolve() : file;
        });
    });
    // 过滤出脚本文件
    const scriptFiles = _.filter(unknownFiles, _.isScriptFile);
    // 获取脚本文件名
    const scriptNames = _.map(scriptFiles, _.getPlainFileName);
    // 初始化主容器
    const container = initMainContainer(context, "");
    (container as Window).onResize = () => {
        container.layout.resize();
    };
    // 设置容器对齐和边距
    container.alignChildren = ["fill", "fill"] as unknown as _AlignmentProperty;
    container.margins = 5;
    // 添加列表框
    const lisbox = container.add("listbox", undefined, undefined, { multiselect: true });
    lisbox.preferredSize = [300, 500] as Dimension;
    if (_.isWindow(container)) {
        container.show();
    } else {
        container.layout.layout(true);
    }
    // 为每个脚本文件添加列表项
    _.forEach(scriptNames, (name, index) => {
        const item = lisbox.add("item", name);
        // 根据文件名生成颜色值
        const colorValue = _.reduce(name.split(""), (acc, cur) => acc + cur.charCodeAt(0), 0) % 256;
        item.image = _.newSolidImage([15, 15], [colorValue, 255 - colorValue, (colorValue * 2) % 256] as [number, number, number]);
    });
    // 双击列表项时执行脚本文件
    lisbox.onDoubleClick = function () {
        const selection = this.selection as unknown as ListItem[] | null;
        if (_.isArray(selection)) {
            const index = selection[0].index;
            $.evalFile(scriptFiles[index]);
        }
    };
}

// 初始化主容器
function initMainContainer(context: unknown, title: string) {
    return _.isPanel(context) ? context : baseCreatePalette(title);
}

// 创建调色板窗口
function baseCreatePalette(title: string) {
    return new Window("palette", title, undefined, { resizeable: true });
}
