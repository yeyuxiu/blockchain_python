// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Layout of Contract:
// version
// imports
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

/*
* 遵循CEI：检查、影响、交互
* 1. Check：检查清算条件 | 检查需要进行状态更新时所需要的条件
* 2. Effects：更新用户头寸 | 更新合约状态
* 3. Interactions：转移抵押品 | 确保检查条件和更新状态完成后才与其他函数(合约)进行交互
*/

/**
 * @title NFTMarket
 * @author 
 * @notice 
 * @dev
    // 上传后等于 mint一个 nft
        // 考虑 mint的时候要用 meta 且 IPFS上传图片
        // 上传到IPFS 是由前端js交互完成
        // 一旦拥有了   "https://vast-harlequin-magpie.myfilebase.com/ipfs/QmfW2Ht7aBjjZF1A89XjxfH1NNcSEqT3nkA7B1mce9Nb5u"; 就可以mint
    // 领养等于 transfer
 */


    /*//////////////////////////////////////////////////////////////
                              合约说明
    //////////////////////////////////////////////////////////////*/
    /// 1. tokenURI是一个字符串,通常是一个指向NFT元数据的URL或IPFS哈希
    ///    元数据包含了NFT的名称、描述、图片等信息
    ///    所以tokenURI不是NFT本身,而是用来描述NFT的数据
    ///    NFT = 智能合约(链上) + 元数据(链下)
    /// 2. 每个NFT都有一个唯一的tokenId和对应的tokenURI
    // msg.sender -> tokenId -> tokenURI + 元数据 -> NFT

contract NFTMarket is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(address => uint256[]) private _ownerTokens; // 记录每个地址拥有的tokenId   address -> tokenIds -> URI -> NFT

    constructor(address initialOwner)
        ERC721("NFT Pet", "NP")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _ownerTokens[to].push(tokenId);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    //   function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override(ERC721, IERC721)   {
    //     super.safeTransferFrom(from, to, tokenId, "");
    // }
    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    

    //getter

    function getMyOwnerTokens(address _owner) public view returns(uint256[] memory){
        return _ownerTokens[_owner];
    }
}