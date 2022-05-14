var userData = [];

var taskNames = ['inversion', 'inversion', 'inversion', 'smile', 'smile', 'age', 'age', 'age', 'transition', 'transition'];

var taskInfo = {
    taskName: '',
    taskImgs: '',
    judge: '',
}

var taskImgs = undefined;

var task_set = {
    'inversion': [12, 3], // size of task set, number of images each task set has (orig, w, w+ and w++), number of tasks that user study needs, 
    'age': [3, 3],
    'smile': [6, 2],
    'transition': [3, 2]
}

var task_names = {
    'inversion': '<strong>Task 1: Inversion</strong>',
    'smile': '<strong>Task 2-1: Expression Editing</strong>',
    'age': '<strong>Task 2-2: Age Editing</strong>',
    'transition': '<strong>Task 2-3: Gender Edition</strong>'
}

var task_descriptions = {
    'inversion': '&nbsp; &nbsp; Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks <strong>more identical</strong> to the original image.',
    'smile': '&nbsp; &nbsp; This is the <strong>first part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">facial expression</span>. The models are trained to modify the original image to <strong>a smiling face</strong> without changing other attributes. Among these two images, you are expected to select <span style="font-weight: bold; color: red;">One And Only One</span> image which you think looks <strong>more realistic<strong> after editing. ',
    'age': '&nbsp; &nbsp; This is the <strong>second part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">age</span>. The models are trained to modify the original person to a <strong>different age</strong> without changing other attributes.',
    'transition': '&nbsp; &nbsp; This is the <strong>third part</strong> of <strong>Task 2</strong>. The target attribute for this part is <span style="font-weight: bold; color: red;">gender</span>. The models are trained to modify the original person to <strong>the opposite gender</strong> without changing other attributes.'
}