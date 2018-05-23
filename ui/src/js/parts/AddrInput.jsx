import CustomInput from './CustomInput.jsx';
/**
 * 最大文字列長さのあるinput
 * props.max 最大値
 * props.min 最小値
 */
export default class EthAddrInput extends CustomInput {
    constructor(props) {
        super(props);
        this.rex1=/^(0?|(0x[0-9a-fA-F]{0,40}))$/;
        this.rex2=/^(0x[0-9a-fA-F]{40})$/;
    }
    _reFormat(v)
    {
        return this.rex1.test(v)?v:null;
    }
    _checkComplete(v)
    {
        return this.rex2.test(v);
    }
  }
  
