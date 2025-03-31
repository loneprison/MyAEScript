import * as _ from 'soil-ts';

type Range = {
    min: number,
    max: number,
}
type JSONRange = Partial<Record<typeListType, Range>>;
type typeListType = typeof matchTypes[number];

const textSizeHeight: number = 22;
const buttonSizeHeight: number = 26;
const dataBoxWidth: number = 90;
const TextSizeArray_1: Array<number> = [0, 0, 54, textSizeHeight];
const TextSizeArray_2: Array<number> = [0, 0, 32, textSizeHeight];
const buttonSizeArray: Array<number> = [0, 0, 70, buttonSizeHeight];
const dropdownSizeArray: Array<number> = [0, 0, 56, textSizeHeight];
const dataBoxSizeArray: Array<number> = [0, 0, dataBoxWidth, textSizeHeight];
const matchTypes = ["AC", "AF", "SC", "SF"] as const;
const defaultDebugText = "debug信息..."



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
                    param: ["typeListType", dropdownSizeArray, matchTypes]
                },
                edittext1: ["groupRangeMin", TextSizeArray_2, "01"],
                edittext2: ["groupRangeMax", TextSizeArray_2, "09"]
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
        param: ["debugText", [0, 0, 300, 200], defaultDebugText, {
            multiline: true
        }],
        style: {
            alignment: ["fill", "fill"]
        }
    }
};

// 创建UI窗口
let elements = _.tree.parse(UIExamples);

let readJSONButton = elements.getElementById<Button>("readJSONButton");
let debugText = elements.getElementById<EditText>("debugText");
let readFileNameText = elements.getElementById<StaticText>("readFileName");
let dataRangeText = elements.getElementById<StaticText>("dataRange");
let groupTypeList = elements.getElementById<DropDownList>("typeListType");
let groupRangeMinText = elements.getElementById<EditText>("groupRangeMin");
let groupRangeMaxText = elements.getElementById<EditText>("groupRangeMax");

class JSONListener {
    private data: AnyObject = {};
    private name: string = ""
    private result: JSONRange = {};
    private log: string = defaultDebugText;

    private readonly refreshUI = () => {
        if (elements?.layout) {
            elements.layout.layout();
        }
    }

    private set(obj: AnyObject) {
        this.data = obj
        this.refreshReadFileNameText()
        this.refreshDataRangeText()
    }

    public getData() {
        return this.data
    }

    public getResult(type: typeListType): Range {
        if (this.result[type]) {
            return this.result[type]
        } else {
            return {
                min: -1,
                max: -1
            }
        }
    }

    public logRefresh(text: string): void {
        this.log = text;
        if (debugText) {
            debugText.text = this.log;
        }
        this.refreshUI();
    }

    public logAdd(text: string): void {
        this.log += `\n${text}`;
        if (debugText) {
            debugText.text = this.log;
        }
        this.refreshUI();
    }

    public readJSON(path: Folder): void {
        app.project.setDefaultImportFolder(path);
        let JSONFile = File.openDialog("Open a file", "Acceptable Files:*.json", false);
        
        if (!JSONFile) {
            this.logAdd("文件读取取消");
            return;
        }

        this.name = decodeURI(JSONFile.name);
        if (JSONFile.open("r")) {
            const readJSON = JSONFile.read();
            JSONFile.close();
            try {
                this.set(_.parseJson(readJSON));
            } catch (e) {
                this.logAdd("JSON 解析失败");
            }
        } else {
            this.logAdd("无法打开文件");
        }
    }

    // 刷新第一排文件名信息
    private refreshReadFileNameText(): void {
        readFileNameText && (readFileNameText.text = this.name)
        this.logAdd(`成功读取文件: ${this.name}`)
    }

    // 刷新第二排JSON范围信息
    private refreshDataRangeText(): void {
        this.getMinMaxByCategory(matchTypes);
        let range:string[] = _.mapObject(this.result, (value, key) => {
            if (value) {
                return `${key} : ${value.min} - ${value.max}`;
            }
            return `${key} : 信息获取异常,请联系作者寻求帮助`;
        });

        dataRangeText && (dataRangeText.text = range.join(" | "))
        this.logAdd(range.join("\n"))
    }

    private getMinMaxByCategory(matchTypes: string[]): void {
        const regex = /^([A-Z]+)(\d+)$/;
        this.result = {};

        _.forOwn(this.data, (value, key) => {
            const match = regex.exec(key);
            if (match) {
                const type = match[1] as typeListType;
                const num = parseInt(match[2], 10);

                if (_.indexOf(matchTypes, type) !== -1) {
                    if (!this.result[type]) {
                        this.result[type] = { min: num, max: num };
                    } else {
                        this.result[type].min = Math.min(this.result[type].min, num);
                        this.result[type].max = Math.max(this.result[type].max, num);
                    }
                }
            }
        });
    }


}

const jsonListener = new JSONListener

readJSONButton && (readJSONButton.onClick = (): void => {
    const path = app.project.file;
    if (!_.isFolder(path)) {
        jsonListener.logAdd("请先保存项目再进行操作")
        return
    }
    jsonListener.readJSON(path)
})