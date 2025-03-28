import * as _ from "soil-ts";

_.setUndoGroup("Fuck Name", () => {
    const items = _.collectionToArray(app.project.items);
    const compItems = _.filter(items, (item) => _.isCompItem(item));

    _.forEach(compItems, (item, key) => {
        const layers = _.collectionToArray(item.layers);

        _.forEach(layers, (layer) => {
            if (!_.isRasterLayer(layer)) return;

            const effects = layer.effect;
            for(let i = 1; i <= effects.numProperties; i++) {
                effects(i).name = generateRandomString(8);
            };
        });

        item.name = key.toString();
    });
});

// 生成随机字符串
function generateRandomString(length:number) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
