import * as _ from 'soil-ts';

// 定义排序函数，支持传入自定义排序规则
function baseSortObjectKeys<T extends Record<string, any>>(
    obj: T,
    customSort?: (a: string, b: string) => number // 自定义排序规则
): T {
    // 获取并排序对象的键名，使用传入的自定义排序规则
    const sortedKeys = customSort
        ? _.keys(obj).sort(customSort) // 如果传入自定义排序规则，使用它
        : _.keys(obj).sort((a, b) => a.localeCompare(b)); // 否则按默认字典顺序排序

    // 重新生成排序后的对象
    const sortedObj: Record<string, any> = {};

    _.forEach(sortedKeys, (key) => {
        sortedObj[key] = obj[key];
    });

    return sortedObj as T; // 确保返回的类型是与输入一致的
}




/**
 * 根据键中数字部分的大小对对象的键进行排序，如果数字部分相同则按字母顺序排序。
 *
 * @param {Record<string, any>} object 要排序的对象
 * @returns {Record<string, any>} 排序后的对象
 * @since 0.1.0
 * @category utils
 * @example
 * const obj = { 'key10': 1, 'key2': 2, 'key1': 3 };
 * const sortedObj = sortObjectKeysByData(obj);
 * // sortedObj = { 'key1': 3, 'key2': 2, 'key10': 1 }
 */
function sortObjectKeysByData(object:Record<string, any>) {
    return baseSortObjectKeys(object, (a: string, b: string) => {
        const numA = parseInt(/\d+/.exec(a)?.[0] || "0", 10);
        const numB = parseInt(/\d+/.exec(b)?.[0] || "0", 10);

        if (numA === numB) {
            return a.localeCompare(b); // 字母排序
        }

        return numA - numB; // 数字排序
    });
}

export default sortObjectKeysByData