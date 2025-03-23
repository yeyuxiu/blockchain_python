from typing import Dict, Any

from flask import Flask, request, jsonify, redirect, url_for


app = Flask(__name__)


# 返回模版
def get_response_temple(code:int, message:str="", data:Dict ={}) -> (Dict[str, Any], int):
    response = {
        "code":code,
        "message":message,
        "data": data
    }
    return jsonify(response), code

@app.route('/')
def hello():
    return 'Welcome to My Watchlist!'

@app.route('/test')
def test():
    return 'asdiojasiodjasd'

# 带有变量的路由 + 指定类型
@app.route('/user/<int:username>')
def show_user(username):
    return f'User: {username}'

# 表单数据
@app.route('/submit', methods=['POST'])
def submit():
    print(request, 'request')
    name = request.form.get('name')

    if name:
        data = {"name": name}
        return get_response_temple(200, message='success', data=data)
    else:
        return get_response_temple(500, )

# 重定向
@app.route('/logout')
def logout():
    return redirect(url_for('test'))


#if __name__ == '__main__':
app.run(host='127.0.0.1', port=5001, debug=True)