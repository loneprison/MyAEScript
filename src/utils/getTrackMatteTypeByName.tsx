/**
 * 根据遮罩类型名称获取对应的遮罩类型枚举值。
 *
 * 该函数根据传入的中文名称返回对应的 `TrackMatteType` 枚举值。
 * 如果传入的名称不匹配任何已知的遮罩类型，则返回 `undefined`。
 *
 * @param {TrackMatteTypeString} name 遮罩类型的中文名称。
 * @returns {TrackMatteType} 对应的 `TrackMatteType` 枚举值。
 * @since 0.1.0
 * @category utils
 * @example
 *
 * ```ts
 * const matteType = getTrackMatteTypeByName("Alpha 遮罩");
 * // 结果：返回 TrackMatteType.ALPHA。
 *
 * const unknownMatteType = getTrackMatteTypeByName("未知类型");
 * // 结果：返回 undefined。
 * ```
 */
function getTrackMatteTypeByName(name: TrackMatteTypeString): TrackMatteType {
    const trackMatteTypes: Record<string, TrackMatteType> = {
        "Alpha 遮罩": TrackMatteType.ALPHA,
        "Alpha 反转遮罩": TrackMatteType.ALPHA_INVERTED,
        "亮度遮罩": TrackMatteType.LUMA,
        "亮度反转遮罩": TrackMatteType.LUMA_INVERTED,
        "无": TrackMatteType.NO_TRACK_MATTE,
    };

    return trackMatteTypes[name]; // 如果输入的中文名称不匹配任何枚举值，则返回 undefined
}

export default getTrackMatteTypeByName