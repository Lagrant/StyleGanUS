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

var loadTask = function (taskInfo) {
    $('#task-count').html(pivot.cur);
    orig_img.children[1].src = '/static/' + taskInfo.taskImgs[0];
    alg1_img.children[1].src = '/static/' + taskInfo.taskImgs[1];
    alg2_img.children[1].src = '/static/' + taskInfo.taskImgs[2];
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        if (choices[i].value === taskInfo.judge) {
            choices[i].checked = true;
            break;
        }
    }
}

var prevTask = function () {
    if (taskInfo.taskName === '') {
        return;
    }
    var sig = pivot.left();
    if (!sig) {
        return;
    }
    taskInfo = userData[pivot.cur-1];
    loadTask(taskInfo);
}

var nextTask = function () {
    if (taskInfo.taskName === '' || taskInfo.judge === '') {
        return;
    }
    
    if (pivot.cur < userData.length) {
        userData[pivot.cur-1] = taskInfo;
        pivot.right(userData.length);
        taskInfo = userData[pivot.cur-1];
        loadTask(taskInfo);

        return;
    }

    curList = userData;
    if (curList.length > 0 &&
        curList[curList.length-1].taskImgs[0] === taskInfo.taskImgs[0] && 
        curList[curList.length-1].taskImgs[1] === taskInfo.taskImgs[1] &&
        curList[curList.length-1].taskImgs[2] === taskInfo.taskImgs[2]) {

        userData[userData.length-1] = taskInfo;
    } else {
        userData.push(taskInfo);
        taskCnt++;
    }

    if (taskCnt == taskNames.length) {
        downloadUserData();
        $.ajax({
            url: '/saveuserdata',
            type: 'POST',
            data: JSON.stringify(userData),
            contentType: 'application/json; charset=UTF-8',
            success: function () {
                window.location.replace('/thanks');
            },
            error: function () {
                alert('Fail to end.');
            }
        });
        
        return;
    }
    if (taskImgs.length == 0) {
        taskInfo = {
            // taskName: taskInfo.taskName,
            taskName: taskNames[taskCnt],
            taskImgs: '',
            judge: '',
        }
        sendTask(taskInfo.taskName, taskCnt);
    } else {
        taskInfo = {
            taskName: taskNames[taskCnt],
            taskImgs: taskImgs.pop(),
            judge: '',
        }
        orig_img.children[1].src = '/static/' + taskInfo.taskImgs[0];
        alg1_img.children[1].src = '/static/' + taskInfo.taskImgs[1];
        alg2_img.children[1].src = '/static/' + taskInfo.taskImgs[2];
    }
    
    pivot.right(userData.length+1);
    
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        choices[i].checked = false;
    }
    $('#task-count').html(userData.length);
}

var sendTask = function (taskName, taskCnt=0) {
    var res = getTask(taskName);
    taskImgs = res['files'];
    orig_img.children[1].src = '/static/' + taskImgs[taskImgs.length - 1][0];
    alg1_img.children[1].src = '/static/' + taskImgs[taskImgs.length - 1][1];
    alg2_img.children[1].src = '/static/' + taskImgs[taskImgs.length - 1][2];
    taskInfo.taskImgs = taskImgs[taskImgs.length - 1].map((d) => d)
    taskImgs.pop();

    var descrips = res['descriptions'];
    $('#task-name').html(descrips[0]);
    $('#task-details').html(descrips[1]);
}

var reset = function () {
    orig_img.children[1].src = '/static/images/none.png';
    alg1_img.children[1].src = '/static/images/none.png';
    alg2_img.children[1].src = '/static/images/none.png';
    userData.length = 0;

    taskConfigReset();
}

var taskConfigReset = function () {
    for (info in taskInfo) {
        taskInfo[info] = '';
    }
    $('#task-count').html(0);
    var choices = $('#judge-better').find('input');
    for (let i = 0; i < choices.length; i++) {
        choices[i].checked = false;
    }
    pivot.reset();
    $('#task-descrip').html('');
}

var judgeBetter = function (better) {
    if (taskInfo.taskName === '') {
        alert('You need to specify your task first.');
        return;
    }
    taskInfo.judge = better;
}

var submitTaskData = function () {
    if (taskInfo.taskName === '') {
        alert('You need to specify your task first.');
        return;
    }

    curList = userData;
    if (curList.length > 0 &&
        curList[curList.length-1].taskImgs[0] === taskInfo.taskImgs[0] && 
        curList[curList.length-1].taskImgs[1] === taskInfo.taskImgs[1] &&
        curList[curList.length-1].taskImgs[2] === taskInfo.taskImgs[2]) {
        userData[userData.length-1] = taskInfo;
    } else if (taskInfo.judge !== '') {
        userData.push(taskInfo);
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