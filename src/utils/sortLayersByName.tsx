/**
 * 按图层名称排序选中的图层
 * @param {Layer[]} layerArray - 被选中的图层数组
 * @param {string} order - 排序顺序，`asc` 为升序，`desc` 为降序
 * @returns {Layer[]} 排序后的图层数组\
 * @since 0.1.0
 * @category utils
 */
function sortLayersByName(layerArray: Layer[], order: string = 'asc'): Layer[] {
    return layerArray.sort((a, b) => {
        // 提取图层名称中的数字部分和字符部分
        const getSortKey = (name: string) => {
            const numberPart = /\d+$/.exec(name);  // 提取结尾的数字部分（如果有）
            const textPart = name.replace(/\d+$/, ''); // 提取数字以外的字符部分

            // 返回一个包含数字和字符的对象，确保数字部分优先
            return {
                number: numberPart ? parseInt(numberPart[0], 10) : NaN,  // 没有数字则返回NaN
                text: textPart
            };
        };

        const keyA = getSortKey(a.name);
        const keyB = getSortKey(b.name);

        // 先比较数字部分，数字存在时优先排序
        if (!isNaN(keyA.number) && !isNaN(keyB.number)) {
            return order === 'asc' ? keyA.number - keyB.number : keyB.number - keyA.number;
        } else if (!isNaN(keyA.number)) {
            return order === 'asc' ? -1 : 1;  // 如果a有数字而b没有，数字排前
        } else if (!isNaN(keyB.number)) {
            return order === 'asc' ? 1 : -1;  // 如果b有数字而a没有，数字排前
        }

        // 如果没有数字，则按字母部分排序
        return order === 'asc' ? keyA.text.localeCompare(keyB.text) : keyB.text.localeCompare(keyA.text);
    });
}

export default sortLayersByName