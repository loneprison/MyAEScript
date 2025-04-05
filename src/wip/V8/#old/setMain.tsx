import * as _ from 'soil-ts';
import { setPropertyByData } from '../../../utils';

function getItemFromPath(pathArray: string[]): _ItemClasses | undefined {
    const project = app.project;
    let currentItem: _ItemClasses|undefined = void 0;  // 初始为 project，接着会逐层查找

    // 遍历路径数组
    for (let i = 0; i < pathArray.length; i++) {
        const folderName = pathArray[i];
        if (i == 0) {
            currentItem = _.findItem(project, (item) => item.name === folderName);
        } else if (_.isFolderItem(currentItem)) {
            if (i == pathArray.length - 1) {
                return _.findItem(currentItem, (item) => item.name === folderName);
            }

            currentItem = _.findItem(currentItem, (item) => item.name === folderName && _.isFolderItem(item));
        }

    }


    // 如果找不到该文件夹，返回 null
    if (!_.isFolderItem(currentItem)) {
        return void 0;
    }
    return currentItem
}



function setTest(str: string): PropertyDataStructure {
    return {
        "G0002 ADBE Text Properties": {
            "P0001 ADBE Text Document": {
                "name": "源文本",
                "value": {
                    "text": str,
                }
            },
        },

    }
}

function _readJSON() {
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
    const readJSON = _readJSON();
    _.forOwn(readJSON, (value, key) => {
        let getItem = getItemFromPath(["base", "main_base"])
        if (!_.isCompItem(getItem)) {
            $.writeln("错误,没有找到Base合成\n" + key)
            return
        }
        const newItem = getItem.duplicate();
        const videoItem = _.findItem(getItemFromPath(["20s"]) as FolderItem, (item) => {
            return item.name.indexOf(key.slice(4)) !== -1
        }) as AVItem
        const PngItem = _.findItem(getItemFromPath(["base", "main_PNG"]) as FolderItem, (item) => {
            return item.name.indexOf(key.slice(0, 3)) !== -1
        }) as AVItem

        if (newItem) {
            const mainFolder = getItemFromPath(["main"]) as FolderItem

            newItem.parentFolder = mainFolder;
            const layers = [
                { layerIndex: 1, text: value.song_name },
                { layerIndex: 2, text: value.id },
                { layerIndex: 3, text: value.singer },
                { layerIndex: 4, text: value.coop }
            ];

            _.forEach(layers, ({ layerIndex, text }) => {
                setPropertyByData(newItem.layer(layerIndex), setTest(text));
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

            replaceSourceInLayer(5, PngItem, "错误: 未找到对应的图片素材");
            replaceSourceInLayer(6, videoItem, "错误: 未找到对应的视频素材");
        }

        newItem.name = key
    })
})

