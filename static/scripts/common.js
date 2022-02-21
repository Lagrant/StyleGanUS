var userData = {age1: [], age2: [], age3: [],
    smile1: [], smile2: [], smile13: [],
    transition1: [], transition2: [], transition3: []}
    
var taskInfo = {
    taskName: '',
    taskImgs: '',
    judge: '',
    comments: '',
}

var task_descriptions = (function () {
    var age = 'This is an age group that predicts how the person will be like whne he is {} base on his current face (20). Which picture do you think is more reasonable?';
    var smile = 'This is a smile group that makes the person open mouse and keep smiling. Which do you think more reasonable?';
    var transition = 'This is a transition group that transits a male/female to female/male. Pictures you see are the same medium stage of the transition from two algorithms. Which do you think is more reasonable?';

    return {
        age1: age,
        age2: age,
        age3: age,

        smile1: smile,
        smile2: smile,
        smile3: smile,

        transition1: transition,
        transition2: transition,
        transition3: transition
    }
})()