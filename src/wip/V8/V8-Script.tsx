import * as _ from 'soil-ts';

type JSONRange = {
    [key: string]: {
        min: number,
        max: number,
    }
}

const textSizeHeight: number = 22;
const buttonSizeHeight: number = 26;
const dataBoxWidth: number = 90;
const TextSizeArray_1: Array<number> = [0, 0, 54, textSizeHeight];
const TextSizeArray_2: Array<number> = [0, 0, 32, textSizeHeight];
const buttonSizeArray: Array<number> = [0, 0, 70, buttonSizeHeight];
const dropdownSizeArray: Array<number> = [0, 0, 56, textSizeHeight];
const dataBoxSizeArray: Array<number> = [0, 0, dataBoxWidth, textSizeHeight];
const matchTypes: Array<string> = ["AC", "AF", "SC", "SF"]


let UIExamples = {
    config: {
        dockable: true,
        show: true,
        singleton: false,
        layoutMode: 0
    },
    style: {
        text: "测试",
        margins: 10,
        spacing: 15,
        orientation: "column",
        alignChildren: ["Center", "Center"]
    },
    group1: {
        style: {
            orientation: "row",
            alignChildren: ["right", "top"],
            spacing: 10,
            margins: 0,
            alignment: ["fill", "fill"]
        },
        panel1: {
            style: {
                text: "状态",
                orientation: "column",
                alignChildren: ["left", "top"],
                spacing: 10,
                margins: 10,
                alignment: ["fill", "fill"]
            },
            group1: {
                style: {
                    orientation: "row",
                    alignChildren: ["left", "center"],
                    spacing: 12,
                    margins: 0,
                    alignment: ["fill", "fill"]
                },
                statictext1: [undefined, undefined, "读取文件"],
                group1: {
                    style: {
                        alignment: ["fill", "fill"]
                    },
                    button1: ["readJSONButton", buttonSizeArray, "点击打开"],
                    statictext1: {
                        style: {
                            alignment: ["fill", "fill"]
                        },
                        param: ["readFileName", undefined, "未读取"]
                    }
                }
            },
            group2: {
                style: {
                    orientation: "row",
                    alignChildren: ["left", "center"],
                    spacing: 12,
                    margins: 0,
                    alignment: ["fill", "fill"]
                },
                statictext1: [undefined, TextSizeArray_1, "数据范围"],
                statictext2: {
                    style: {
                        alignment: ["fill", "fill"]
                    },
                    param: ["dataRange", undefined, "AC*** - AC***"]
                }
            },
            group3: {
                style: {
                    orientation: "row",
                    alignChildren: ["left", "center"],
                    spacing: 12,
                    margins: 0
                },
                statictext1: [undefined, TextSizeArray_1, "选择范围"],
                dropdownlist1: {
                    style: {
                        selection: 0
                    },
                    param: ["dropName1", dropdownSizeArray, matchTypes]
                },
                edittext1: [undefined, TextSizeArray_2, "01"],
                edittext2: [undefined, TextSizeArray_2, "09"]
            },
            group4: {
                style: {
                    orientation: "row",
                    alignChildren: ["left", "center"],
                    spacing: 12,
                    margins: 0
                },
                statictext1: [undefined, TextSizeArray_1, "Base合成"],
                group1: {
                    button1: [undefined, buttonSizeArray, "点击获取"],
                    statictext1: [undefined, undefined, "当前合成:"]
                }
            },
        }
    },
    group2: {
        style: {
            orientation: "row",
            alignment: ["fill", "fill"]
        },
        group1: {
            style: {
                orientation: "column",
                alignChildren: ["left", "center"],
                spacing: 6,
                margins: [0, 10, 0, 0],
                alignment: ["fill", "fill"]
            },
            dropdownlist1: {
                style: {
                    selection: 0,
                    alignment: ["fill", "top"]
                },
                param: ["dropName2", undefined, ["V吧调音赛", "歌影回战"]]
            },
            treeview1: {
                style: {
                    alignment: ["fill", "fill"]
                },
                node1: "不带子项测试",
                node2: {
                    style: {
                        expanded: true
                    },
                    param: "带子项测试",
                    node1: "子项"
                }
            }
        },
        panel1: {
            style: {
                text: "数据",
                orientation: "column",
                alignChildren: ["left", "top"],
                spacing: 10,
                margins: 10,
                alignment: ["fill", "fill"]
            },
            group1: {
                statictext1: [undefined, TextSizeArray_1, "数据值"],
                edittext1: [undefined, dataBoxSizeArray, "这里可能很长"]
            },
            group2: {
                statictext1: [undefined, TextSizeArray_1, "数据类型"],
                dropdownlist1: {
                    style: {
                        selection: 0
                    },
                    param: ["dropName1", dataBoxSizeArray, ["数值", "资源文件", "文本歌词", "lrc歌词"]]
                }
            },
            group3: {
                statictext1: [undefined, TextSizeArray_1, "作用图层"],
                edittext1: [undefined, dataBoxSizeArray, "01"]
            },
            group4: {
                statictext1: [undefined, TextSizeArray_1, "作用效果"],
                edittext1: [undefined, dataBoxSizeArray, "[]"],
            },
            button1: {
                param: [undefined, undefined, "指定效果图层"],
                style: {
                    alignment: ["fill", "fill"]
                },
            },
        }
    },
    group3: {
        button1: [undefined, undefined, "读取配置"],
        button2: [undefined, undefined, "导出配置"],
        button3: [undefined, undefined, "运行脚本"],
    },

    edittext1: {
        param: ["debugText", [0, 0, 300, 200], "debug信息...", {
            multiline: true
        }],
        style: {
            alignment: ["fill", "fill"]
        }
    }
};

// 创建UI窗口
let elements = _.tree.parse(UIExamples);
const refreshUI = () => { return elements.layout.layout() }

let readJSONButton = elements.getElementById<Button>("readJSONButton");
let debugText = elements.getElementById<EditText>("debugText");
let readFileNameText = elements.getElementById<StaticText>("readFileName");
let dataRangeText = elements.getElementById<StaticText>("dataRange");

let JSONdata: AnyObject = {}


// 需要用监听器重写UI
readJSONButton && (readJSONButton.onClick = (): void => {
    const path = app.project.file;
    if (!path) {
        logDebugText_Add("请先保存项目再进行操作")
        JSONdata = {}
        return
    }
    JSONdata = readJSON(path)
    refreshDataRangeText()
})

// 刷新并写入新的Debug信息
function logDebugText_Refresh(text: string): void {
    debugText && (debugText.text = text)
    refreshUI()
}

// 刷新并增加Debug信息
function logDebugText_Add(text: string): void {
    debugText && (debugText.text = `${debugText.text}\n${text}`)
    refreshUI()
}

// 刷新第一排文件名信息
function refreshReadFileNameText(name: string): void {
    readFileNameText && (readFileNameText.text = name)
    logDebugText_Add(`成功读取文件: ${name}`)
    refreshUI()
}

// 刷新第二排JSON范围信息
function refreshDataRangeText(): void {
    const result: JSONRange = getMinMaxByCategory(JSONdata, matchTypes);
    let range = _.mapObject(result, (value, key) => {
        return `${key} : ${value.min} - ${value.max}`
    })

    dataRangeText && (dataRangeText.text = range.join(" | "))
    logDebugText_Add(range.join("\n"))
    refreshUI()
}

// 辅助函数: 获取JSON的具体范围
function getMinMaxByCategory(JSONdata: AnyObject, matchTypes: string[]): JSONRange {
    const result: JSONRange = {};
    const regex = /^([A-Z]+)(\d+)$/;

    _.each(_.keys(JSONdata), (key) => {
        const match = regex.exec(key);
        if (match) {
            const type = match[1];
            const num = parseInt(match[2], 10);

            if (_.indexOf(matchTypes, type) !== -1) {
                if (!result[type]) {
                    result[type] = { min: num, max: num };
                } else {
                    result[type].min = Math.min(result[type].min, num);
                    result[type].max = Math.max(result[type].max, num);
                }
            }
        }
    });

    return result;
}

// 读取JSON
function readJSON(path: File): AnyObject {
    _.isFolder(path) && app.project.setDefaultImportFolder(path);

    const file = new File(path.path);
    let JSONFile = file.openDlg("Open a file", "Acceptable Files:*.json", false);
    refreshReadFileNameText(decodeURI(JSONFile.name))
    JSONFile.open("r");
    const readJSON = JSONFile.read();
    JSONFile.close();
    return _.parseJson(readJSON);
}