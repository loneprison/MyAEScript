/**
 * 按图层索引排序选中的图层
 * @param {Layer[]} layerArray - 被选中的图层数组
 * @param {string} order - 排序顺序，`asc` 为升序，`desc` 为降序
 * @returns {Layer[]} 排序后的图层数组
 * @since 0.1.0
 * @category utils
 */

function sortLayersByIndex(layerArray: Layer[], order: string = 'asc'): Layer[] {
    return layerArray.sort((a, b) => {
        if (order === 'asc') {
            return a.index - b.index;  // 升序
        } else {
            return b.index - a.index;  // 降序
        }
    });
}

export default sortLayersByIndex