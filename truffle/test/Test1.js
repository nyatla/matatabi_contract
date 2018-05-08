var MatatabiToken = artifacts.require("MatatabiToken");

contract('MatatabiToken', function(accounts) {
  it("should put 10000 MatatabiToken in the first account", function() {
    return MatatabiToken.deployed().then(function(instance) {
      return instance.name.call();
    }).then(function(name) {
      assert.equal(name,"namse","パラメータ初期化エラー");
    });
  });
});