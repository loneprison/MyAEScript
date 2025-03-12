import * as _ from "soil-ts";

let UISource = {
    style: {
        text: '测试单元',
        margins: 10,
        spacing: 16,
        orientation: 'column',
        alignment: ['fill', 'fill'],
    },
    group1: {
        param: ['group1', [0, 0, 200, 50]],
        style: {
            orientation: 'column',
            alignChildren: ['center', 'fill'],
            spacing: 10,
            margins: 0,
        },
    }
}

// 创建UI窗口
let elements = _.tree.parse(UISource);

var button1 = elements.getElementById("button1") as Button;
button1.onClick = function () {
    var group1 = elements.getElementById("group1") as Group;

    group1.add("button", [0, 0, 50, 50], "按钮2");

    elements.layout.layout(true);
};