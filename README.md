# backend

python 实现本地区块链

- 暂时用 Ganache 作为测试链

# frontend

## umi4 + antd5 + ethers.js 实现前端

```
node v20.18.1
```

IPFS 上传+普通交互

# foundry-smartContract2

所有智能合约

# 持续实现的功能

1. NFT 交易市场
   - ERC721 的转让
   - IPFS 的上传图片和具体信息
2. 质押
3. 老虎机

---

### IPFS 使用 

#### 📄 相关文档 
[使用 helia 创造节点，处理文件格式，生成 cid，最后可以使用 get 还原数据](https://ipfs.github.io/helia/)

[helia github](https://github.com/ipfs/helia)

[ipfs 官网: 介绍了使用 helia 处理数据格式](http://bafybeicjdpjkknlnu5hybybhd3quhswzipfgy34l7m5wzxrn4yvc524ere.ipfs.localhost:8080/how-to/ipfs-in-web-apps/#addressing-data-by-cid)

[使用 verified-fetch 验证数据并获取数据](http://bafybeifqisabcdqimdrc2cxbp2wndyk7vh7jvn2fjoecj5nrzdg4bv5ony.ipfs.localhost:8080/verified-fetch/)


#### 🧩 示例代码 
**利用后端服务，或者本地的 rpc 来请求达到固定数据**

---

基础部分（ helia创建节点 + 数据处理 + 上传到本地ipfs + 可以被本地ipfs访问 + verified验证数据）：
```javascript
# 要进行跨语处理
# ipfs要配置 localhost:8000 允许访问
# 利用 helia 先将数据转为 cid 然后再请求 ipfs rpc api

import { dagCbor } from '@helia/dag-cbor';
import { strings } from '@helia/strings';
import { unixfs } from '@helia/unixfs';
import { createHelia } from 'helia';
import { createHeliaHTTP } from '@helia/http';
import { verifiedFetch } from '@helia/verified-fetch';

// p2p 节点连接
// import { createLibp2p } from 'libp2p'
// import { bootstrap } from '@libp2p/bootstrap'
// import { identify } from '@libp2p/identify'
// import { tcp } from '@libp2p/tcp'
// import { noise } from '@chainsafe/libp2p-noise'
// import { yamux } from '@chainsafe/libp2p-yamux'
// import { webRTC } from '@libp2p/webrtc'
// import { websockets } from '@libp2p/websockets'
// import { webtransport } from '@libp2p/webtransport'

const formData = new FormData();
formData.append("file", JSON.stringify(object));
const resc = await axiosPost(`/api/v0/add`, formData);
const cid = resc.data.Hash;
# 固定数据
const res =await  axiosPost(`/api/v0/pin/add?arg=/ipfs/${cid}`, {arg: `/ipfs/${cid}`})
console.log(res, 'res');

# 利用cid + verified-fetch 还原数据
const oriData = await verifiedFetch('ipfs://cid....') # json{}

```

⬇️ ```package.json``` 

```json
    /////////// base helia
    "helia": "^5.3.0",
    "@helia/http": "^2.0.5",
    "@helia/json": "^4.0.3",
    "@helia/strings": "^4.0.3",
    "@helia/unixfs": "^5.0.0",
    "@helia/verified-fetch": "^2.6.4",
    "@helia/dag-cbor": "^4.0.3",


    "@chainsafe/libp2p-noise": "^16.1.0",
    "@chainsafe/libp2p-yamux": "^7.0.1",

    "axios": "^1.8.4",
    "blockstore-core": "^5.0.2",
    "blockstore-fs": "^2.0.2",
    "datastore-core": "^10.0.2",
    "datastore-fs": "^10.0.2",
    "ipfs-http-client": "^60.0.1",
    "kubo-rpc-client": "^5.1.0",

    //////     libp2p
    "libp2p": "^2.8.2",
    "@libp2p/bootstrap": "^11.0.32",
    "@libp2p/identify": "^3.0.27",
    "@libp2p/tcp": "^10.1.8",
    "@libp2p/webrtc": "^5.2.9",
    "@libp2p/websockets": "^9.2.8",
    "@libp2p/webtransport": "^5.0.37",
```

---
**后续...**
* 远程固定服务
* libp2p 节点连接
* 文件夹处理
* 使用块

