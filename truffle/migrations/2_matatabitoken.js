var MatatabiToken = artifacts.require("MatatabiToken");

module.exports = function(deployer) {
  deployer.deploy(MatatabiToken,10,"name","Symbol",false,10,10,5,5);
};
