var MatatabiToken = artifacts.require("MatatabiToken");

/**
 * ExceptionがRevertによるかチェックする。
 * @param {*} e 
 */
function isVmRevertException(e){
  return (e.message=="VM Exception while processing transaction: revert") ||
  (e.message=="VM Exception while processing transaction: invalid opcode");
}
async function isConfigUpdatedBlockProgress(instance,eq,f){
  let b1=await instance.configUpdatedBlock();
  let r=await f();
  let b2=await instance.configUpdatedBlock();
  assert.equal(b2-b1>0,eq,"ASSERT");      
}


contract('MatatabiToken', function(accounts) {
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
      assert.equal(v,1000,"ASSERT");
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
      assert.equal(v[2],100,"ASSERT");
    });
    it("getLockup パラメータ初期化", async()=>{
      let instance=await MatatabiToken.deployed();
      let v=await instance.getLockup();
      assert.equal(v[0],10,"ASSERT");
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
        await checkTotalSupply(instance,24,async()=>{
          let r=await instance.addTotalSupply(24,{from:accounts[0]});
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
      await isConfigUpdatedBlockProgress(instance,false,async()=>{
        await checkTotalSupply(instance,0,async()=>{
          let r=await instance.addTotalSupply("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc00",{from:accounts[0]});
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
      let b1=await instance.getConfig();
      try{
        let r=await f();
      }catch(e){
        assert.equal(isVmRevertException(e),true,e)
      } 
      let b2=await instance.getConfig();
      assert.equal(b2[2]-b1[2],eq,"ASSERT");      
    }
    //チェックリスト
    it("加算した分だけ増加すること", async()=>{
      let instance=await MatatabiToken.deployed();
      await isConfigUpdatedBlockProgress(instance,true,async()=>{
        await checkMaxTokenPerAccount(instance,28,async()=>{
          let r=await instance.addMaxTokenPerAccount(28,{from:accounts[0]});
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
          let r=await instance.addMaxTokenPerAccount("0xffffffffffffff80",{from:accounts[0]});
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
      var b1=web3.eth.blockNumber;
      var b2=await instance.configUpdatedBlock();
      while(b1<b2){
        try{let r=await instance.setRate(0,{from:accounts[0]});}catch(e){}
        b1=web3.eth.blockNumber;
      }
      let t=await instance.canExchange();
      assert.equal(t,true,"ASSERT"); 
    });
    
  });  
  // describe("exchange関数",function(){
  // });   
  // describe("cancel関数",function(){
  // });   
  // describe("burn関数",function(){
  // });   
  // describe("payout関数",function(){
  // });   
  // describe("payableAmount関数",function(){
  // });   

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
  }); 
  describe("sizeOfExchanegLog関数",function(){
  });   
});
