// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

/// @title 合约迁移管理器
/// @dev 用于管理合约部署和升级过程的特殊合约
contract Migrations {
  // 合约所有者地址
  address public owner;
  
  // 记录最后一次完成的迁移版本号
  uint public last_completed_migration;

  /// @notice 限制函数只能由合约所有者调用的修饰器
  /// @dev 通过检查 msg.sender 是否为 owner 来限制函数访问
  modifier restricted() {
    if (msg.sender == owner) _; // 如果是所有者调用，继续执行函数体
  }

  /// @notice 构造函数，在合约部署时调用
  /// @dev 将合约部署者设置为合约所有者
  constructor() public {
    owner = msg.sender; // 部署合约的账户地址被设置为所有者
  }

  /// @notice 更新已完成的迁移版本号
  /// @dev 只有合约所有者可以调用此函数
  /// @param completed 最新完成的迁移版本号
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  /// @notice 升级到新版本的迁移合约
  /// @dev 部署新版本合约后，调用此函数进行升级
  /// @param new_address 新版本迁移合约的地址
  function upgrade(address new_address) public restricted {
    // 创建新版本合约的实例
    Migrations upgraded = Migrations(new_address);
    // 将当前的迁移版本号同步到新合约
    upgraded.setCompleted(last_completed_migration);
  }
}
