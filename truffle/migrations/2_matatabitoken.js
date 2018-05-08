var MatatabiToken = artifacts.require("MatatabiToken");

module.exports = function(deployer) {
  deployer.deploy(MatatabiToken,1000,"name","Symbol",false,10,100,10,5);
};
