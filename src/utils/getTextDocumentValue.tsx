function getTextDocumentValue(value: TextDocument): canSetTextDocumentData {
    return {
        text: value.text,
        applyFill: value.applyFill,
        applyStroke: value.applyStroke,

        font: value.font,
        fontSize: value.fontSize,

        justification: value.justification,
        leading: value.leading,
        tracking: value.tracking,

        fillColor: value.applyFill ? value.fillColor : undefined,
        strokeColor: value.applyStroke ? value.strokeColor : undefined,
        strokeOverFill: value.applyStroke ? value.strokeOverFill : undefined,
        strokeWidth: value.applyStroke ? value.strokeWidth : undefined,
        boxTextSize: value.boxText ? value.boxTextSize : undefined
    }
}

export default getTextDocumentValue