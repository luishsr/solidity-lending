require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");

module.exports = {
  solidity: "0.8.20",
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};
