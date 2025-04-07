// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {SlotMachine} from "@src/SlotMachine/SlotMachine.sol";

contract SlotMachineTest is Test {
    SlotMachine public slotMachine;
    address public owner = makeAddr("owner");
    address public user = makeAddr("user");

    function setUp() public {
        slotMachine = new SlotMachine(owner);
        vm.deal(user, 1 ether);
    }

    function testSlotMachineCanSupport() public {
        assertEq(address(slotMachine).balance, 0);
        vm.prank(user);
        (bool success, ) = address(slotMachine).call{value: 0.0005 ether}("");
        assertTrue(success);
        assertEq(address(slotMachine).balance, 0.0005 ether);
    }

    function testSlotMachineOtherUserCanNotTransfer() public {
        vm.prank(user);
        (bool success, ) = address(slotMachine).call{value: 0.0005 ether}("");
        assertTrue(success);
        vm.expectRevert();
        slotMachine.transfer(user, 1);
    }

    function testSlotMachineCanTransfer() public {
        vm.prank(user);
        (bool success, ) = address(slotMachine).call{value: 0.0005 ether}("");
        assertTrue(success);
        vm.prank(owner);
        slotMachine.transfer(user, 1);
        assertEq(address(slotMachine).balance, 0);
        assertEq(user.balance, 1 ether);
    }
}
