// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {Script} from "forge-std/Script.sol";
import {NFTMarket} from "@src/NFTMarket/NFTMarket.sol";
import {HelperConfig} from "@script/HelperConfig.s.sol";

contract DeployNFTMarket is Script {
    function run() external returns (NFTMarket) {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        vm.startBroadcast(config.account);
        NFTMarket nftMarket = new NFTMarket(config.account);
        vm.stopBroadcast();
        return nftMarket;
    }
}
