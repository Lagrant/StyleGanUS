from flask import Flask, render_template, request, flash, Request, url_for, redirect, jsonify
import json
from werkzeug import Response

import os
import random
import string

app = Flask(__name__)
log = app.logger

task_set = {
    'inversion': [12, 3], # size of task set, number of images each task set has (orig, w, w+ and w++), number of tasks that user study needs, 
    'age': [3, 3],
    'smile': [6, 2],
    'transition': [3, 2]
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
    'age': '&nbsp; &nbsp; This is the <strong>second part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">age</span>. The models are trained to modify the original person to a <strong>different age</strong> without changing other attributes.',
    'transition': '&nbsp; &nbsp; This is the <strong>third part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">gender</span>. The models are trained to modify the original person to <strong>the opposite gender</strong> without changing other attributes.'
}

@app.route('/')
def intro_page():

    return render_template('introduction.html')

@app.route('/index', methods=['POST'])
def index_page():
    # global user_name
    
    # user_name = request.get_data()
    # user_name = user_name.decode()
    # user_name = user_name.split('=')[-1]
    # file_path = os.path.join('./', 'users', user_name)
    # if not os.path.exists(file_path):
    #     os.mkdir(file_path)

    return render_template('index.html', taskCnt=0, task='Task 1: Inversion', question='Which image on the right do you think looks more identical to the image on the left? ', description='Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks more identical to the original image.')

@app.route('/task', methods=['GET'])
def get_task():
    task_name = request.args.get('name')
    first = int(request.args.get('count'))  # if it's the first task, if so, the task should be inversion
    # task_files = ['images/' + task_name + '/orig.png']
    task_files = []
    order_lst = shuffle_order(list(range(task_set[task_name][0])))[:task_set[task_name][1]]
    for i in order_lst:
        task_file = ['images/' + task_name + str(i) + '/orig.png']
        task_file.extend(random_generator(task_name + str(i)))
        task_files.append(task_file)
    
    # question = '&nbsp; &nbsp; which you think looks <strong>more realistic</strong> after editing?' if task_name != 'inversion' else '&nbsp; &nbsp; Which image on the right do you think looks more identical to the image on the left? '
    task_words = [task_names[task_name], task_descriptions[task_name]]
    return jsonify({'files': task_files, 'descriptions': task_words})

def shuffle_order(lst):
    random.shuffle(lst)

    return lst

def random_generator(task_name):
    algs = ['w', 'w+']
    for i in range(10):
        rand10 = random.randint(0,1)
    comp_alg = algs[rand10]
    
    tasks = ['images/' + task_name+'/'+comp_alg+'.png', 'images/' + task_name+'/w++.png']

    rand01 = random.randint(0,1)

    return [tasks[rand01], tasks[1-rand01]]

@app.route('/thanks', methods=['POST', 'GET'])
def end():

    return render_template('thanks.html')

@app.route('/saveuserdata', methods=['POST'])
def save_user_data():
    S = 10
    file_name = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S)) + '.json'
    with open(os.path.join('./users', file_name), 'w') as f:    
        json.dump(json.loads(request.get_data()), f)
    
    return Response('Successfully saved user data', status=200)

if (__name__=='__main__'):
    app.run(debug=True, use_debugger=False, use_reloader=True)
