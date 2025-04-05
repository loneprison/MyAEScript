import * as _ from 'soil-ts';

// 烂代码......
// 一次性脚本，就不改了

function getItemFromPath(pathArray: string[]): _ItemClasses | undefined {
    const project = app.project;
    if (pathArray.length === 0) return void 0; // 提前返回空路径情况

    // 获取根文件夹
    let currentItem: _ItemClasses | undefined = _.findItem(project, (item) => item.name === pathArray[0]);
    if (!currentItem) return void 0; // 如果根目录找不到，直接返回

    // 遍历剩余路径
    for (let i = 1; i < pathArray.length; i++) {
        if (!_.isFolderItem(currentItem)) return void 0; // 不是文件夹直接返回

        // 查找子项
        currentItem = _.findItem<FolderItem>(currentItem, (item) => item.name === pathArray[i]);
        if (!currentItem) return void 0; // 如果找不到直接返回
    }

    return currentItem;
}


function setText(layer: TextLayer, string: string) {
    return _.setPropertyValue(layer, ["ADBE Text Properties", "ADBE Text Document"], string)
}

function _readJSON(): AnyObject {
    const path = app.project.file;
    if (!path) return {}
    _.isFolder(path) && app.project.setDefaultImportFolder(path);

    const file = new File(path.path);
    let JSONFile = file.openDlg("Open a file", "Acceptable Files:*.json") as File;
    JSONFile.open("r");
    const readJSON = JSONFile.read();
    JSONFile.close();
    return _.parseJson(readJSON);
}


_.setUndoGroup("test", () => {
    const readJSON: AnyObject = _readJSON();

    interface SongData {
        song_name?: string;
        id?: string;
        singer?: string;
        coop?: string;
    }
    _.forOwn(readJSON, (value: AnyObject, key) => {
        let getItem = getItemFromPath(["base", "sub_base"])
        if (!_.isCompItem(getItem)) {
            $.writeln("错误,没有找到Base合成\n" + key)
            return
        }
        const newItem = getItem.duplicate();
        const PngItem = _.findItem(getItemFromPath(["base", "sub_PNG"]) as FolderItem, (item) => {
            return item.name.indexOf(key) !== -1
        }) as AVItem

        if (newItem) {
            const mainFolder = getItemFromPath(["sub"]) as FolderItem

            newItem.parentFolder = mainFolder;
            const layers: { layerIndex: number, text: string|undefined }[] = [];
            _.forOwn(value, (item: SongData, index) => {
                if (!item) return;
                if (_.has(item, 'song_name')) {
                    layers.push({ layerIndex: 1 + parseInt(index) * 4, text: item.song_name });
                }
                if (_.has(item, 'id')) {
                    layers.push({ layerIndex: 2 + parseInt(index) * 4, text: item.id });
                }
                if (_.has(item, 'singer')) {
                    layers.push({ layerIndex: 3 + parseInt(index) * 4, text: item.singer });
                }
                if (_.has(item, 'coop')) {
                    layers.push({ layerIndex: 4 + parseInt(index) * 4, text: item.coop });
                }
            })

            _.forEach(layers, ({ layerIndex, text }) => {
                if(!text) text = " "
                setText(newItem.layer(layerIndex) as TextLayer, text)
            });

            const replaceSourceInLayer = (layerIndex: number, sourceItem: AVItem | undefined, errorMessage: string) => {
                if (sourceItem) {
                    const layer = newItem.layer(layerIndex);
                    if (_.isAVLayer(layer)) {
                        layer.replaceSource(sourceItem, false);
                    } else {
                        $.writeln(`错误: 未找到图层${layerIndex}\n${key}`);
                    }
                } else {
                    $.writeln(errorMessage + "\n" + key);
                }
            };

            replaceSourceInLayer(13, PngItem, "错误: 未找到对应的图片素材");
        }

        newItem.name = `${key}_sub`;
    })
})

