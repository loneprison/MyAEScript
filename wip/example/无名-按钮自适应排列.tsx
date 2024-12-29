import * as _ from "soil-ts";

// 定义控件边距类型
type ItemMargins = [number, number, number, number];

// 创建一个可调整大小的调色板窗口
let palette = new Window("palette", undefined, undefined, { resizeable: true });
palette.orientation = "row";
// 创建20个按钮并添加到调色板中
let buttons = _.times(20, (x) => palette.add("button", [0, 0, 50, 50] as Bounds, String(x)));
palette.show();

// 自动调整控件排列函数
function autoResize(elements: _Control[], margins: ItemMargins, spacing: number) {
    const numItems = elements.length;
    if (numItems == 0) {
        return false;
    }

    // 计算控件的最大宽度和高度，并加上间距
    let itemMaxWidth = Math.max(..._.map(elements, (item) => item.size.width)) + spacing;
    let itemMaxHeigh = Math.max(..._.map(elements, (item) => item.size.height)) + spacing;

    // 定义窗口调整大小事件
    palette.onResize = function () {
        // 计算每行最多可以放置的控件数量
        let countMaxItems = Math.floor((this.size.width - margins[2] /* 右边距 */ + spacing) / itemMaxWidth);
        // 确保最少有一列，最多为控件数量
        let clamped = _.clamp(countMaxItems, 1, numItems);
        // 对控件进行切片操作
        var splitedItems = _.chunk(elements, clamped);
        // 遍历每一行和每一列的控件，设置它们的位置
        _.forEach(splitedItems, function (items, rows) {
            _.forEach(items, function (item, columns) {
                item.location = [margins[0] /* 左边距 */ + itemMaxWidth * columns, margins[1] /* 顶边距 */ + rows * itemMaxHeigh] as Point;
            });
        });
        // 以下为窗口高度自适应处理，不需要可以删除
        var countSplited = splitedItems.length; /* 统计切成了几组，也就是控件排列的行数 */
        this.size.height = countSplited * itemMaxHeigh + margins[3] /* 底边距 */;
    };
}

// 调用自动调整函数
autoResize(buttons, palette.margins as unknown as ItemMargins, palette.spacing);
