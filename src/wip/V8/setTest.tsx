import * as _ from 'soil-ts';

function setPropertyValueByData(property: Property, dataObject: PropertyValueData) {
    // 设置表达式
    if ('expression' in dataObject) {
        property.expression = dataObject.expression;
    }
}

_.setUndoGroup('test', function() {
    let folder: FolderItem | null = null;
    for (let i = 1; i <= app.project.numItems; i++) {
        const item = app.project.item(i);
        if (item.name === 'sub' && item instanceof FolderItem) {
            folder = item;
            break;
        }
    }
    if (!folder) {
        throw new Error('Folder not found');
    }
    
    for(let i = 1; i <= folder.numItems; i++) {
        const comp = folder.item(i);
        if (comp instanceof CompItem) {
            const layer = comp.layer(1);
            if (layer instanceof TextLayer) {
                 $.writeln(`${layer.name}->${i}`)
                 const property = layer.property("ADBE Text Properties").property("ADBE Text Document") as Property;
                setPropertyValueByData(property, {
                    expression: 'if(value=="作者信息"){"无"}else{value}'
                });
            }
        }
    }
});