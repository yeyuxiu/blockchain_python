// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {SlotMachine} from "@src/SlotMachine/SlotMachine.sol";
import {DeployMock} from "@script/SlotMachine/DeployMock.s.sol";

import {VRFCoordinatorV2_5Mock} from "@src/SlotMachine/Mock/VRFCoordinatorV2_5Mock.sol";
import {RandomNumberConsumerV2_5} from "@src/SlotMachine/Mock/VRFv2_5Consumer.sol";

contract SlotMachineMock is Test {
    DeployMock public deployMock;

    VRFCoordinatorV2_5Mock public vrfCoordinator;
    RandomNumberConsumerV2_5 public randomNumberConsumer;

    address public owner = makeAddr("owner");
    address public user = makeAddr("user");

    function setUp() public {
        deployMock = new DeployMock();
        (vrfCoordinator, randomNumberConsumer) = deployMock.deployBase();
        uint256 balance = vrfCoordinator.s_totalBalance();
        vm.deal(address(vrfCoordinator), 100 ether);
        vm.deal(address(randomNumberConsumer), 100 ether);
        vm.deal(owner, 100 ether);
        vm.deal(user, 100 ether);
        console.log(balance, 'balance');
    }

    function testWord() public {
        // out of gas
        uint256[] memory words = deployMock.getRandom();
        console.log("words:", words[0]);
    }
}
