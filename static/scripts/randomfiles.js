function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function random_generator(task_name) {
    var algs = ['w', 'w+'], rand10 = undefined;
    for (let i = 0; i < 10; i++) {
        rand10 = randint(0,1);
    }
    var comp_alg = algs[rand10];
    
    var tasks = ['images/' + task_name+'/'+comp_alg+'.png', 'images/' + task_name+'/w++.png'];

    var rand01 = randint(0,1);

    return [tasks[rand01], tasks[1-rand01]];
}

function getTask(task_name) {
    var task_files = [];
    var order_lst = shuffle(Array.from(Array(task_set[task_name][0]), (_, i) => i)).slice(0, task_set[task_name][1])
    for (let i = 0; i < order_lst.length; i++) {
        var task_file = ['images/' + task_name + order_lst[i].toString() + '/orig.png'];
        task_file = task_file.concat(random_generator(task_name + order_lst[i].toString()))
        task_files.push(task_file);
    }
    var task_words = [task_names[task_name], task_descriptions[task_name]];
    
    return {'files': task_files, 'descriptions': task_words}
}