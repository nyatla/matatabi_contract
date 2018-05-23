import CustomInput from './CustomInput.jsx';
import {isUndefined} from "util";
import {Decimal} from 'decimal.js';

/**
 * 範囲付きのUINT input
 * 
 * props.max 最大値
 * props.min 最小値
 */
export default class UIntInput extends CustomInput {
    constructor(props) {
        super(props);
        this.rex1=/^([0-9]*)$/;
        this.max=isUndefined(props.max)?undefined:new Decimal(props.max);
        this.min=isUndefined(props.min)?undefined:new Decimal(props.min);
    }
    _reFormat(v)
    {
        if(!this.rex1.test(v)){
            return null;
        }
        if(v==''){
            return this.min.floor().toString(vn);;
        }
        var vn=new Decimal(v);

        if(!isUndefined(this.max) && vn.greaterThan(this.max)){
            return this.max.floor().toString(vn);
        }
        return v;
    }
    _checkComplete(v)
    {
        var vn=new Decimal(v);
        if(!isUndefined(this.max) && vn.greaterThan(this.max)){
            return false;
        }
        if(!isUndefined(this.min) && vn.lessThan(this.min)){
            return false;
        }
        return true;
    }
}
