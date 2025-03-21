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

function getBoundsByLayers(layers: Layer[]): RectBounds {
    return mergeBounds(_.map(layers, getBoundsByLayer));
}

export default getBoundsByLayers;