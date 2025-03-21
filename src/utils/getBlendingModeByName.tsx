/**
 * 根据混合模式名称获取对应的混合模式枚举值。
 *
 * 该函数根据传入的中文名称返回对应的 `BlendingMode` 枚举值，如果传入的名称不匹配任何已知的混合模式，则默认返回 `BlendingMode.NORMAL`。
 *
 * @param {BlendingModeString} name 混合模式的中文名称。
 * @returns {BlendingMode} 对应的 `BlendingMode` 枚举值。
 * @since 0.1.0
 * @category utils
 * @example
 *
 * ```ts
 * const blendingMode = getBlendingModeByName("溶解");
 * // 结果：返回 BlendingMode.DISSOLVE。
 *
 * const defaultBlendingMode = getBlendingModeByName("不存在的混合模式");
 * // 结果：返回 BlendingMode.NORMAL。
 * ```
 */
function getBlendingModeByName(name: BlendingModeString): BlendingMode {
    const blendingModes: Record<string, BlendingMode> = {
        "正常": BlendingMode.NORMAL,
        "溶解": BlendingMode.DISSOLVE,
        "动态抖动溶解": BlendingMode.DANCING_DISSOLVE,
        "变暗": BlendingMode.DARKEN,
        "相乘": BlendingMode.MULTIPLY,
        "颜色加深": BlendingMode.COLOR_BURN,
        "经典颜色加深": BlendingMode.CLASSIC_COLOR_BURN,
        "线性加深": BlendingMode.LINEAR_BURN,
        "较深的颜色": BlendingMode.DARKER_COLOR,
        "相加": BlendingMode.ADD,
        "变亮": BlendingMode.LIGHTEN,
        "屏幕": BlendingMode.SCREEN,
        "颜色减淡": BlendingMode.COLOR_DODGE,
        "经典颜色减淡": BlendingMode.CLASSIC_COLOR_DODGE,
        "线性减淡": BlendingMode.LINEAR_DODGE,
        "较浅的颜色": BlendingMode.LIGHTER_COLOR,
        "叠加": BlendingMode.OVERLAY,
        "柔光": BlendingMode.SILHOUETTE_LUMA,
        "强光": BlendingMode.HARD_LIGHT,
        "线性光": BlendingMode.LINEAR_LIGHT,
        "亮光": BlendingMode.VIVID_LIGHT,
        "点光": BlendingMode.PIN_LIGHT,
        "纯色混合": BlendingMode.HARD_MIX,
        "差值": BlendingMode.DIFFERENCE,
        "经典差值": BlendingMode.CLASSIC_DIFFERENCE,
        "排除": BlendingMode.EXCLUSION,
        "相减": BlendingMode.SUBTRACT,
        "相除": BlendingMode.DIVIDE,
        "色相": BlendingMode.HUE,
        "饱和度": BlendingMode.SATURATION,
        "颜色": BlendingMode.COLOR,
        "发光度": BlendingMode.LUMINOSITY,
        "模板 Alpha": BlendingMode.STENCIL_ALPHA,
        "模板亮度": BlendingMode.STENCIL_LUMA,
        "轮廓 Alpha": BlendingMode.SILHOUETE_ALPHA,
        "轮廓亮度": BlendingMode.SILHOUETTE_LUMA,
        "Alpha 添加": BlendingMode.ALPHA_ADD,
        "冷光预乘": BlendingMode.LUMINESCENT_PREMUL,
    };

    return blendingModes[name] || BlendingMode.NORMAL; // 如果输入的中文名称不匹配任何枚举值，则返回 BlendingMode.NORMAL
}

export default getBlendingModeByName