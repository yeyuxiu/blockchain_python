// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {VRFCoordinatorV2_5Mock} from "@src/SlotMachine/Mock/VRFCoordinatorV2_5Mock.sol";
import {RandomNumberConsumerV2_5} from "@src/SlotMachine/Mock/VRFv2_5Consumer.sol";

contract DeployMock is Script {
    VRFCoordinatorV2_5Mock public vrfCoordinator;
    RandomNumberConsumerV2_5 public randomNumberConsumer;
    uint256 private subId;

    function run() external {}

    function deployBase() external returns(VRFCoordinatorV2_5Mock, RandomNumberConsumerV2_5){
        vm.startBroadcast();
        vrfCoordinator = new VRFCoordinatorV2_5Mock(
            100000000000000000,
            1000000000,
            7151000000000000
        );
        subId = vrfCoordinator.createSubscription();
        vrfCoordinator.fundSubscription(subId, 1000000000000000000000);
        
vrfCoordinator.transfer(1 ether);

        randomNumberConsumer = new RandomNumberConsumerV2_5(
            subId,
            address(vrfCoordinator),
            0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae
        );

        vrfCoordinator.addConsumer(subId, address(randomNumberConsumer));
        return (vrfCoordinator, randomNumberConsumer);
    }

    function getRandom() external returns (uint256[] memory) {
        randomNumberConsumer.requestRandomWords();
        uint256 reqId = randomNumberConsumer.s_requestId();
        // out of gas
        vrfCoordinator.fulfillRandomWords(reqId, address(randomNumberConsumer));
        uint256[] memory words = randomNumberConsumer.getS_randomWords();
        return words;
    }
}
