import * as _ from 'soil-ts';

function mergeTwoBounds(current: RectBounds, newBounds: RectBounds): RectBounds {
    const [currMinX, currMinY, currMaxX, currMaxY] = current;
    const [newMinX, newMinY, newMaxX, newMaxY] = newBounds;
    return [
        Math.min(currMinX, newMinX),
        Math.min(currMinY, newMinY),
        Math.max(currMaxX, newMaxX),
        Math.max(currMaxY, newMaxY),
    ];
}

function getBoundsByLayer(layer: Layer): RectBounds {
    if (!_.isAVLayer(layer)) return [0, 0, 0, 0];

    const { width, height } = layer;
    const vertices: TwoDPoint[] = [[0, 0], [width, 0], [width, height], [0, height]];

    const initialBounds: RectBounds = [Infinity, Infinity, -Infinity, -Infinity];
    return _.reduce(
        _.map(vertices, v => {
            const [x, y] = layer.sourcePointToComp(v);
            return [x, y, x, y] as RectBounds;
        }),
        (currentBounds, pointBounds) => mergeTwoBounds(currentBounds, pointBounds),
        initialBounds
    );
}

function mergeBounds(boundsList: RectBounds[]): RectBounds {
    if (_.isEmpty(boundsList)) {
        throw new Error("boundsList 不能为空");
    }

    return _.reduce(
        boundsList,
        (currentBounds, newBounds) => mergeTwoBounds(currentBounds, newBounds),
        [Infinity, Infinity, -Infinity, -Infinity] as RectBounds
    );
}

/**
 * 计算一组图层的合并矩形边界。
 *
 * 该函数接收一个包含多个 `Layer` 对象的数组，并返回它们的合并边界。
 * 请注意！！！对于非 `AVLayer` 对象，该函数会返回一个空矩形边界。
 * 因此请推荐在使用函数前进行检查/过滤。
 *
 * @param {Layer[]} layers 一个包含多个 `Layer` 对象的数组，需要计算其边界。
 * @returns {RectBounds} 一个 `RectBounds` 对象，表示所有提供图层的合并边界。
 * @since 0.1.0
 * @category utils
 * @example
 *
 * ```ts
 * const layers = _.getSelectedLayers();
 * const bounds = getBoundsByLayers(layers);
 * // 结果：返回合并后的矩形边界。
 * ```
 */
function getBoundsByLayers(layers: Layer[]): RectBounds {
    return mergeBounds(_.map(layers, getBoundsByLayer));
}

export default getBoundsByLayers;