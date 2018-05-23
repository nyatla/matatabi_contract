import React from 'react';
import ReactDOM from 'react-dom';
import { isNumber } from "util";

export default class BooleanCheckbox extends React.Component {
    constructor(props) {
      super(props);
      this.defaultValue=props.defaultCheck==''?false:(props.defaultCheck=='true'?true:false);
      this.state = {fix:false,value:this.defaultValue};
      this.handleChange = this.handleChange.bind(this);
    }
    _isUndef(v){
      return typeof v === "undefined";
    }
    reset(){
      this.setState(Object.assign(this.state,{fix:false,value:this.defaultValue}));
      if(this.props.onChange){
        this.props.onChange();
      }
    }
    setValue(v){
      this.setState(Object.assign(this.state,{value:v}));
      if(this.props.onChange){
        this.props.onChange();
      }
    }
    handleChange(event) {
      this.setValue(!this.state.value);
    }
    disabled(f){
      this.setState(Object.assign(this.state,{fix:f}));
    }
    render() {
      return (
        <input type="checkbox" checked={this.state.value} disabled={this.state.fix} onChange={this.handleChange} />
      );
    }
  }