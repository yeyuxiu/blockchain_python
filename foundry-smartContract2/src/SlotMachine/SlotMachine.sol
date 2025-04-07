// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title slotMachine
 * @author yyx
 * @notice
 * @dev: 1. 获取3个随机数，每个随机数控制 0-9(GetVRF实现)
 * 2. 3个数有两个一样的获得1倍奖励，如果3个一样获得2倍奖励(前端实现)
 * 3. 只实现收钱和转账功能
 * 4. 固定底池是 0.0005 ETH
 * 5. 用户投币只需 0.0005 ETH,多余的钱会存入合约作为奖池
 */

contract SlotMachine is Ownable {
    uint256 public balance;
    uint256 constant FIXEDPOOL = 0.0005 ether;

    event Transfer(address to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    receive() external payable {
        balance += msg.value;
    }

    function transfer(address to, uint8 mul) external payable onlyOwner returns (bool) {
        require(balance >= (mul * FIXEDPOOL), "not enough balance");

        balance -= mul * FIXEDPOOL;
        payable(to).transfer(mul * FIXEDPOOL);
        emit Transfer(to, mul * FIXEDPOOL);
        return true;
    }
}
