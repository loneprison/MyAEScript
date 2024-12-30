import * as _ from "soil-ts";

/*
    所有属性下都存在style和param两个属性，style用于设置控件的样式，param用于设置控件的参数
    如果直接填写数组则默认为传入param,
    button1: ["btnName1", undefined, "按钮"]
    和
    button1: {param: ["btnName1", undefined, "按钮"]}
    是等价的
    如果只需要设置一个简单的属性则可使用数组写法节约代码,
    但是如果需要设置样式则需要使用对象写法
    不同的空间拥有不同的参数和样式
    下面是对于不同控件的参数和样式的说明
    最顶层的属性是窗口本身的最底层属性,
    其存在以下样式:
    {
        text: "Tree UI 控件示例", // 窗口标题
        orientation: "column", // 排列方式
        alignChildren: ["fill", "fill"], // 对齐方式
        spacing: 10, // 控件间距
        margins: 10 // 控件边距
    }

*/


// 基本配置示例
const UIExamples = {
    config: {
        dockable: true,
        show: true,
        singleton: false,
        layoutMode: 0
    },
    style: {
        text: "Tree UI 控件示例",
        margins: 10,
        spacing: 10,
        orientation: "column",
        alignChildren: ["fill", "fill"]
    },
    group1: {
        style: {
            text: "基础控件示例",
            orientation: "column",
            alignChildren: ["center", "top"],
            spacing: 10,
            margins: 10
        },
        button1: ["btnName1", undefined, "按钮-数组写法"],
        button2: {
            param: ["btnName2", undefined, "按钮-对象写法"],
            style: {
                onClick: function () {
                    alert("点击事件");
                }
            }
        },
        edittext1: ["editName1", undefined, "文本框-数组写法", {
            multiline: true
        }],
        edittext2: {
            param: ["editName2", undefined, "文本框-对象写法"],
            style: {
                preferredSize: [200, 25],
                onChange: function () {
                    alert("文本改变");
                }
            }
        }
    },
    group2: {
        style: {
            text: "选择控件示例",
            orientation: "column",
            alignChildren: ["center", "top"],
            spacing: 10,
            margins: 10
        },
        checkbox1: ["checkName1", undefined, "复选框-数组写法"],
        checkbox2: {
            param: ["checkName2", undefined, "复选框-对象写法"],
            style: {
                value: true,
                onClick: function () {
                    alert("选中状态改变");
                }
            }
        },
        dropdownlist1: ["dropName1", undefined, ["选项1", "选项2", "选项3"]],
        dropdownlist2: {
            param: ["dropName2", undefined, ["选项A", "选项B", "选项C"]],
            style: {
                selection: 1
            }
        }
    },
    group3: {
        style: {
            text: "容器控件示例",
            orientation: "column",
            alignChildren: ["center", "top"],
            spacing: 10,
            margins: 10
        },
        tabbedpanel1: {
            style: {
                selection: 0
            },
            tab1: {
                param: ["tab1", undefined, "标签页1"],
                button1: ["tabBtn1", undefined, "标签1中的按钮"]
            },
            tab2: {
                param: ["tab2", undefined, "标签页2"],
                edittext1: ["tabEdit1", undefined, "标签2中的文本框"]
            }
        },
        treeview1: {
            param: ["treeView1", [0, 0, 200, 100]],
            node1: {
                param: "父节点1",
                style: {
                    expanded: true
                },
                node1: {
                    param: "子节点1-1"
                },
                node2: {
                    param: "子节点1-2"
                }
            },
            node2: {
                param: "父节点2",
                node1: {
                    param: "子节点2-1"
                }
            }
        }
    },
    group4: {
        style: {
            text: "数值控件示例",
            orientation: "column",
            spacing: 10,
            margins: 10
        },
        // slider# :[name, bounds, value, min, max]
        slider1: ["sliderName1", [0, 0, 200, 20], 50, 0, 100],
        slider2: {
            param: ["sliderName2", [0, 0, 200, 20], 50, 0, 100],
            style: {
                onChanging: function () {
                    alert("滑动中");
                }
            }
        },
        progressbar1: ["progressName1", [0, 0, 100, 100], "progressName1"]
    }
};

// 创建UI窗口
let elements = _.tree.parse(UIExamples);
