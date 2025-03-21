/**
 * 获取源文本的可读/写数据
 * 
 * @param TextDocument 根属性
 * @since 0.1.0
 * @category utils
 */
function getTextDocumentValue(TextDocument: TextDocument): canSetTextDocumentData {
    return {
        text: TextDocument.text,
        applyFill: TextDocument.applyFill,
        applyStroke: TextDocument.applyStroke,

        font: TextDocument.font,
        fontSize: TextDocument.fontSize,

        justification: TextDocument.justification,
        leading: TextDocument.leading,
        tracking: TextDocument.tracking,

        fillColor: TextDocument.applyFill ? TextDocument.fillColor : undefined,
        strokeColor: TextDocument.applyStroke ? TextDocument.strokeColor : undefined,
        strokeOverFill: TextDocument.applyStroke ? TextDocument.strokeOverFill : undefined,
        strokeWidth: TextDocument.applyStroke ? TextDocument.strokeWidth : undefined,
        boxTextSize: TextDocument.boxText ? TextDocument.boxTextSize : undefined
    }
}

export default getTextDocumentValue