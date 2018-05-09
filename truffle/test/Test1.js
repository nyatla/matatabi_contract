var MatatabiToken = artifacts.require("MatatabiToken");

/**
 * ExceptionがRevertによるかチェックする。
 * @param {*} e 
 */
function isVmRevertException(e){
  return e.message=="VM Exception while processing transaction: revert";
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
    it("1の時成功すること", async()=>{
      let instance=await MatatabiToken.deployed();
      let r=await instance.setRate(1,{from:accounts[0]});
      let v=await instance.getConfig();
      assert.equal(v[1],1,"Range Error ");      
    });
    it("10000の時成功すること", async()=>{
      let instance=await MatatabiToken.deployed();
      let r=await instance.setRate(10000,{from:accounts[0]});
      let v=await instance.getConfig();
      assert.equal(v[1],10000,"Range Error");      
    });
    it("0の時失敗すること(そのままであること)", async()=>{
      let instance=await MatatabiToken.deployed();
      try{
        let r=await instance.setRate(0,{from:accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,"revert failed.")
      }
      let v=await instance.getConfig();
      assert.equal(v[1],10000,"Range Error");      
    });
    it("10001の時失敗すること(そのままであること)", async()=>{
      let instance=await MatatabiToken.deployed();
      try{
        let r=await instance.setRate(10001,{from:accounts[0]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,"revert failed.")
      }
      let v=await instance.getConfig();
      assert.equal(v[1],10000,"Range Error");      
    });
    it("オーナー以外が実行したときに失敗すること(そのままであること)", async()=>{
      let instance=await MatatabiToken.deployed();
      try{
        let r=await instance.setRate(999,{from:accounts[1]});
      }catch(e){
        assert.equal(isVmRevertException(e),true,"revert failed.")
      }
      let v=await instance.getConfig();
      assert.equal(v[1],10000,"Range Error");      
    });    
  });
  describe("addTotalSupply関数",function(){
    it("1の時成功すること", async()=>{
      let instance=await MatatabiToken.deployed();
      let r=await instance.setRate(1,{from:accounts[0]});
      let v=await instance.getConfig();
      assert.equal(v[1],1,"Range Error ");      
    });
  });
  describe("addTotalSupply関数",function(){
  }); 
  describe("setTransferEnable関数",function(){
  }); 
  describe("addMaxTokenPerAccount関数",function(){
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
  // describe("canExchange関数",function(){
  // }); 
  describe("transferOwnership関数",function(){
  }); 
  describe("getConfig関数",function(){
  }); 
  describe("getLockup関数",function(){
  }); 
  describe("getExchangeLog関数",function(){
  }); 
  describe("getLockup関数",function(){
  });   
  describe("sizeOfExchanegLog関数",function(){
  });   
});
