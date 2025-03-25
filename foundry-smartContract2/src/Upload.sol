// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';


contract Upload is ERC721{
    constructor() ERC721("Pet", "Pet"){}
    
    // 上传后等于 mint一个 nft
        // 考虑 mint的时候要用 meta 且 IPFS上传图片
        // 上传到IPFS 是由前端js交互完成
        // 一旦拥有了   "https://vast-harlequin-magpie.myfilebase.com/ipfs/QmfW2Ht7aBjjZF1A89XjxfH1NNcSEqT3nkA7B1mce9Nb5u"; 就可以mint
    // 领养等于 transfer



    
}