import * as _ from 'soil-ts';
import { setPropertyByData } from '../../utils';

const firstLayer = _.getFirstSelectedLayer();
if (_.isRasterLayer(firstLayer)) {
    const data: PropertyDataStructure = {
        "G0005 ADBE Effect Parade": {
            "G0001 PSOFT GRADIENT": {
                "S0000 selfProperty": {
                    "enabled": true,
                    "name": "para_ctrl_A"
                },
                "P0001 PSOFT GRADIENT-0001": {
                    "name": "Blend Mode",
                    "value": 5
                },
                "P0003 PSOFT GRADIENT-0003": {
                    "name": "Start Point",
                    "value": [
                        firstLayer.width / 2,
                        firstLayer.height / 2,
                    ]
                },
                "P0004 PSOFT GRADIENT-0004": {
                    "name": "End Point",
                    "value": [
                        firstLayer.width / 2,
                        firstLayer.height,
                    ]
                },
                "P0006 PSOFT GRADIENT-0006": {
                    "name": "Start Color",
                    "value": [
                        0.5,
                        0.5,
                        0.5,
                        1
                    ]
                },
                "P0007 PSOFT GRADIENT-0007": {
                    "name": "End Color",
                    "value": [
                        0.09411764889956,
                        0.10196078568697,
                        0.13725490868092,
                        1
                    ]
                },
                "P0008 PSOFT GRADIENT-0008": {
                    "name": "Start Opacity",
                    "value": 0
                },
                "P0009 PSOFT GRADIENT-0009": {
                    "name": "End Opacity",
                    "value": 12
                },
            },
            "G0002 PSOFT GRADIENT": {
                "S0000 selfProperty": {
                    "enabled": true,
                    "name": "para_ctrl_B"
                },
                "P0001 PSOFT GRADIENT-0001": {
                    "name": "Blend Mode",
                    "value": 7
                },
                "P0003 PSOFT GRADIENT-0003": {
                    "name": "Start Point",
                    "expression": "effect(\"para_ctrl_A\")(3)"
                },
                "P0004 PSOFT GRADIENT-0004": {
                    "name": "End Point",
                    "expression": "effect(\"para_ctrl_A\")(4)"
                },
                "P0006 PSOFT GRADIENT-0006": {
                    "name": "Start Color",
                    "value": [
                        0.5,
                        0.5,
                        0.5,
                        1
                    ]
                },
                "P0007 PSOFT GRADIENT-0007": {
                    "name": "End Color",
                    "value": [
                        0.09411764889956,
                        0.10196078568697,
                        0.13725490868092,
                        1
                    ]
                },
                "P0008 PSOFT GRADIENT-0008": {
                    "name": "Start Opacity",
                    "value": 0
                },
                "P0009 PSOFT GRADIENT-0009": {
                    "name": "End Opacity",
                    "value": 20
                },
                "G0057 ADBE Effect Built In Params": {
                    "G0001 ADBE Effect Mask Parade": {}
                }
            },
            "G0003 PSOFT GRADIENT": {
                "S0000 selfProperty": {
                    "enabled": true,
                    "name": "flare"
                },
                "P0001 PSOFT GRADIENT-0001": {
                    "name": "Blend Mode",
                    "value": 7
                },
                "P0003 PSOFT GRADIENT-0003": {
                    "name": "Start Point",
                    "value": [
                        firstLayer.width / 2,
                        0,
                    ]
                },
                "P0004 PSOFT GRADIENT-0004": {
                    "name": "End Point",
                    "value": [
                        firstLayer.width / 2,
                        firstLayer.height / 2,
                    ]
                },
                "P0006 PSOFT GRADIENT-0006": {
                    "name": "Start Color",
                    "value": [
                        0.90196079015732,
                        0.94901961088181,
                        1,
                        1
                    ]
                },
                "P0009 PSOFT GRADIENT-0009": {
                    "name": "End Opacity",
                    "value": 0
                }
            }
        }
    }
    _.setUndoGroup("newPara", () => {
        setPropertyByData(firstLayer, data)
    })
}