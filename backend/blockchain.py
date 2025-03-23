
import json
from typing import Any, Dict, List, Optional
from time import time
import hashlib
from uuid import uuid4
from urllib.parse import urlparse

import requests
from flask import Flask, jsonify, request



class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions=[]
        self.nodes = set()
        self.new_block(previous_hash='1', proof=0)

    def register_node(self, address:str):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    def valid_chain(self, chain: List[Dict[str, Any]]) -> bool:
        """
             验证一个区块链是否有效
             验证规则：
             2. 每个块的工作量证明必须是有效的
             """

        last_block_info = chain[0]
        current_index = 1
        while current_index < len(chain):
            current_block_info = chain[current_index]
            # 1.每个块的previous_hash必须正确指向前一个块的哈希值

            if current_block_info['previous_hash'] != self.hash(last_block_info):
                return False

            if not self.valid_proof(last_block_info['proof'], current_block_info['proof']):
                return False

            last_block_info = current_block_info
            current_index+=1
            return  True


    def resolve_conflicts(self) -> bool:
        neighbours = self.nodes
        new_chain = None
        max_length = len(self.chain)

        for node in neighbours:
            response = requests.get(f'http://{node}/getChainInfo')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        if new_chain:
            self.chain = new_chain
            return True
        return False


    def new_block(self, proof:int, previous_hash:Optional[str]) -> Dict[str, Any]:
        # 区块的格式
        # {
        #     "index": 0, # 区块
        #     "timestamp": "", # 时间戳
        #     "transactions": [
        #         {
        #             "sender": "",
        #             "recipient":"",
        #             "amount":5,
        #         } # 交易信息
        #     ],
        #     "proof": "", # 证明
        #     "previous_hash":"", # 前一区块哈希
        # }
        
        block = {
            'index': len(self.chain) +1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1])
        }

        self.current_transactions=[]
        self.chain.append(block)
        return block
    
    @staticmethod
    def hash(block:Dict[str,Any]) -> str:
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    

    @property
    def last_block(self) -> Dict[str, Any]:
        return self.chain[-1]

    # demo @property.setattr ⬆️
    # @last_block.setattr
    # def last_block(self, value):
    #     self.last_block=value

    def new_transaction(self, sender:str, recipient:str, amount:int) -> int:
        self.current_transactions.append({
            "sender": sender,
            "recipient": recipient,
            "amount": amount,
        })
        return self.last_block['index'] + 1

    def proof_of_work(self, last_proof:int) -> int:
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_proof:int, proof:int) -> bool:
        #/*//////////////////////////////////////////////////////////////
      #                            TODO
    #//////////////////////////////////////////////////////////////*/
        # TODO：将前一个块hash，和当前区块信息进行hash


        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        print(f'guess_hash: {guess_hash}')
        return guess_hash[:4] == "0000"


app = Flask(__name__)

node_identifier = str(uuid4()).replace('-', '')
print(node_identifier, 'node_identifier')
blockchain = Blockchain()

def get_response_temple(code:int, message:str="", data:Dict ={}) -> (Dict[str, Any], int):
    response = {
        "code":code,
        "message":message,
        "data": data
    }
    return jsonify(response), code


@app.route('/mine', methods=['GET'])
def mine():
    last_block = blockchain.last_block
    last_proof = last_block['proof']

    proof = blockchain.proof_of_work(last_proof)

    blockchain.new_transaction(sender="0", recipient=node_identifier, amount=1)

    block = blockchain.new_block(proof, last_proof)

    return get_response_temple(code=200, message='new Block Created', data=block)

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()
    required = ['sender', 'recipient', 'amount']

    if not all(k in values for k in required):
        return get_response_temple(code=500, message='丢失穿惨' )

    index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])


    return get_response_temple(code=200, message='new transaction', data={
        'index': index
    })


@app.route('/getChainInfo')
def get_chain_info():
    return get_response_temple(code=200, message='success', data={
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    })


@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()

    nodes = values.get('nodes')

    for node in nodes:
        blockchain.register_node(node)

    return get_response_temple(code=200, message='new nodes added', data={
        'total_nodes': list(blockchain.nodes)
    })


if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1', port=5001)
