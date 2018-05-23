import React from 'react';
import ReactDOM from 'react-dom';
import { isNumber,isUndefined} from "util";

export default class CustomInput extends React.Component {
    constructor(props) {
      super(props);
      var readonly=isUndefined(props.readonly)?false:props.readonly;
      this.defaultValue=isUndefined(props.defaultValue)?'':props.defaultValue;
      this.state = {readonly:readonly,value:this.defaultValue,complete:false};
      this.onChange = this.onChange.bind(this);
    }
    reset(){
      this.setState(Object.assign(this.state,{readonly:false,value:this.defaultValue,complete:false}));
      if(this.props.onChange){
        this.props.onChange();
      }
    }
    setValue(v){
        v=this._reFormat(v);
        if(v==null){
            return;
        }
        var new_complete=false;
        if(this._checkComplete(v)){
            new_complete=true;
        }
        this.setState(Object.assign(this.state,{complete:new_complete,value:v}));
        if(this.props.onChange){
            this.props.onChange();
        }
    }
    onChange(event) {
      this.setValue(event.target.value);
      event.preventDefault();
    }
    disabled(f){
      this.setState(Object.assign(this.state,{readonly:f}));
    }
    render() {
      return (
        <input type="text" placeholder={this.props.placeHolder} value={this.state.value} disabled={this.state.readonly} onChange={this.onChange} />
      );
    }
  }
