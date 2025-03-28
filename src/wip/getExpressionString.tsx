import * as _ from 'soil-ts';
import {  copyToClipboardAdvance } from '../utils';

const firstProperty = _.getFirstSelectedProperty();

if(_.isProperty(firstProperty)) {
    if(firstProperty.canSetExpression&&firstProperty.expressionEnabled){
        copyToClipboardAdvance(firstProperty.expression);
    }else{
        alert("该属性未设置/不支持表达式")
    }
}else{
    alert("请选择一个属性")
}