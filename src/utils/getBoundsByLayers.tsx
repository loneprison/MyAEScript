import * as _ from 'soil-ts';

type Bounds = [number, number, number, number];
type Point = [number, number];

function mergeTwoBounds(current: Bounds, newBounds: Bounds): Bounds {
    const [currMinX, currMinY, currMaxX, currMaxY] = current;
    const [newMinX, newMinY, newMaxX, newMaxY] = newBounds;
    return [
        Math.min(currMinX, newMinX),
        Math.min(currMinY, newMinY),
        Math.max(currMaxX, newMaxX),
        Math.max(currMaxY, newMaxY),
    ];
}

function getBoundsByLayer(layer: Layer): Bounds {
    if (!_.isAVLayer(layer)) return [0, 0, 0, 0];

    const { width, height } = layer;
    const vertices: Point[] = [[0, 0], [width, 0], [width, height], [0, height]];

    const initialBounds: Bounds = [Infinity, Infinity, -Infinity, -Infinity];
    return _.reduce(
        _.map(vertices, v => {
            const [x, y] = layer.sourcePointToComp(v);
            return [x, y, x, y] as Bounds;
        }),
        (currentBounds, pointBounds) => mergeTwoBounds(currentBounds, pointBounds),
        initialBounds
    );
}

function mergeBounds(boundsList: Bounds[]): Bounds {
    if (_.isEmpty(boundsList)) {
        throw new Error("boundsList 不能为空");
    }

    return _.reduce(
        boundsList,
        (currentBounds, newBounds) => mergeTwoBounds(currentBounds, newBounds),
        [Infinity, Infinity, -Infinity, -Infinity] as Bounds
    );
}

function getBoundsByLayers(layers: Layer[]): Bounds {
    return mergeBounds(_.map(layers, getBoundsByLayer));
}

export default getBoundsByLayers;