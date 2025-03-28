import * as _ from 'soil-ts';

const selfString = [
    'enabled',
    'name',
    'autoOrient',
    'inPoint',
    'outPoint',
    'startTime',
    'stretch',
    'time',
    'label',
    'locked',
    'shy',
    'solo',
    'adjustmentLayer',
    'audioEnabled',
    'blendingMode',
    'effectsActive',
    'environmentLayer',
    'frameBlendingType',
    'timeRemapEnabled',
    'guideLayer',
    'motionBlur',
    'preserveTransparency',
    'quality',
    'samplingQuality',
    'trackMatteType',
    'height',
    'width',
];
const layerProperty = [
    'VectorsGroup',
    'TextProperties',
    'Transform',
    'OptionsGroup',
    'LayerStyles',
    'Mask',
    'Effect',
    'Audio',
    'Camera',
    'Light',
    'Marker',
    'TimeRemapping',
];

let UISource = {
    style: {
        text: '测试单元',
        margins: 10,
        spacing: 16,
        orientation: 'column',
        alignment: ['fill', 'fill'],
    },
    group1: {
        style: {
            orientation: 'column',
            alignChildren: ['center', 'fill'],
            spacing: 10,
            margins: 0,
        },
        panel1: {
            style: {
                text: 'selfParam',
                orientation: 'column',
                alignChildren: ['center', 'fill'],
                spacing: 10,
                margins: 10,
            },
        },
        panel2: {
            style: {
                text: 'PropertyGroup',
                orientation: 'column',
                alignChildren: ['left', 'top'],
                spacing: 10,
                margins: 10,
            }
        },
    },

    group3: {
        style: {
            orientation: 'column',
            alignChildren: ['fill', 'fill'],
            spacing: 200,
            margins: 0,
        },
        edittext1: {
            style: { preferredSize: [200, 230] },
            param: ['run1', undefined, '按钮', { multiline: true, scrolling: true }],
        },
    },
    group4: {
        style: {
            orientation: 'column',
            alignChildren: ['center', 'fill'],
            spacing: 10,
            margins: 0,
        },
        button1: ['run1', [0, 0, 100, 30], '按钮'],
        button2: ['run2', [0, 0, 100, 30], '按钮'],
    },
};

const groupStyle = {
    orientation: 'row',
    alignChildren: ['center', 'fill'],
    spacing: 10,
    margins: 0,
};

const createCheckboxGroupedData = (dataArray: Array<string>, name: string) => _.reduce(
    dataArray,
    (result: AnyObject, value, key) => {
        const groupIndex = Math.floor(key / 4) + 1; // 每 4 个元素分组
        const groupKey = `group${groupIndex}`;

        if (!result[groupKey]) {
            // 初始化分组对象
            result[groupKey] = { style: { ...groupStyle } };
        }

        const checkboxKey = `checkbox${(key % 4) + 1}`; // 生成 checkbox#
        result[groupKey][checkboxKey] = [`name${key}`, undefined, value];

        return result;
    },
    {}
);

// 转换逻辑
const selfGroupedData =createCheckboxGroupedData(selfString,'selfString');
const layerPropertyGroupedData =createCheckboxGroupedData(layerProperty,'layerProperty');


UISource.group1.panel1 = {
    ...UISource.group1.panel1,
    ...selfGroupedData,
}
UISource.group1.panel2 = {
    ...UISource.group1.panel2,
    ...layerPropertyGroupedData,
}

let elements = _.tree.parse(UISource);