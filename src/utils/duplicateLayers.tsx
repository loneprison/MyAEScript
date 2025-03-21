/**
 * 复制图层并返回一个包含所有复制图层的数组。
 *
 * 根据参数 `quantity` 指定要复制的图层数量，并且可以选择是否包含原始图层。
 * 默认情况下，原始图层会被包含在返回的数组中。
 *
 * @param {Layer} getLayer 要复制的原始图层。
 * @param {number} [quantity=1] 要复制的图层数量，默认为 1。
 * @param {boolean} [includesSelf=true] 是否包括原始图层在返回的数组中，默认为 `true`。
 * @returns {Layer[]} 包含所有复制图层的数组。
 * @since 0.1.0
 * @category utils
 * @example
 *
 * ```ts
 * const layer = compItem.layer(1);
 * const duplicatedLayers = duplicateLayers(layer, 3);
 * // 结果：将原始图层以及两个复制的图层一起返回。
 *
 * const duplicatedLayersWithoutSelf = duplicateLayers(layer, 3, false);
 * // 结果：只返回两个复制的图层，原始图层不包括在内。
 * ```
 */

function duplicateLayers(getLayer: Layer, quantity: number = 1, includesSelf: boolean = true): Layer[] {
    const layers: Layer[] = includesSelf ? [getLayer] : []; // 创建一个数组来存储复制的图层

    for (let i = 0; i < quantity; i++) {
        getLayer = getLayer.duplicate(); // 先复制图层并赋值
        layers.push(getLayer); // 复制图层并将其添加到数组中
    }
    return layers; // 返回所有复制的图层
}

export default duplicateLayers