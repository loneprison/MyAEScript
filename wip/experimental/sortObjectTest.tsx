import * as _ from 'soil-ts';

// 定义排序函数，支持传入自定义排序规则
function baseSortObjectKeys<T extends Record<string, any>>(
    obj: T,
    customSort?: (a: string, b: string) => number // 自定义排序规则
): T {
    // 获取并排序对象的键名，使用传入的自定义排序规则
    const sortedKeys = customSort
        ? _.keys(obj).sort(customSort) // 如果传入自定义排序规则，使用它
        : _.keys(obj).sort(); // 否则按默认字典顺序排序

    // 重新生成排序后的对象
    const sortedObj: Record<string, any> = {};

    _.forEach(sortedKeys, (key) => {
        sortedObj[key] = obj[key];
    });

    return sortedObj as T; // 确保返回的类型是与输入一致的
}

function sortObjectKeysByData(object:Record<string, any>) {
    return baseSortObjectKeys(object, (a: string, b: string) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);

        if (numA === numB) {
            return a.localeCompare(b); // 字母排序
        }

        return numA - numB; // 数字排序
    });
}

const obj = {
    "G0002 ADBE Text Properties": {},
    "G0005 ADBE Transform Group": {},
    "P0001 ADBE Marker": {},
    "S0000 selfProperty": {}
};

const sortedObj = sortObjectKeysByData(obj)
$.writeln(_.stringify(sortedObj));