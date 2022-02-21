from flask import Flask, render_template, request, flash, Request, url_for, redirect, jsonify
import json
from werkzeug import Response

import os
import random

app = Flask(__name__)
log = app.logger

user_name = ''
task_cols = {'age1': [30,40,50,60],
'age2': [30,40,50,60],
'age3': [30,40,50,60],
'smile1': [0],
'smile2': [0],
'smile3': [0],
'transition1': [0,1,2,3],
'transition2': [0,1,2,3],
'transition3': [0,1,2,3],
}
task_files = []

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
    global task_files
    task_name = request.args.get('name')
    count = request.args.get('count')
    task_files = ['images/' + task_name + '/orig.png']
    if (int(count) == 1):
        task_files.extend(random_generator(task_name, True))
    else:
        task_files.extend(random_generator(task_name, False))
    
    return jsonify(task_files)

@app.route('/<int:idx>')
def get_task_image(idx):
    return task_files[idx]

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
