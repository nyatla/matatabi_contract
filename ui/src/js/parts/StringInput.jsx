import CustomInput from './CustomInput.jsx';
import {isUndefined} from "util";
/**
 * 最大文字列長さのあるinput
 * props.max 最大値
 * props.min 最小値
 */
export default class StringInput extends CustomInput {
    constructor(props) {
        super(props);
    }
    _reFormat(v)
    {
        if(v.length>this.props.max){
            return null;
        }
        return v;
    }
    _checkComplete(v)
    {
        var i=parseInt(v);
        if(!isUndefined(this.props.max) && this.props.max<i){
            return false;
        }
        if(!isUndefined(this.props.min) && this.props.min>i){
            return false;
        }
        return true;
    }
}