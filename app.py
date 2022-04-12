from flask import Flask, render_template, request, flash, Request, url_for, redirect, jsonify
import json
from werkzeug import Response

import os
import random
import string

app = Flask(__name__)
log = app.logger

user_name = ''
task_set = {
    'inversion': [3, 1, 2], # size of task set, number of images each task set has, number of task that user study needs, 
    'age': [12, 4, 4],
    'smile': [6, 1, 2],
    'transition': [3, 1, 2]
}
task_set_size = {
    'inversion': 3,
    'age': 3,
    'smile': 6,
    'transition': 3
}
task_cols = {
    'inversion0': [0],
    'inversion1': [0],
    'inversion2': [0],
    'age0': [30,40,50,60],
    'age1': [30,40,50,60],
    'age2': [40,50,60,70],
    'smile0': [0],
    'smile1': [0],
    'smile2': [0],
    'smile3': [0],
    'smile4': [0],
    'smile5': [0],
    'transition0': [0],
    'transition1': [0],
    'transition2': [0],
}

task_names = {
    'inversion': '<strong>Task 1: Inversion</strong>',
    'smile': '<strong>Task 2-1: Expression Editing</strong>',
    'age': '<strong>Task 2-2: Age Editing</strong>',
    'transition': '<strong>Task 2-3: Gender Edition</strong>'
}

task_descriptions = {
    'inversion': '&nbsp; &nbsp; Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks <strong>more identical</strong> to the original image.',
    'smile': '&nbsp; &nbsp; This is the <strong>first part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">facial expression</span>. The models are trained to modify the original image to <strong>a smiling face</strong> without changing other attributes. Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks <strong>more realistic<strong> after editing. ',
    'age': '',
    'transition': ''
}

@app.route('/')
def intro_page():

    return render_template('introduction.html')

@app.route('/index', methods=['POST'])
def index_page():
    global user_name
    
    user_name = request.get_data()
    user_name = user_name.decode()
    user_name = user_name.split('=')[-1]
    file_path = os.path.join('./', 'users', user_name)
    if os.path.exists(file_path):
        return render_template('index.html', taskCnt=0, task='Task 1: Inversion', question='Which image on the right do you think looks more identical to the image on the left? ', description='Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks more identical to the original image.')
    
    os.mkdir(file_path)

    return render_template('index.html', taskCnt=0, task='Task 1: Inversion', question='Which image on the right do you think looks more identical to the image on the left? ', description='Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks more identical to the original image.')

@app.route('/newuser', methods=['GET'])
def set_new_user():
    global user_name

    user_name = ''

    return render_template('introduction.html')

@app.route('/task', methods=['GET'])
def get_task():
    task_name = request.args.get('name')
    first = int(request.args.get('count'))  # if it's the first task, if so, the task should be inversion
    # task_files = ['images/' + task_name + '/orig.png']
    task_files = []
    order_lst = shuffle_order(list(range(task_set[task_name][0])))[:task_set[task_name][2]]
    for i in order_lst:
        set_idx = i // task_set[task_name][1]
        img_idx = i % task_set[task_name][1]
        task_file = ['images/' + task_name + str(set_idx) + '/orig.png']
        task_file.extend(random_generator(task_name + str(set_idx), img_idx))
        task_files.append(task_file)
    
    # question = '&nbsp; &nbsp; which you think looks <strong>more realistic</strong> after editing?' if task_name != 'inversion' else '&nbsp; &nbsp; Which image on the right do you think looks more identical to the image on the left? '
    task_words = [task_names[task_name], task_descriptions[task_name]]
    return jsonify({'files': task_files, 'descriptions': task_words})

def shuffle_order(lst):
    random.shuffle(lst)

    return lst

def random_generator(task_name, img_idx):
    algs = ['w', 'w+']
    for i in range(10):
        rand10 = random.randint(0,1)
    comp_alg = algs[rand10]
    
    # col = random.randint(0,len(task_cols[task_name])-1)
    col = task_cols[task_name][img_idx]
    tasks = ['images/' + task_name+'/'+comp_alg+'_'+str(col)+'.png', 'images/' + task_name+'/w++_'+str(col)+'.png']

    rand01 = random.randint(0,1)

    return [tasks[rand01], tasks[1-rand01]]

@app.route('/thanks', methods=['POST', 'GET'])
def end():

    return render_template('thanks.html')

@app.route('/saveuserdata', methods=['POST'])
def save_user_data():
    S = 10
    file_name = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S)) + '.json'
    with open(os.path.join('./users', user_name, file_name), 'w') as f:    
        json.dump(json.loads(request.get_data()), f)
    
    return Response('Successfully saved user data', status=200)

if (__name__=='__main__'):
    app.run(debug=True, use_debugger=False, use_reloader=True)
