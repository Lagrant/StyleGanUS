$(document).ready(function() {
    orig_img = $('.original-image')[0];
    alg1_img = $('.alg1')[0];
    alg2_img = $('.alg2')[0];
})

var sendTask = function (ob) {
    var taskOb = $(ob)[0];
    var taskName = taskOb.options[taskOb.selectedIndex].value;
    $.ajax({
        type: 'GET',
        url: '/task?name='+taskName,
        contentType: 'application/json; charset=UTF-8',
        success: function(res) {
            taskImgs = res;
            console.log(orig_img.children[0].src)
        }
    })
}

var reset = function () {

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