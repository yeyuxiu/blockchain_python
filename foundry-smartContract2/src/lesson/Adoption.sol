// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

/// @title 宠物领养智能合约
/// @dev 用于管理宠物领养状态的合约
contract Adoption {
    // 存储领养者地址的数组，固定大小为16，表示最多可以领养16只宠物
    // public 关键字会自动创建一个getter函数
    address[16] public adopters;

    /// @notice 领养宠物
    /// @dev 将调用者的地址记录为特定宠物的领养者
    /// @param petId 要领养的宠物ID
    /// @return 返回被领养的宠物ID
    function adopt(uint petId) public returns (uint) {
        // 确保宠物ID在有效范围内（0-15）
        require(petId>=0 && petId <= 15);
        
        // 记录领养者地址，msg.sender 是调用此函数的账户地址
        adopters[petId] = msg.sender;
        
        // 返回宠物ID作为确认
        return petId;
    }

    /// @notice 获取所有领养者信息
    /// @dev 返回包含所有领养者地址的数组
    /// @return 返回存储所有领养者地址的固定大小数组
    function getAdopters() public view returns (address[16]) {
        // 返回整个领养者数组
        return adopters;
    }
}
