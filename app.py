from flask import Flask, render_template, request, flash, Request, url_for, redirect, jsonify
import json
from werkzeug import Response

import os
import random
import string

app = Flask(__name__)
log = app.logger

user_name = ''
task_cols = {'age1': [30,40,50,60],
'age2': [30,40,50,60],
'age3': [40,50,60,70],
'smile1': [0],
'smile2': [0],
'smile3': [0],
'smile4': [0],
'smile5': [0],
'smile6': [0],
'transition1': [0,1,2,3],
'transition2': [0,1,2,3],
'transition3': [0,1,2,3],
}

@app.route('/')
@app.route('/index')
def index_page(name=None):

    return render_template('index.html', name=name)

@app.route('/newuser', methods=['GET'])
def set_new_user():
    global user_name
    user_name = request.args.get('name')
    os.mkdir(os.path.join('./', 'users', user_name))

    return Response('success', status=200)

@app.route('/task', methods=['GET'])
def get_task():
    task_name = request.args.get('name')
    first = int(request.args.get('count'))  # if it's the first task, if so, the task should be inversion
    task_files = ['images/' + task_name + '/orig.png']
    task_files.extend(random_generator(task_name, first == 1))
    
    return jsonify(task_files)

def random_generator(task_name, inversion=False):
    algs = ['w', 'w+']
    rand10 = random.randint(0,1)
    comp_alg = algs[rand10]
    if (inversion):
        col = 'inv'
    else:
        col = random.randint(0,len(task_cols[task_name])-1)
        col = task_cols[task_name][col]
    tasks = ['images/' + task_name+'/'+comp_alg+'_'+str(col)+'.png', 'images/' + task_name+'/w++_'+str(col)+'.png']

    rand01 = random.randint(0,1)

    return [tasks[rand01], tasks[1-rand01]]

@app.route('/saveuserdata', methods=['POST'])
def save_user_data():
    S = 10
    file_name = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S)) + '.json'
    with open(os.path.join('./users', user_name, file_name), 'w') as f:    
        json.dump(json.loads(request.get_data()), f)
    
    return Response('Successfully saved user data', status=200)