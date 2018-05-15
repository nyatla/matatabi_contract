var MatatabiToken = artifacts.require("MatatabiToken");




contract('MatatabiToken', function(accounts) {
  /**
   * ExceptionがRevertによるかチェックする。
   * @param {*} e 
   */
  function isVmRevertException(e){
    return (e.message=="VM Exception while processing transaction: revert") ||
    (e.message=="VM Exception while processing transaction: invalid opcode");
  }
  /**
   * f()の実行前後でconfigUpdatedBlockが進行したかを返します。
   * @param {*} instance コントラクトインスタンス
   * @param {*} eq trueの場合、進行したかチェックする。falseの場合、変換しないかチェックする。
   * @param {*} f
   * テストする関数。
   */
  async function isConfigUpdatedBlockProgress(instance,eq,f){
    let b1=await instance.configUpdatedBlock();
    let r=await f();
    let b2=await instance.configUpdatedBlock();
    assert.equal(b2-b1>0,eq,"ASSERT");      
  }
  /**
   * updateがExpiredするまで待つ。
   * @param {*} instance 
   */
  async function waitForUpdateExpired(instance)
  {
    var b1=await getLockup(instance);
    var b2=await instance.configUpdatedBlock();
    while(!(web3.eth.blockNumber-b1.update>=b2)){
      await web3.eth.sendTransaction({ from: accounts[5], to:accounts[6], value: 1 });
    }
  }
  async function waitForExpired(instance,bn)
  {
    while(web3.eth.blockNumber<bn){
      await web3.eth.sendTransaction({ from: accounts[5], to:accounts[6], value: 1 });
    }
  }
  async function printConfig(instance)
  {
      let v=await instance.getConfig();
      console.log("transferEnable:"+v[0]+" rate:"+v[1]+" maxTokenPerAccount:"+v[2]);
  }
  async function getTransferEnable(instance){
    let v=await instance.getConfig();
    return v[0];
  }

  async function getMaxTokenPerAccount(instance){
    let r= await instance.getConfig();
    return r[2];
  }
  async function getRate(instance){
    let v=await instance.getConfig();
    return v[1];
  }
  async function getLockup(instance){
    let v=await instance.getLockup();
    return {update:v[0],cancel:v[1]};
  }


  describe("constructor関数",function(){
    it("owner パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.owner();
      assert.equal(v,accounts[0],"ASSERT");      
    });
    it("name パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.name();
      assert.equal(v,"name","name ASSERT");
    });
    it("symbol パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.symbol();
      assert.equal(v,"Symbol","ASSERT");
    });
    it("decimals パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.decimals();
      assert.equal(v,0,"ASSERT");
    });
    it("totalSupply パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.totalSupply();
      assert.equal(v,10,"ASSERT");
    });
    it("suppliedAmount パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.suppliedAmount();      
      assert.equal(v,0,"ASSERT");      
    });
    it("configUpdatedBlock パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.configUpdatedBlock();
      assert.equal(v,0,"ASSERT");
    });
    it("getConfig パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.getConfig();
      assert.equal(v[0],false,"ASSERT");
      assert.equal(v[1],10,"ASSERT");
      assert.equal(v[2],10,"ASSERT");
    });
    it("getLockup パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.getLockup();
      assert.equal(v[0],5,"ASSERT");
      assert.equal(v[1],5,"ASSERT");
    });    
  });
  describe("setRate関数",function(){
    //チェック関数
    async function checkRate(instance,eq,f){
      try{
        let r=await f();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      } 
      let v=await instance.getConfig();
      assert.equal(v[1],eq,"ASSERT");      
    }
    //チェックリスト
    it("1の時成功すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkRate(instance,1,async()=>{
          let r=await instance.setRate(1,{from:accounts[0]});
        });
      })
    });
    it("10000の時成功すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkRate(instance,10000,async()=>{
          let r=await instance.setRate(10000,{from:accounts[0]});
        });
      })
    });
    it("0の時失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkRate(instance,10000,async()=>{
          let r=await instance.setRate(0,{from:accounts[0]});
        });
      })
    });
    it("10001の時失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkRate(instance,10000,async()=>{
          let r=await instance.setRate(10001,{from:accounts[0]});
        });
      })
    });
    it("オーナー以外が実行したときに失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkRate(instance,10000,async()=>{
          let r=await instance.setRate(10002,{from:accounts[1]});
        });
      })
    }); 
  });
  describe("addTotalSupply関数",function(){
    //チェック関数
    async function checkTotalSupply(instance,eq,f){
      let b1=await instance.totalSupply();
      try{
        let r=await f();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      } 
      let b2=await instance.totalSupply();
      assert.equal(b2-b1,eq,"ASSERT");      
    }
    //チェックリスト
    it("加算した分だけ増加すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkTotalSupply(instance,6,async()=>{
          let r=await instance.addTotalSupply(6,{from:accounts[0]});
        });
      })
    });
    it("0の加算に失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTotalSupply(instance,0,async()=>{
          let r=await instance.addTotalSupply("0",{from:accounts[0]});
        });
      })
    });
    it("UINT256を超える加算に失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      {let b1=await instance.totalSupply();assert.equal(b1,16,"INVALID ENV");}
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTotalSupply(instance,0,async()=>{
          let r=await instance.addTotalSupply("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb",{from:accounts[0]});
        });
      })
    });
    it("オーナー以外が実行したときに失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTotalSupply(instance,0,async()=>{
          let r=await instance.addTotalSupply(1,{from:accounts[1]});
        });
      })
    });   

  });
  describe("setTransferEnable関数",function(){
    //チェック関数
    async function checkTransferEnable(instance,eq,f){
      try{
        let r=await f();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      } 
      let v=await instance.getConfig();
      assert.equal(v[0],eq,"ASSERT");      
    }
    //チェックリスト
    it("異値(false->true)をセットできること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkTransferEnable(instance,true,async()=>{
          let r=await instance.setTransferEnable(true,{from:accounts[0]});
        });
      })
    }); 
    it("同値設定(true->true)に失敗すること。", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTransferEnable(instance,true,async()=>{
          let r=await instance.setTransferEnable(true,{from:accounts[0]});
        });
      })
    }); 
    it("オーナー以外が実行したときに失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTransferEnable(instance,true,async()=>{
          let r=await instance.setTransferEnable(false,{from:accounts[1]});
        });
      })
    }); 


  }); 
  describe("addMaxTokenPerAccount関数",function(){

    //チェック関数
    async function checkMaxTokenPerAccount(instance,eq,f){
      let b1=await getMaxTokenPerAccount(instance);
      try{
        let r=await f();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      } 
      let b2=await getMaxTokenPerAccount(instance);
      assert.equal(b2-b1,eq,"ASSERT");      
    }
    //チェックリスト
    it("加算した分だけ増加すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkMaxTokenPerAccount(instance,1,async()=>{
          let r=await instance.addMaxTokenPerAccount(1,{from:accounts[0]});
        });
      })
    });
    it("0の加算に失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkMaxTokenPerAccount(instance,0,async()=>{
          let r=await instance.addMaxTokenPerAccount("0",{from:accounts[0]});
        });
      })
    });
    it("UINT64を超える加算に失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkMaxTokenPerAccount(instance,0,async()=>{
          //7でお願い。
          let i=await getMaxTokenPerAccount(instance);
          assert.equal(i,11,"前提条件エラー:"+i);
          let r=await instance.addMaxTokenPerAccount("0xfffffffffffffff5",{from:accounts[0]});
        });
      })
    });
    it("オーナー以外が実行したときに失敗すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkMaxTokenPerAccount(instance,0,async()=>{
          let r=await instance.addMaxTokenPerAccount(1,{from:accounts[1]});
        });
      })
    });       
  });
  describe("canExchange関数",function(){
    it("block.number<lockup.update+configUpdatedBlockでfalseであること。", async()=>{
      let instance=await MatatabiToken.deployed();
      let b2=await instance.configUpdatedBlock();
      if(web3.eth.blockNumber>b2){
        let r=await instance.setRate(10000,{from:accounts[0]});
      }
      let t=await instance.canExchange();
      assert.equal(t,false,"ASSERT"); 
    });
    it("block.number>=lockup.update+configUpdatedBlockでtrueであること。", async()=>{
      let instance=await MatatabiToken.deployed();
      await waitForUpdateExpired(instance);
      let t=await instance.canExchange();
      assert.equal(t,true,"ASSERT"); 
    });    
  });
  describe("cancel関数(1)",function(){
    it("取引記録がないとき失敗すること",async()=>{
      let instance=await MatatabiToken.deployed();
      {let t=await instance.sizeOfExchangeLog();assert.equal(t,0,"前提条件エラー");}
      try{
        let r=await instance.cancel({ from: accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }        
    });
  });
  describe("!payable関数",function(){
    it("成功時に、パラメータ更新が正常に行われること。(整数)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await instance.setRate(3);}
      {let r=await waitForUpdateExpired(instance);}      
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let gg=await instance.canExchange();
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),1,"コントラクトの通貨残高が増加すること");
      assert.equal(b1-b0,3,"送信元のトークン残高が増加すること。");
      assert.equal(a1-a0,1,"取引ログが追記されたこと。");
      assert.equal(d1-d0,3,"供給量が3増加すること。");
      assert.equal(c1[1]>=web3.eth.blockNumber,true,"取引ログが追記されたこと。");
      assert.equal(c1[2],web3.toWei(1,"ether"),"取引ログが追記されたこと。");
      assert.equal(c1[3],3,"取引ログが追記されたこと。");
    });
    it("成功時に、パラメータ更新が正常に行われること。(端数)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let v=await getRate(instance);assert.equal(v,3,"前提条件エラー");}
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: (web3.toWei(1,"ether")/2),gas:140000});
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0.5,"コントラクトの通貨残高が増加すること");
      assert.equal(b1-b0,1,"送信元のトークン残高が増加すること。");
      assert.equal(a1-a0,1,"取引ログが追記されたこと。");
      assert.equal(d1-d0,1,"供給量が1増加すること。");
      assert.equal(c1[1]>=web3.eth.blockNumber,true,"取引ログが追記されたこと。");
      assert.equal(c1[2],web3.toWei(1,"ether")/2,"取引ログが追記されたこと。");
      assert.equal(c1[3],1,"取引ログが追記されたこと。");
    });
    it("UINT8より大きい通貨の受け取りに失敗すること",async()=>{
      let instance=await MatatabiToken.deployed();    
      {let v=await getRate(instance);assert.equal(v,3,"前提条件エラー");}
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      try{
        let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(256,"ether"),gas:140000});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0,"コントラクトの通貨残高は変化しないこと");
      assert.equal(b1-b0,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(a1-a0,0,"取引ログが増加しないこと。");
      assert.equal(d1-d0,0,"供給量が変化しないこと。");
    });
    it("交換トークン量がUINT32を超えた場合失敗すること",async()=>{
      //チェックしない
    });
    it("交換トークン量+suppliedAmountがtotalAmountを超えているときは失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await instance.setRate(1);}
      {let r=await waitForUpdateExpired(instance);}      
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let total=await instance.totalSupply();
      let max_supply=total-d0;
      //console.log(max_supply);
      try{
        let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(max_supply+1,"ether"),gas:140000});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0,"コントラクトの通貨残高は変化しないこと");
      assert.equal(b1-b0,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(a1-a0,0,"取引ログが増加しないこと。");
      assert.equal(d1-d0,0,"供給量が変化しないこと。");
    });
    it("交換トークン量が0の時は失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let total=await instance.totalSupply();
      let max_supply=total-d0;
      try{
        let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(0,"ether"),gas:140000});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0,"コントラクトの通貨残高は変化しないこと");
      assert.equal(b1-b0,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(a1-a0,0,"取引ログが増加しないこと。");
      assert.equal(d1-d0,0,"供給量が変化しないこと。");

    });
    it("交換トークン量+トークン所有量>config.maxTokenPerAccountの時、失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}      
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let total=await instance.totalSupply();
      let max_supply=total-d0;
      let mpa=await getMaxTokenPerAccount(instance);
      //console.log(total+" "+max_supply+" "+mpa+" "+b0);
      assert.equal(total-mpa>0,true,"前提条件エラー");
      assert.equal(mpa-b0>0,true,"前提条件エラー");//加算できる数値
      try{
        let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(mpa-b0+1,"ether"),gas:140000});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0,"コントラクトの通貨残高は変化しないこと");
      assert.equal(b1-b0,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(a1-a0,0,"取引ログが増加しないこと。");
      assert.equal(d1-d0,0,"供給量が変化しないこと。");

    });
    it("canExchangeがfalseの時に実行すると失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      await instance.setRate(1);
      let d0=await instance.suppliedAmount();
      let b0=await instance.balanceOf(accounts[0]);
      let v0=await web3.eth.getBalance(instance.address);
      let a0=await instance.sizeOfExchangeLog();
      let total=await instance.totalSupply();
      //let max_supply=total-d0;
      //console.log(total+" "+max_supply);
      try{
        let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let v1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let a1=await instance.sizeOfExchangeLog();
      let c1=await instance.getExchangeLog(a1-1);
      let d1=await instance.suppliedAmount();
      assert.equal(web3.fromWei(v1-v0,"ether"),0,"コントラクトの通貨残高は変化しないこと");
      assert.equal(b1-b0,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(a1-a0,0,"取引ログが増加しないこと。");
      assert.equal(d1-d0,0,"供給量が変化しないこと。");      
    });
  });


  describe("cancel関数(2)",function(){
    it("成功時に、パラメータ更新が正常に行われること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      await instance.cancel({ from: accounts[0]});
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,1,"suppliedAmountが減少すること");
      assert.equal(web3.fromWei(a1-a2),1,"コントラクトの通貨残高が減少すること");
      assert.equal(b1-b2,1,"送信元のトークン残高が減少すること");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      assert.equal(d1[0],d2[0],"取引ログが正しく更新されたか（アドレスは維持）");
      assert.equal(d1[1]-d2[1],0,"取引ログが正しく更新されたか（ブロック番号は維持）"+d1[1]+" "+d2[1]);
      assert.equal(d2[2],0,"取引ログが正しく更新されたか（残高を０に）");
      assert.equal(d2[3],0,"取引ログが正しく更新されたか（残高を０に）");
    });
    it("同じキャンセルが２度成功しないこと。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      try{
        await instance.cancel({ from: accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,0,"suppliedAmountが変化しないこと");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高が変化しないこと");
      assert.equal(b1-b2,0,"送信元のトークン残高が変化しないこと");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      assert.equal(d1[0],d2[0],"取引ログが正しく更新されたか（アドレスは維持）");
      assert.equal(d1[1]-d2[1],0,"取引ログが正しく更新されたか（ブロック番号は維持）"+d1[1]+" "+d2[1]);
      assert.equal(d2[2],0,"取引ログが正しく更新されたか（残高を０に）");
      assert.equal(d2[3],0,"取引ログが正しく更新されたか（残高を０に）");      
    });
    it("キャンセル対象が異なるときに失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      try{
        await instance.cancel({ from: accounts[1]});//[1]をキャンセルしようとして失敗する。
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,0,"suppliedAmountはそのまま。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高が変化しないこと");
      assert.equal(b1-b2,0,"送信元[0]のトークン残高が変化しないこと");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      assert.equal(d1[0],d2[0],"取引ログが更新されていないこと（アドレスは維持）");
      assert.equal(d1[1]-d2[1],0,"取引ログが更新されていないこと（ブロック番号は維持）"+d1[1]+" "+d2[1]);
      assert.equal(d1[2]-d2[2],0,"取引ログが更新されないこと");
      assert.equal(d1[3]-d2[3],0,"取引ログが更新されないこと");        
    });
    it("範囲外のエントリのキャンセルに失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      let cancel_block=d1[1];//ブロック番号
      let lockup=await getLockup(instance);
      //console.log(cancel_block.toNumber()+" "+lockup.cancel+" "+web3.eth.blockNumber);
      {let r=await waitForExpired(instance,cancel_block.toNumber()+lockup.cancel.toNumber());}//キャンセルをExpireする。
      //console.log(cancel_block.toNumber()+" "+lockup.cancel+" "+web3.eth.blockNumber);
      try{
        await instance.cancel({ from: accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      //console.log(cancel_block.toNumber()+" "+lockup.cancel+" "+web3.eth.blockNumber);
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,0,"suppliedAmountはそのまま。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高が変化しないこと");
      assert.equal(b1-b2,0,"送信元[0]のトークン残高が変化しないこと");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      assert.equal(d1[0],d2[0],"取引ログが更新されていないこと（アドレスは維持）");
      assert.equal(d1[1]-d2[1],0,"取引ログが更新されていないこと（ブロック番号は維持）"+d1[1]+" "+d2[1]);
      assert.equal(d1[2]-d2[2],0,"取引ログが更新されないこと");
      assert.equal(d1[3]-d2[3],0,"取引ログが更新されないこと");          
    });
    it("別のアカウントの取引ログに影響を出さずにキャンセルできること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let tx1=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let tx2=await web3.eth.sendTransaction({ from: accounts[1], to:instance.address, value: web3.toWei(1,"ether"),gas:140000});
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1_1=await instance.getExchangeLog(c1-2);
      let d1_2=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      await instance.cancel({ from: accounts[0]});
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2_1=await instance.getExchangeLog(c2-2);
      let d2_2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,1,"suppliedAmountが減少すること");
      assert.equal(web3.fromWei(a1-a2),1,"コントラクトの通貨残高が減少すること");
      assert.equal(b1-b2,1,"送信元のトークン残高が減少すること");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更のあり)
      assert.equal(d1_1[0],d2_1[0],"取引ログが正しく更新されたか（アドレスは維持）");
      assert.equal(d1_1[1]-d2_1[1],0,"取引ログが正しく更新されたか（ブロック番号は維持）"+d1_1[1]+" "+d2_1[1]);
      assert.equal(d2_1[2],0,"取引ログが正しく更新されたか（残高を０に）");
      assert.equal(d2_1[3],0,"取引ログが正しく更新されたか（残高を０に）");
      //acounts[1](変更なし)
      assert.equal(d1_2[0],d2_2[0],"取引ログに変化がないか");
      assert.equal(d1_2[1]-d2_2[1],0,"取引ログに変化がないか "+d1_2[1]+" "+d2_2[1]);
      assert.equal(d1_2[2]-d2_2[2],0,"取引ログに変化がないか "+d1_2[2]+" "+d2_2[2]);
      assert.equal(d1_2[3]-d2_2[3],0,"取引ログに変化がないか");
    });
    it("トークン残高不足の時にキャンセルに失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      //3tokenを得る。  
      let tx1=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: web3.toWei(3,"ether"),gas:140000});
      let x2=await instance.balanceOf(accounts[0]);
      {
        if(!(await getTransferEnable(instance))){
          await instance.setTransferEnable(true);
        }
      }
      await instance.transfer(accounts[1],x2-2,{ from: accounts[0]});
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      try{
        await instance.cancel({ from: accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,0,"suppliedAmountがそのままであること");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高がかわらないこと");
      assert.equal(b1-b2,0,"送信元のトークン残高がかわらないこと");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更なし)
      assert.equal(d1[0],d2[0],"取引ログに変化がないか");
      assert.equal(d1[1]-d2[1],0,"取引ログに変化がないか ");
      assert.equal(d2[2]-d1[2],0,"取引ログに変化がないか");
      assert.equal(d2[3]-d1[3],0,"取引ログに変化がないか");
    });

  });
  describe("burn関数",function(){
    it("Burnに成功すること(端数)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}  
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      {
        await instance.transfer(accounts[0],await instance.balanceOf(accounts[1]),{from:accounts[1]});
        let b=await instance.balanceOf(accounts[0]);
        assert.equal(b>=5,true,"前提条件エラー");
      }
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      await instance.burn(3,{from:accounts[0]});
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,3,"suppliedAmountが3だけ減少すること。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高がかわらないこと");
      assert.equal(b2,b1-3,"送信元のトークン残高が3減少すること");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更なし)
      assert.equal(d1[0],d2[0],"取引ログに変化がないか");
      assert.equal(d1[1]-d2[1],0,"取引ログに変化がないか ");
      assert.equal(d2[2]-d1[2],0,"取引ログに変化がないか");
      assert.equal(d2[3]-d1[3],0,"取引ログに変化がないか");
    });
    it("Burnに失敗すること(超過)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}
      {
        let b=await instance.balanceOf(accounts[0]);
        assert.equal(b>0,true,"前提条件エラー");
      }      
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      try{
        await instance.burn(b1+1,{from:accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }        
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,0,"suppliedAmountが変化しないこと。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高がかわらないこと");
      assert.equal(b2-b1,0,"送信元のトークン残高が変化しないこと。");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更なし)
      assert.equal(d1[0],d2[0],"取引ログに変化がないか");
      assert.equal(d1[1]-d2[1],0,"取引ログに変化がないか ");
      assert.equal(d2[2]-d1[2],0,"取引ログに変化がないか");
      assert.equal(d2[3]-d1[3],0,"取引ログに変化がないか");
    });
    it("Burnに成功すること(一致)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);} 
      {
        let b=await instance.balanceOf(accounts[0]);
        assert.equal(b>0,true,"前提条件エラー");
      }      
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[0]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      await instance.burn(b1,{from:accounts[0]});
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[0]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,b1,"suppliedAmountがb1減少すること。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高がかわらないこと");
      assert.equal(b2,0,"送信元のトークン総数が0であること。");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更なし)
      assert.equal(d1[0],d2[0],"取引ログに変化がないか");
      assert.equal(d1[1]-d2[1],0,"取引ログに変化がないか ");
      assert.equal(d2[2]-d1[2],0,"取引ログに変化がないか");
      assert.equal(d2[3]-d1[3],0,"取引ログに変化がないか");
    });
    it("Burnに失敗すること(バランスなし)",async()=>{
      let instance=await MatatabiToken.deployed();
      {let r=await waitForUpdateExpired(instance);}
      {
        let b=await instance.balanceOf(accounts[0]);
        assert.equal(b==0,true,"前提条件エラー");
      }      
      let a1=await web3.eth.getBalance(instance.address);
      let b1=await instance.balanceOf(accounts[3]);
      let c1=await instance.sizeOfExchangeLog();
      let d1=await instance.getExchangeLog(c1-1);
      let e1=await instance.suppliedAmount();
      try{
        await instance.burn(b1+1,{from:accounts[3]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }        
      let a2=await web3.eth.getBalance(instance.address);
      let b2=await instance.balanceOf(accounts[3]);
      let c2=await instance.sizeOfExchangeLog();
      let d2=await instance.getExchangeLog(c2-1);
      let e2=await instance.suppliedAmount();
      assert.equal(e1-e2,b1,"suppliedAmountがb1減少すること。");
      assert.equal(web3.fromWei(a1-a2),0,"コントラクトの通貨残高がかわらないこと");
      assert.equal(b2,0,"送信元のトークン総数が0であること。");
      assert.equal(c2-c1,0,"取引ログの総数が増加しないこと");
      //acounts[0](変更なし)
      assert.equal(d1[0],d2[0],"取引ログに変化がないか");
      assert.equal(d1[1]-d2[1],0,"取引ログに変化がないか ");
      assert.equal(d2[2]-d1[2],0,"取引ログに変化がないか");
      assert.equal(d2[3]-d1[3],0,"取引ログに変化がないか");
    });        
  });
  describe("payableAmount関数",function(){
    it("オーナー以外が実行して失敗すること",async()=>{
      let instance=await MatatabiToken.deployed();
      //全部expireするまでblockを進める
      {
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);    
        let lc=await getLockup(instance);
        let r=await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber()+1);
      }
      {
        let b=await web3.eth.getBalance(instance.address);
        assert.equal(b>0,true,"前提条件エラー");
      }
      var function_failed=false;
      try{
        let m=await instance.payableAmount({from:accounts[1]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
        function_failed=true;
      }
      assert.equal(function_failed,true,"関数が失敗すること");
    });



    it("すべてExpireした場合に、残高がアカウントの所持量と等しいこと",async()=>{
      let instance=await MatatabiToken.deployed();
      //全部expireするまでblockを進める
      {
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);    
        let lc=await getLockup(instance);
        let r=await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber()+1);
      }
      {
        let b=await web3.eth.getBalance(instance.address);
        assert.equal(b>0,true,"前提条件エラー");
      }
      let m=await instance.payableAmount();
      let total=await web3.eth.getBalance(instance.address);
      assert.equal(total-m,0,"一致すること");
    });
    it("cancel可能な残高が除外されていること。",async()=>{
      let instance=await MatatabiToken.deployed();
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      let tx=await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: (web3.toWei(1,"ether")),gas:140000});
      let m=await instance.payableAmount();
      let total=await web3.eth.getBalance(instance.address);
      assert.equal(total-m,web3.toWei(1,"ether"),"cancel可能分を差し引いた残高であること");
    });
    it("すべてExpireした場合に、残高がアカウントの所持量と等しくなること",async()=>{
      let instance=await MatatabiToken.deployed();
      
      { //全部expireするまでblockを進める
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);    
        let lc=await getLockup(instance);
        await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber());
        //console.log(lc.cancel.toNumber()+d2[1].toNumber()+" "+web3.eth.blockNumber);
      }
      let m=await instance.payableAmount();
      let total=await web3.eth.getBalance(instance.address);
      assert.equal(total-m,0,"一致すること");
    });
    
    
  });
  describe("payout関数",function(){
    it("オーナー以外が実行したときに失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      { //全部expireするまでblockを進める
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);    
        let lc=await getLockup(instance);
        await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber());
      }
      { let m=await instance.payableAmount();
        let total=await web3.eth.getBalance(instance.address);
        assert.equal(total-m,0,"前提条件エラー");
        assert.equal(m>0,true,"前提条件エラー");
      }
      let t1=await web3.eth.getBalance(instance.address);      
      let a1=await web3.eth.getBalance(accounts[0]);      
      try{
        await instance.payout({from:accounts[1]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }
      let t2=await web3.eth.getBalance(instance.address);
      let a2=await web3.eth.getBalance(accounts[0]);

      let m=await instance.payableAmount();
      assert.equal(t1-t2,0,"コントラクトの残高が変化しないこと");
      assert.equal(m-t2,0,"支払い可能額とコントラクト残高は一致すること");
    });    
    it("成功時にパラメータ更新が正常に行われていること。",async()=>{
      let instance=await MatatabiToken.deployed();
      { //全部expireするまでblockを進める
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);    
        let lc=await getLockup(instance);
        await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber());
      }
      { let m=await instance.payableAmount();
        let total=await web3.eth.getBalance(instance.address);
        assert.equal(total-m,0,"前提条件エラー");
        assert.equal(m>0,true,"前提条件エラー");
      }
      let t1=await web3.eth.getBalance(instance.address);      
      let a1=await web3.eth.getBalance(accounts[0]);      
      await instance.payout({ from: accounts[0]});
      let t2=await web3.eth.getBalance(instance.address);
      let a2=await web3.eth.getBalance(accounts[0]);
        
        
      let m=await instance.payableAmount();
      assert.equal(t2,0,"コントラクトの残高が０になること");
      assert.equal(((a2-a1)-(t1-t2))<0.001,true,"アカウントに払い戻されてること");
    });
    it("残高がないときに失敗すること。",async()=>{
      let instance=await MatatabiToken.deployed();
      { let m=await instance.payableAmount();
        let total=await web3.eth.getBalance(instance.address);
        assert.equal(total,0,"前提条件エラー");
        assert.equal(m,0,"前提条件エラー");
      }
      let t1=await web3.eth.getBalance(instance.address);      
      let a1=await web3.eth.getBalance(accounts[0]);      
      try{
        await instance.payout();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e);
      }  
      let t2=await web3.eth.getBalance(instance.address);
      let a2=await web3.eth.getBalance(accounts[0]);
      assert.equal(t2-t1,0,"コントラクトの残高が変化しないこと");
      assert.equal(((a2-a1)-(t2-t1))<0.001,true,"アカウント残高が（１単位で）変化しないこと");
    });
    it("キャンセル対象は無視して払い戻すこと。",async()=>{
      let instance=await MatatabiToken.deployed();
      await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: (web3.toWei(1,"ether")),gas:140000});
      { //全部expireするまでblockを進める
        let c=await instance.sizeOfExchangeLog();
        let d2=await instance.getExchangeLog(c-1);
        let lc=await getLockup(instance);
        await waitForExpired(instance,lc.cancel.toNumber()+d2[1].toNumber());
      }      
      { //バランスがあること。
        let m=await instance.payableAmount();
        let total=await web3.eth.getBalance(instance.address);
        assert.equal(total>0,true,"前提条件エラー");
        assert.equal(m>0,true,"前提条件エラー");
      }
      {let v=await getRate(instance);assert.equal(v,1,"前提条件エラー");}
      await web3.eth.sendTransaction({ from: accounts[0], to:instance.address, value: (web3.toWei(1,"ether")),gas:140000});      
      let t1=await web3.eth.getBalance(instance.address);      
      let a1=await web3.eth.getBalance(accounts[0]);      
      await instance.payout();
      let t2=await web3.eth.getBalance(instance.address);
      let a2=await web3.eth.getBalance(accounts[0]);
      assert.equal(t2,(web3.toWei(1,"ether")),"コントラクトの残高が1のこっていること。");
    });
    
    
  });

  describe("transferOwnership関数",function(){
    it("オーナー以外は実行できないこと", async()=>{
      let instance=await MatatabiToken.deployed();
      try{
        let r=await instance.transferOwnership(accounts[1],{from:accounts[1]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      }
      let t=await instance.owner();
      assert.equal(t,accounts[0],"");
    });
    it("オーナーは実行できること", async()=>{
      let instance=await MatatabiToken.deployed();
      let r=await instance.transferOwnership(accounts[1],{from:accounts[0]});
      let t=await instance.owner();
      assert.equal(t,accounts[1],"");
      //もとにもどしとく
      let r2=await instance.transferOwnership(accounts[0],{from:accounts[1]});
      let t2=await instance.owner();
      assert.equal(t2,accounts[0],"");
    });
  }); 
  describe("getConfig関数",function(){
    it("constructorでチェック済", async()=>{});
  }); 
  describe("getLockup関数",function(){
    it("constructorでチェック済", async()=>{});
  }); 
  describe("getExchangeLog関数",function(){
    it("payable()/cancelでチェック済", async()=>{});
  }); 
  describe("sizeOfExchanegLog関数",function(){
    it("payable()/cancelでチェック済", async()=>{});
  });   
});
