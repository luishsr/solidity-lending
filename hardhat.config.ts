import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle"; // If using Waffle for testing
import "@nomiclabs/hardhat-ethers"; // This line extends 'ethers' with Hardhat-specific functionality

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;