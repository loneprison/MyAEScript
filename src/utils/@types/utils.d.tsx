type BlendingModeString =
    | "正常"
    | "溶解"
    | "动态抖动溶解"
    | "变暗"
    | "相乘"
    | "颜色加深"
    | "经典颜色加深"
    | "线性加深"
    | "较深的颜色"
    | "相加"
    | "变亮"
    | "屏幕"
    | "颜色减淡"
    | "经典颜色减淡"
    | "线性减淡"
    | "较浅的颜色"
    | "叠加"
    | "柔光"
    | "强光"
    | "线性光"
    | "亮光"
    | "点光"
    | "纯色混合"
    | "差值"
    | "经典差值"
    | "排除"
    | "相减"
    | "相除"
    | "色相"
    | "饱和度"
    | "颜色"
    | "发光度"
    | "模板 Alpha"
    | "模板亮度"
    | "轮廓 Alpha"
    | "轮廓亮度"
    | "Alpha 添加"
    | "冷光预乘";

type TrackMatteTypeString =
    | "Alpha 遮罩"
    | "Alpha 反转遮罩"
    | "亮度遮罩"
    | "亮度反转遮罩"
    | "无"


/**
 * 该接口用于描述某个属性值的具体数据，包括值、表达式以及关键帧信息。
 * 
 * - `value`：该属性的当前值，可能是任何类型。
 * - `expression`：与属性关联的表达式。
 * - `Keyframe`：该属性的关键帧数据，存储在 `Keyframe[]` 数组中。
 * 
 * @interface PropertyValueData
 * @since 0.1.0
 * @category Utility
 * 
 * @example
 * ```ts
 * const propertyValueData: PropertyValueData = {
 *     value: 100,
 *     expression: "time * 10",
 *     Keyframe: [
 *         { time: 0, value: 0 },
 *         { time: 1, value: 100 },
 *         { time: 2, value: 200 }
 *     ]
 * };
 * ```
 */
interface PropertyValueData {
    /** 属性的当前值，可以是任何类型的值 */
    value?: any;

    /** 该属性的表达式，适用于需要动画或计算的属性 */
    expression?: string;

    /** 属性的关键帧数据，请使用Soil的getKeyframeValues获取关键帧代码 */
    Keyframe?: Keyframe[];

    /** 属性的名字，一般在调试以外的场合不作获取 */
    name?: string;
}


/**
 * 图层的公共元数据接口，用于描述图层的基本属性和状态。
 *
 * 该接口包含了一些可选的属性字段，适用于描述图层的基本信息，如是否启用、图层索引、匹配名称以及图层的命名等。
 * 这些字段对于管理和操作图层的元数据非常有用。
 *
 * @interface
 * @since 0.1.0
 * @category Data
 * @example
 *
 * ```ts
 * const layerMetadata: PropertyMetadata = {
 *     enabled: true,
 *     index: 2,
 *     matchName: "ADBE Text Layer",
 *     name: "Title Layer"
 * };
 * ```
 */
interface PropertyMetadata {
    /**
     * 图层是否启用（例如图层的小眼睛控制，是否可见）。
     * 
     * @type {boolean}
     * @default undefined
     */
    enabled?: boolean;

    /**
     * 图层在合成中的顺序（从 1 开始的索引）。
     * 
     * @type {number}
     * @default undefined
     */
    index?: number;

    /**
     * 图层的匹配名称，用于在脚本中精确引用该图层，仅可读
     * 
     * @type {string}
     * @default undefined
     */
    matchName?: string;

    /**
     * 图层的名称，显示在 After Effects 的图层面板中。
     * 
     * @type {string}
     * @default undefined
     */
    name?: string;
}

/**
 * 基础图层元数据接口，包含图层的基本属性与状态信息。
 * 
 * 该接口包含图层的时间控制、标签、锁定、隐藏等元数据。
 *
 * @interface BaseLayerMetadata
 * @since 0.1.0
 * @category Layer
 */

interface BaseLayerMetadata extends PropertyMetadata {

    /**
     * 图层的自动定向类型，影响图层是否根据运动方向自动定向。
     * 
     * @type {AutoOrientType}
     * @default undefined
     */
    autoOrient?: AutoOrientType;

    /**
     * 图层的入点，表示图层开始显示的时间（秒）。
     * 
     * @type {number}
     * @default undefined
     */
    inPoint?: number;

    /**
     * 图层的出点，表示图层结束显示的时间（秒）。
     * 
     * @type {number}
     * @default undefined
     */
    outPoint?: number;

    /**
     * 图层的开始时间，表示图层的时间偏移。
     * 
     * @type {number}
     * @default undefined
     */
    startTime?: number;

    /**
     * 图层的拉伸比例，改变图层的持续时间。
     * 
     * @type {number}
     * @default undefined
     */
    stretch?: number;

    /**
     * 图层的时间，表示图层时间轴的位置。
     * 
     * @type {number}
     * @default undefined
     */
    time?: number;

    /**
     * 图层的标签编号，用于在面板中区分不同图层的颜色标签。
     * 
     * @type {number}
     * @default undefined
     */
    label?: number;

    /**
     * 图层是否被锁定，防止其被编辑。
     * 
     * @type {boolean}
     * @default undefined
     */
    locked?: boolean;

    /**
     * 图层是否隐藏，用于在合成中隐藏不需要显示的图层。
     * 
     * @type {boolean}
     * @default undefined
     */
    shy?: boolean;

    /**
     * 图层是否为独显图层，仅显示该图层而隐藏其他图层。
     * 
     * @type {boolean}
     * @default undefined
     */
    solo?: boolean;

    /**
     * 图层的唯一 ID，用于区分不同的图层。
     * 
     * @type {number}
     * @default undefined
     */
    id?: number;
}

/**
 * RasterLayer（光栅图层）专属元数据接口，继承自 BaseLayerMetadata。
 * 
 * 该接口包含与光栅图层特有的属性和功能相关的元数据，例如调整图层、音频激活、混合模式等。
 *
 * @interface RasterLayerMetadata
 * @extends BaseLayerMetadata
 * @since 0.1.0
 * @category Layer
 */
interface RasterLayerMetadata extends BaseLayerMetadata {
    /**
     * 是否设置为调整图层，调整图层用于影响下面所有图层的效果。
     * 
     * @type {boolean}
     * @default undefined
     */
    adjustmentLayer?: boolean;

    /**
     * 是否激活音频，如果图层有音频内容。
     * 
     * @type {boolean}
     * @default undefined
     */
    audioEnabled?: boolean;

    /**
     * 图层的混合模式，决定图层与下方图层的混合方式。
     * 
     * @type {BlendingMode}
     * @default undefined
     */
    blendingMode?: BlendingMode;

    /**
     * 图层的效果是否处于激活状态。
     * 
     * @type {boolean}
     * @default undefined
     */
    effectsActive?: boolean;

    /**
     * 是否为环境图层，用于特定的合成和效果。
     * 
     * @type {boolean}
     * @default undefined
     */
    environmentLayer?: boolean;

    /**
     * 图层的帧混合类型，控制如何处理帧率和运动。
     * 
     * @type {FrameBlendingType}
     * @default undefined
     */
    frameBlendingType?: FrameBlendingType;

    /**
     * 是否启用时间重新映射，用于控制图层时间的变化。
     * 
     * @type {boolean}
     * @default undefined
     */
    timeRemapEnabled?: boolean;

    /**
     * 是否为参考图层，用于设置图层的辅助标志。
     * 
     * @type {boolean}
     * @default undefined
     */
    guideLayer?: boolean;

    /**
     * 是否启用运动模糊，用于图层运动时产生模糊效果。
     * 
     * @type {boolean}
     * @default undefined
     */
    motionBlur?: boolean;

    /**
     * 是否保留透明度设置，影响图层的透明度表现。
     * 
     * @type {boolean}
     * @default undefined
     */
    preserveTransparency?: boolean;

    /**
     * 图层的质量设置，影响渲染的质量。
     * 
     * @type {LayerQuality}
     * @default undefined
     */
    quality?: LayerQuality;

    /**
     * 图层的采样质量，控制图层渲染的质量。
     * 
     * @type {LayerSamplingQuality}
     * @default undefined
     */
    samplingQuality?: LayerSamplingQuality;

    /**
     * 图层的轨迹遮罩类型，用于设置图层的遮罩行为。
     * 
     * @type {number}
     * @default undefined
     */
    trackMatteType?: number;

    threeDLayer?: boolean;

    threeDPerChar?: boolean;

    /**
     * 图层的高度，适用于合成或图层本身的尺寸。
     * 
     * @type {number}
     * @default undefined
     */
    height?: number;

    /**
     * 图层的宽度，适用于合成或图层本身的尺寸。
     * 
     * @type {number}
     * @default undefined
     */
    width?: number;
}



/**
 * 属性数据结构接口。
 * 
 * 该接口表示包含多个属性的结构。每个属性通过键值对形式存储，可以是一个嵌套属性组（`NestedPropertyGroup`）或属性元数据（`PropertyMetadata`）。
 * 
 * @interface PropertyDataStructure
 * @since 0.1.0
 * @category Utility
 * 
 * @example
 * ```ts
 * const propertyData: PropertyDataStructure = {
 *     "G0001 Property Group": {
 *         "P0001 Property Name": {
 *             value: 100,
 *             expression: "time * 10"
 *         },
 *         "G0002 Nested Property Group": {
 *             "P0002 Another Property": {
 *                 value: 50
 *             }
 *         }
 *     }
 * };
 * ```
 */
interface PropertyDataStructure {
    [key: string]: PropertyValueData | PropertyDataStructure | PropertyMetadata;
}

// 我不会写继承，所以就手写了
type canSetTextDocumentData = {
    text?: string
    applyFill?: boolean
    applyStroke?: boolean
    fillColor?: ThreeDColorValue
    font?: string
    fontSize?: number
    justification?: ParagraphJustification
    leading?: number
    strokeColor?: ThreeDColorValue
    strokeOverFill?: boolean
    strokeWidth?: number
    tracking?: number
    boxTextSize?: [number, number]
}



/**
 * 表示矩形的边界，使用四个数字的元组表示。
 * 
 * @typeParam [number, number, number, number] - 元组包含以下内容：
 * - 矩形左边的 x 坐标。
 * - 矩形顶部的 y 坐标。
 * - 矩形右边的 x 坐标。
 * - 矩形底部的 y 坐标。
 */
type RectBounds = [number, number, number, number];