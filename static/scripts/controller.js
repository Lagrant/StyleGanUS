$(document).ready(function() {
    orig_img = $('.original-image')[0];
    alg1_img = $('.alg1')[0];
    alg2_img = $('.alg2')[0];
    $('#image-comments')[0].addEventListener('input', getComments);
})


var pivot = (function () {
    var lower = 1, upper = 1;
    var cur = upper;
    
    return {
        get cur() {
            return cur;
        },
        
        left: function () {
            if (cur <= lower) {
                return false;
            } else {
                cur -= 1;
                $('#task-count').html(cur);
                return true;
            }
        },
        right: function (taskSeriLen) {
            upper = taskSeriLen;
            if (cur >= upper) {
                return false;
            } else {
                cur += 1;
                $('#task-count').html(cur);
                return true;
            }
        },
        reset: function () {
            lower = 1;
            cur = upper = 1;
        }
    }
})();

var onSelection = function (ob) {
    taskConfigReset();

    var taskOb = $(ob)[0];
    taskInfo.taskName = taskOb.options[taskOb.selectedIndex].value;
    $('#task-descrip').html(task_descriptions[taskInfo.taskName]);
    sendTask(taskInfo.taskName, 1);
}

var loadTask = function (taskInfo) {
    $('#task-count').html(pivot.cur);
    orig_img.children[0].src = '/static/' + taskInfo.taskImgs[0];
    alg1_img.children[0].src = '/static/' + taskInfo.taskImgs[1];
    alg2_img.children[0].src = '/static/' + taskInfo.taskImgs[2];
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        if (choices[i].value === taskInfo.judge) {
            choices[i].checked = true;
            break;
        }
    }
    $('#image-comments')[0].value = taskInfo.comments;
}

var prevTask = function () {
    if (taskInfo.taskName === '') {
        return;
    }
    var sig = pivot.left();
    if (!sig) {
        return;
    }
    taskInfo = userData[taskInfo.taskName][pivot.cur-1];
    loadTask(taskInfo);
}

var nextTask = function () {
    if (taskInfo.taskName === '') {
        return;
    }
    if (pivot.cur < userData[taskInfo.taskName].length) {
        userData[taskInfo.taskName][pivot.cur-1] = taskInfo;
        pivot.right(userData[taskInfo.taskName].length);
        taskInfo = userData[taskInfo.taskName][pivot.cur-1];
        loadTask(taskInfo);

        return;
    }

    if (taskInfo.judge !== '') {
        curList = userData[taskInfo.taskName];
        if (curList.length > 0 &&
            curList[curList.length-1].taskImgs[0] === taskInfo.taskImgs[0] && 
            curList[curList.length-1].taskImgs[1] === taskInfo.taskImgs[1] &&
            curList[curList.length-1].taskImgs[2] === taskInfo.taskImgs[2]) {

            userData[taskInfo.taskName][userData[taskInfo.taskName].length-1] = taskInfo;
            pivot.right(userData[taskInfo.taskName].length+1);
        } else {
            userData[taskInfo.taskName].push(taskInfo);

            pivot.right(userData[taskInfo.taskName].length+1);
        }
    }
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        choices[i].checked = false;
    }
    $('#image-comments')[0].value = '';
    $('#task-count').html(userData[taskInfo.taskName].length);

    taskInfo = {
        taskName: taskInfo.taskName,
        taskImgs: '',
        judge: '',
        comments: '',
    }
    sendTask(taskInfo.taskName, 0);
}

var sendTask = function (taskName, firstTime=0) {
    $.ajax({
        type: 'GET',
        url: '/task?name='+taskName+'&count='+firstTime,
        contentType: 'application/json; charset=UTF-8',
        success: function(res) {
            var taskImgs = res;
            orig_img.children[0].src = '/static/' + taskImgs[0];
            alg1_img.children[0].src = '/static/' + taskImgs[1];
            alg2_img.children[0].src = '/static/' + taskImgs[2];
            taskInfo.taskImgs = taskImgs.map((d) => d)
        }
    })
}

var reset = function () {
    orig_img.children[0].src = '/static/images/none.png';
    alg1_img.children[0].src = '/static/images/none.png';
    alg2_img.children[0].src = '/static/images/none.png';
    for (tsk in userData) {
        userData[tsk] = [];
    }
    $('#task-type')[0].value='placehoder';

    taskConfigReset();
}

var taskConfigReset = function () {
    for (info in taskInfo) {
        taskInfo[info] = '';
    }
    $('#image-comments')[0].value = '';
    $('#task-count').html(0);
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        choices[i].checked = false;
    }
    pivot.reset();
    $('#task-descrip').html('');
}

var newUser = function () {
    var userName = str10();
    $.ajax({
        type: 'GET',
        url: '/newuser?name='+userName,
        contentType: 'application/json; charset=UTF-8',
        success: function(res) {
            if (res === 'success') {
                reset();
            } else {
                alert('Fail to add a new user.');
            }
        },
        error: function() {
            alert('Fail to add a new user, something wrong in the server.');
        }
    })
}

var judgeBetter = function (better) {
    if (taskInfo.taskName === '') {
        alert('You need to specify your task first.');
        return;
    }
    taskInfo.judge = better;
}

var getComments = function (event) {
    if (taskInfo.taskName === '') {
        alert('You need to specify your task first.');
        return;
    }
    taskInfo.comments = event.target.value;
}

var submitTaskData = function () {
    if (taskInfo.taskName === '') {
        alert('You need to specify your task first.');
        return;
    }
    // userData[taskInfo.taskName].push(taskInfo);
    curList = userData[taskInfo.taskName];
    if (curList.length > 0 &&
        curList[curList.length-1].taskImgs[0] === taskInfo.taskImgs[0] && 
        curList[curList.length-1].taskImgs[1] === taskInfo.taskImgs[1] &&
        curList[curList.length-1].taskImgs[2] === taskInfo.taskImgs[2]) {
        userData[taskInfo.taskName][userData[taskInfo.taskName].length-1] = taskInfo;
    } else if (taskInfo.judge !== '') {
        userData[taskInfo.taskName].push(taskInfo);
    }

    $.ajax({
        type: 'POST',
        url: '/saveuserdata',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(userData),
        success: function (res) {
            alert('Successfully submitted.');
            return;
        },
        error: function () {
            alert('Fail to submit data.');
            return;
        }
    });

    reset();
}

var downloadUserData = function () {
    var d = new Date();
    var time = d.getFullYear() + "_" + d.getMonth() + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();

    var text = JSON.stringify(userData);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'output_' + time + '.json');
    element.setAttribute('id', 'downloadit')
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    
    document.body.removeChild(element);
}