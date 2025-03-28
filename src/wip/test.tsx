import * as _ from 'soil-ts';
import { duplicateLayers, setPropertyByData } from '../utils';

const data = {
    "S0000 selfProperty": {
        "name": "改名测试",
    },
    "G0005 ADBE Effect Parade": {
        "G0001 ADBE Gaussian Blur 2": {
            "S0000 selfProperty": {
                "enabled": true,
                "name": "DF1"
            },
            "P0001 ADBE Gaussian Blur 2-0001": {
                "name": "模糊度",
                "value": 15
            },
        },
        "G0002 ADBE Gaussian Blur 2": {
            "S0000 selfProperty": {
                "enabled": false,
                "name": "DF2"
            },
            "P0001 ADBE Gaussian Blur 2-0001": {
                "name": "模糊度",
                "value": 20
            },
        }
    },
    "G0006 ADBE Transform Group": {
        "P0011 ADBE Opacity": {
            "name": "不透明度",
            "value": 20
        }
    }
}


const firstLayer = _.getFirstSelectedLayer();
duplicateLayers(firstLayer,10,true)
duplicateLayers(firstLayer,10,false)
_.setUndoGroup("test",()=>{
    setPropertyByData(firstLayer,data);
})