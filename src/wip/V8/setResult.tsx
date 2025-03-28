import * as _ from 'soil-ts';
import { duplicateLayers, setPropertyByData } from '../../utils';

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

function _readJSON(): AnyObject{
    const path = app.project.file;
    _.isFolder(path) && app.project.setDefaultImportFolder(path);

    const file = new File(app.project.file.path);
    let JSONFile = file.openDlg("Open a file", "Acceptable Files:*.json") as File;
    JSONFile.open("r");
    const readJSON = JSONFile.read();
    JSONFile.close();
    return _.parseJson(readJSON);
}

_.setUndoGroup("test", () => {
    const data = _readJSON();
    const acItem = _.getActiveItem();
    if (_.isCompItem(acItem)) {
        const barrageBaseLayer = _.findLayer(acItem, (layer) => layer.name === "弹幕1");

        const barrageLayers = duplicateLayers(barrageBaseLayer,data.barrageGroup.length,false);
        barrageBaseLayer.enabled = false;
        _.forEach(data.barrageGroup, (str:string, index) => {
            const formattedStr = str.replace(/\\n/g, '\n');
            setPropertyByData(barrageLayers[index],setTest(formattedStr))
        })

        const messageBaseLayer = _.findLayer(acItem, (layer) => layer.name === "留言1");
        const messageLayers = duplicateLayers(messageBaseLayer,data.messageGroup.length,false);
        messageBaseLayer.enabled = false;
        _.forEach(data.messageGroup, (str:string, index) => {
            const formattedStr = str.replace(/\\n/g, '\n');
            setPropertyByData(messageLayers[index], setTest(formattedStr));
        })

    }
})