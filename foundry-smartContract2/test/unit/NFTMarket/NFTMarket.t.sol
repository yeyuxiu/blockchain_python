// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {NFTMarket} from "@src/NFTMarket/NFTMarket.sol";
// import {DeployNFTMarket} from "@script/DeployNFTMarket.s.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketTest is Test {
    address public USER1 = makeAddr("user1");
    address public USER2 = makeAddr("user2");
    address public OWNER = makeAddr("owner");
    NFTMarket public nftMarket;
    string public constant PUG =
        "https://vast-harlequin-magpie.myfilebase.com/ipfs/QmfW2Ht7aBjjZF1A89XjxfH1NNcSEqT3nkA7B1mce9Nb5u";

    function setUp() external {
        vm.startBroadcast(OWNER);
        nftMarket = new NFTMarket(OWNER);
        vm.stopBroadcast();
    }

    // 非Owner 不能mint
    function testUserCanNotMint() public {
        vm.prank(USER1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                address(USER1)
            )
        );
        nftMarket.safeMint(USER1, PUG);
    }

    function testCanMint() public {
        vm.startPrank(OWNER);
        uint256 tokenId = nftMarket.safeMint(USER1, PUG);
        uint256 expectNextTokenId = 0;
        assert(expectNextTokenId == tokenId);

        string memory tokenURI = nftMarket.tokenURI(tokenId);
        assert(
            keccak256(abi.encodePacked(tokenURI)) ==
                keccak256(abi.encodePacked(PUG))
        );
        vm.stopPrank();
    }

    function testTransfer() public{
        vm.prank(OWNER);
        uint256 tokenId = nftMarket.safeMint(USER1, PUG);
        vm.prank(USER1);
        nftMarket.safeTransferFrom(USER1, USER2, tokenId);

        uint256 user1Balance = nftMarket.balanceOf(USER1);
        uint256 user2Balance = nftMarket.balanceOf(USER2);
        assert(user1Balance == 0);
        assert(user2Balance == 1);

        address owner = nftMarket.ownerOf(tokenId);
        assert(owner == USER2);

    }

    function testSupportsInterface () public {
        bool supportsInterface = nftMarket.supportsInterface(0x80ac58cd);
        assert(supportsInterface == true);
    }
}
