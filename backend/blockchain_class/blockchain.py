import hashlib
import json
from time import time
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from uuid import uuid4

import requests
from flask import Flask, jsonify, request


class Blockchain:
    def __init__(self):
        self.current_transactions = []  # 存储当前待处理的交易
        self.chain = []                # 存储区块链
        self.nodes = set()            # 存储网络中的节点，使用set确保节点唯一性
        
        # 创建创世块（区块链的第一个块）
        self.new_block(previous_hash='1', proof=100)

    def register_node(self, address: str) -> None:
        """添加新节点到节点列表中"""
        # urlparse 是 Python 标准库中用于解析 URL 的工具
        # 例如: 'http://192.168.0.5:5000' 会被解析成各个组件
        parsed_url = urlparse(address)
        # netloc 包含了主机名和端口号，如 '192.168.0.5:5000'
        self.nodes.add(parsed_url.netloc)

    def valid_chain(self, chain: List[Dict[str, Any]]) -> bool:
        """
        验证一个区块链是否有效
        验证规则：
        1. 每个块的 previous_hash 必须正确指向前一个块的哈希值
        2. 每个块的工作量证明必须是有效的
        """

        last_block = chain[0]
        current_index = 1

        while current_index < len(chain):
            block = chain[current_index]
            # 验证块的哈希链接
            if block['previous_hash'] != self.hash(last_block):
                return False
            # 验证工作量证明
            if not self.valid_proof(last_block['proof'], block['proof']):
                return False
            last_block = block
            current_index += 1
        return True

    def resolve_conflicts(self) -> bool:
        """
        实现共识算法：
        1. 获取所有邻居节点的区块链
        2. 找到最长的有效链
        3. 如果找到比自己更长的有效链，就替换自己的链
        """
        neighbours = self.nodes
        new_chain = None
        max_length = len(self.chain)

        # 检查所有邻居节点的链
        for node in neighbours:
            # 使用 requests 库发送 HTTP 请求获取其他节点的链
            response = requests.get(f'http://{node}/chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                # 如果链更长且有效，就记录下来
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        # 如果找到了更长的有效链，就替换自己的链
        if new_chain:
            self.chain = new_chain
            return True
        return False

    def new_block(self, proof: int, previous_hash: Optional[str]) -> Dict[str, Any]:
        """
        创建新的区块：
        1. 包含区块索引、时间戳、交易列表、工作量证明和前一个块的哈希
        2. 清空当前交易列表
        3. 将新块添加到链中
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        self.current_transactions = []
        self.chain.append(block)
        return block


    def new_transaction(self, sender: str, recipient: str, amount: int) -> int:
        """
        创建新的交易信息：
        1. 将交易信息添加到待处理交易列表中
        2. 返回这笔交易将被添加到的区块的索引
        """
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })
        # 返回下一个要被添加的区块索引
        # 因为交易会被添加到下一个新区块中，而不是当前区块
        # 当前区块的索引 + 1 就是下一个区块的索引
        return self.last_block['index'] + 1

    @property  # Python装饰器，使这个方法可以像属性一样被访问
    def last_block(self) -> Dict[str, Any]:
        """返回链中的最后一个块"""
        return self.chain[-1]

    @staticmethod  # 静态方法，不需要访问类的实例
    def hash(block: Dict[str, Any]) -> str:
        """
        计算块的 SHA-256 哈希值：
        1. 将块转换为有序的JSON字符串
        2. 编码为字节串
        3. 计算SHA-256哈希值
        """
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof: int) -> int:
        """
        工作量证明算法：
        找到一个数字 proof，使得与前一个块的 proof 组合后的哈希值以4个0开头
        """
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof: int, proof: int) -> bool:
        """
        验证工作量证明：
        1. 将前一个proof和当前proof组合
        2. 计算哈希值
        3. 检查是否以4个0开头
        """
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"


# Instantiate the Node
app = Flask(__name__)

# Generate a globally unique address for this node
node_identifier = str(uuid4()).replace('-', '')

# Instantiate the Blockchain
blockchain = Blockchain()


@app.route('/mine', methods=['GET'])
def mine():
    """
    挖矿路由：
    1. 执行工作量证明算法获取新的证明
    2. 给挖矿节点发放奖励（1个币）
    3. 构建新的区块并添加到链中
    
    请求方式：GET
    返回：新区块的信息和200状态码
    """
    # We run the proof of work algorithm to get the next proof...
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)

    # 给工作量证明的节点提供奖励.
    # 发送者为 "0" 表明是新挖出的币
    blockchain.new_transaction(
        sender="0",
        recipient=node_identifier,
        amount=1,
    )

    # Forge the new Block by adding it to the chain
    block = blockchain.new_block(proof, None)

    response = {
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200


@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    """
    创建新交易路由：
    1. 接收POST请求中的交易数据（发送者、接收者、金额）
    2. 验证数据完整性
    3. 将交易添加到待处理列表中
    
    请求方式：POST
    请求数据格式：
    {
        "sender": "发送者地址",
        "recipient": "接收者地址",
        "amount": 交易金额
    }
    返回：交易将被添加到的区块索引和201状态码
    """
    values = request.get_json()

    # 检查POST数据
    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400

    # Create a new Transaction
    index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])

    response = {'message': f'Transaction will be added to Block {index}'}
    return jsonify(response), 201


@app.route('/chain', methods=['GET'])
def full_chain():
    """
    获取完整区块链路由：
    返回当前节点存储的完整区块链数据
    
    请求方式：GET
    返回：
    {
        "chain": [区块链数据],
        "length": 链长度
    }
    """
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200


@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    """
    注册新节点路由：
    将新的节点添加到当前节点的节点列表中
    
    请求方式：POST
    请求数据格式：
    {
        "nodes": ["节点1地址", "节点2地址", ...]
    }
    返回：注册成功信息和当前所有节点列表
    """
    values = request.get_json()

    nodes = values.get('nodes')
    if nodes is None:
        return "Error: Please supply a valid list of nodes", 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New nodes have been added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201


@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    """
    共识路由：
    解决节点间的区块链差异，确保网络中所有节点达成一致
    实现方式：采用最长链原则
    
    请求方式：GET
    返回：
    - 如果本地链被替换：新的链数据
    - 如果本地链未被替换：当前链数据
    """
    replaced = blockchain.resolve_conflicts()

    if replaced:
        response = {
            'message': 'Our chain was replaced',
            'new_chain': blockchain.chain
        }
    else:
        response = {
            'message': 'Our chain is authoritative',
            'chain': blockchain.chain
        }

    return jsonify(response), 200


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='127.0.0.1', port=port)
