/*
    トークンの送受信画面。



    Web3の有無により機能が異なる。
    Web3がない場合
    →QRコードと送信先アドレスのみを表示する。
    Web3がある場合
    →入力フィールドを表示する。



    
    １．パラメータの入力フォームとコントラクトのデプロイ機能
    ２．デプロイ結果の表示とブログパーツの生成機能への引き渡し








*/
import React from 'react';
import ReactDOM from 'react-dom';
import { isNumber } from "util";

import StringInput from "./parts/StringInput.jsx";
import UIntInput from "./parts/UIntInput.jsx";
import BooleanCheckbox from "./parts/BooleanCheckbox.jsx";

var Web3Wrapper=require("./Web3Wrapper.js");
var CONTRACT=require("./contract.js");









class App extends React.Component{
  constructor(props) {
    super(props);
    this.state={};
  }
  componentDidMount()
  {
    var _t=this;    
    this.web3=new Web3Wrapper(function(state){
      _t.setState(Object.assign(_t.state,{st:state}));
      console.log("APP status:"+state);
    });
  }
  render()
  {
    var content=<div>Deploy UI</div>;
    if(this.web3){
      switch(this.state.st){
      case this.web3.ST.E_NOACCOUNT:
        content=<div>Account not exist.</div>;
        break;
      case this.web3.ST.E_NOWEB3:
        content=<div>Can not connuko to Web3 provider.</div>;
        break;
      case this.web3.ST.READY:
        content=
        <div>
          <div><InputForm/></div>
        </div>;
        break;
      }
    }
    
    return(
      <div>
      <h1>MatatabiToken Factory</h1>
      <hr></hr>
      <div>{content}</div>
      </div>
    );
  }
}


/**
 * イベント
 * OnError
 * エラーが発生した
 * OnDeploy
 * デプロイ開始
 * OnDeployed
 * デプロイ完了
 */
class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      count:1
    }
    this.rows=[];
    this.handleDeploy = this.handleDeploy.bind(this);
  }
  handleDeploy(){
      this.web3.deployContract();
    //
  }
  render() {
    const amount=(this.default_amount)?this.default_amount.state.value:'';
    console.log(amount);


    return (
      <div className="AddrForm">
        <div>
          <div>InitialTotalSupply<UIntInput   ref={(i) => {this.ctrl[0] = (i)}} min="1" max="9223372036854775807" defaultValue="4294967295"/></div>
          <div>TokenName<StringInput          ref={(i) => {this.ctrl[1] = (i)}} min="3" max="63"/></div>
          <div>TokenSymbol<StringInput        ref={(i) => {this.ctrl[2] = (i)}} min="2" max="15"/></div>
          <div>TransferEnable<BooleanCheckbox ref={(i) => {this.ctrl[3] = (i)}} defaultCheck="false"/></div>
          <div>ExchangeRate<UIntInput         ref={(i) => {this.ctrl[4] = (i)}} min="1" max="10000" defaultValue="1000"/></div>
          <div>MaxTokenPerAmount<UIntInput    ref={(i) => {this.ctrl[5] = (i)}} min="1" max="9223372036854775807" defaultValue="100000000"/></div>
          <div>LockupUpdate<UIntInput         ref={(i) => {this.ctrl[6] = (i)}} min="0" max="255" defaultValue="15"/></div>
          <div>LockupCancel<UIntInput         ref={(i) => {this.ctrl[7] = (i)}} min="0" max="60480" defaultValue="4320"/></div>
        </div>   
        <button type="button" value="Add" onClick={this.handleDeploy}>Deploy</button>
        <ul>
          <li>InitialTotalSupply - トークン供給量の最大値です。あとで加算できます。</li>
          <li>TokenName - トークン名です3-256文字にしてください。</li>
          <li>TokenSymbol - トークンのシンボル名です。2-31文字にしてください。</li>
          <li>TransferEnable - トークンの送受信機能の有効フラグです。後で変更できます。（日本国内で有効化する場合は、仮想通貨交換事業者の登録が必要になる場合があります。）</li>
          <li>ExchangeRate - 1NUKOに対して配布するトークンの量です。後で変更できます。</li>
          <li>MaxTokenPerAmount - 1アカウントが所有できるトークンの最大量です。後で加算できます。</li>
          <li>LockupUpdate - トークンパラメータを変更した後に交換機能を停止する期間を示すブロック数です。変更の周知期間です。</li>
          <li>LockupCancel - 交換のキャンセルを受け付ける期間を示すブロック数です。</li>
        </ul>
        <div id="footer"><a  target="_blank" rel="noreferrer noopener" href="https://github.com/nyatla/NekoniumWebApp/tree/master/nukosousinki">Github</a>&nbsp;-&nbsp;<a  target="_blank" rel="noreferrer noopener" href="https://nekonium.github.io/">Nekonium Project</a></div>
      </div>
    );
  }
}





  // uint256 _initialTotalSupply,
  // string  _tokenName,
  // string  _tokenSymbol,
  // bool    _transferEnable,
  // uint16  _rate,
  // uint64  _maxTokenPerAccount,
  // uint8   _lockup_update,
  // uint16  _lockup_cancel

  // class AddrForm extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state={
  //       count:1
  //     }
  //     this.rows=[];
  //     this.handleAdd = this.handleAdd.bind(this);
  //     this.handleReset = this.handleReset.bind(this);
  //     this.handleSendAll = this.handleSendAll.bind(this);
  //     this.handleSetAmount = this.handleSetAmount.bind(this);
  //   }
  //   handleAdd(event) {
  //     console.log("add");
  //     this.setState({count:this.state.count+1});
  //     event.preventDefault();
  //   }
  //   handleReset(event) {
  //     if(window.confirm("アプリケーションをリセットしますか？\n入力した内容はすべて失われます。")){
  //       this.rows[0].reset();
  //       this.setState({count:1});
  //     }
  //     event.preventDefault();
  //   }
  //   handleSendAll(event) {
  //     var l=[];
  //     for(var i=0;i<this.rows.length;i++){
  //       if(this.rows[i].state.st==this.rows[i].ST.READY){
  //         l.push(this.rows[i]);
  //       }
  //     }
  //     if(l.length==0){
  //       alert("送信可能なアイテムはありません。");
  //       return;
  //     }
  //     if(window.confirm("送信可能な"+l.length+"件のアイテムを送信しますか？")){
  //       for(var i=0;i<l.length;i++){
  //           l[i].doSend();
  //       }
  //     }
  //     event.preventDefault();
  //   }
  //   handleSetAmount(){
  //     var l=[];
  //     for(var i=0;i<this.rows.length;i++){
  //       switch(this.rows[i].state.st){
  //       case this.rows[i].ST.READY:
  //       case this.rows[i].ST.INCOMPLETE:
  //         l.push(this.rows[i]);
  //       }
  //     }
  //     if(l.length==0){
  //       alert("設定可能なアイテムはありません。");
  //       return;
  //     }
  //     if(window.confirm(l.length+"件のアイテムのAmountを設定します。")){
  //       for(var i=0;i<l.length;i++){
  //           l[i].amountinput.setValue(this.default_amount.state.value);
  //       }
  //     }
  //     event.preventDefault();    
  //   }
  //   render() {
  
  //     var rows=[];
  //     const items=[];
  //     const amount=(this.default_amount)?this.default_amount.state.value:'';
  //     console.log(amount);
  //     for(var i=0;i<this.state.count;i++){
  //       items.push(<TxThread web3={this.props.web3} ref={(ri) => {rows.push(ri)}} key={i}/>)
  //     }
  //     this.rows=rows;
  //     return (
  //       <div className="AddrForm">
  //         <div><div>
  //           <div><button type="button" value="SetAmounts" onClick={this.handleSetAmount}>SetAmounts</button><AmountInput value="0.01" ref={(ri) => {this.default_amount=(ri)}}/><span>NUKO</span></div>
  //           <div><button type="button" value="Reset" onClick={this.handleReset}>Reset</button></div>
  //           <div><button type="button" value="SendAll" onClick={this.handleSendAll}>SendAll</button></div>
  //         </div></div>
  //         <div>
  //           <div>
  //             <div>To: Address</div><div>Amount(NUKO)</div><div>ACTION</div>
  //           </div>   
  //         </div>
  //         {items}
  //         <button type="button" value="Add" onClick={this.handleAdd}>+</button>
  //         <ul>
  //           <li>SetAmounts - 送信量を一括で設定します。</li>
  //           <li>Reset - アプリケーションを初期状態にします。</li>
  //           <li>SendAll - Actionが送信可能状態(Send)の行の送信を実行します。</li>
  //           <li>To:Address - 送信先のアカウントです。</li>
  //           <li>Amount(NUKO) -そのアカウントに送信する。NUKOの量です。個別に設定できます。</li>
  //           <li>Action - Sendと表示されているときは押すことができます。</li>
  //           <li>+ - 行を追加します。</li>
  //         </ul>
  //         <div id="footer"><a  target="_blank" rel="noreferrer noopener" href="https://github.com/nyatla/NekoniumWebApp/tree/master/nukosousinki">Github</a>&nbsp;-&nbsp;<a  target="_blank" rel="noreferrer noopener" href="https://nekonium.github.io/">Nekonium Project</a></div>
  //       </div>
  //     );
  
  //   }
  // }

  window.onload = function() {
    ReactDOM.render(<App/>, document.getElementById('app'));
  }