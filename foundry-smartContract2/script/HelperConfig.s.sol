// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Script} from "forge-std/Script.sol";

contract CodeConstant {
    /*//////////////////////////////////////////////////////////////
                              ETH_SEPOLIA
    //////////////////////////////////////////////////////////////*/
    address public constant SEPOLIA_ACCOUNT_1 =
        0xaa9980fA93DF560e26D2F382b887f322d3Ef42c6;
    uint256 constant ETH_SEPOLIA_CHAIN_ID = 11155111;
    /*//////////////////////////////////////////////////////////////
                                 ANVIL
    //////////////////////////////////////////////////////////////*/
    address public constant ANVIL_ACCOUNT_1 =
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 constant LOCAL_CHAIN_ID = 31337;
    // private_key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 localhost:8545
}

contract HelperConfig is Script, CodeConstant {
    error HelperConfig__InvalidChainId();

    struct NetworkConfig {
        address account;
    }

    mapping(uint256 chainId => NetworkConfig) public networkConfigs;

    constructor() {
        networkConfigs[LOCAL_CHAIN_ID] = getLocalConfig();
        networkConfigs[ETH_SEPOLIA_CHAIN_ID] = getSepoliaConfig();
    }

    function getConfig() public returns (NetworkConfig memory) {
        return getConfigByChainId(block.chainid);
    }

    function getConfigByChainId(
        uint256 chainId
    ) public returns (NetworkConfig memory) {
        if (networkConfigs[chainId].account != address(0)) {
            return networkConfigs[chainId];
        } else {
            revert HelperConfig__InvalidChainId();
        }
    }

    function getLocalConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({account: ANVIL_ACCOUNT_1});
    }

    function getSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({account: SEPOLIA_ACCOUNT_1});
    }
}
