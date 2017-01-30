//connect the websql db
if (window.openDatabase) {
    var db = openDatabase("tododb", "0.1", "todo_entry", 2 * 1024 * 1024);

    //start transactions
    db.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS tododb ( \
                    todoID INTEGER PRIMARY KEY ASC, \
                    heading   TEXT, \
                    desc      TEXT, \
                    sdate     TEXT, \
                    stime     TEXT, \
                    edate     TEXT, \
                    etime     TEXT, \
                    allday    TEXT, \
                    tag       TEXT \
                    )");

        console.log("DB CREATED");

        //debug point for websql testing
        /* test entry >>*/

        t.executeSql("INSERT INTO tododb (heading, desc, sdate, stime, edate, etime, allday, tag) \
                      VALUES ('testHead','desc','sdate','stime','edate','etime','allday','tag')");
        console.log("TEST DB CREATED");


    });
} else {
    console.log("DB ERROR OCCURED");
}


//Add todo items
function addTODO() {
    //check database connection
    if (db) {
        //get input data from the submit form
        var todo_heading = document.getElementById("todo-header").value;
        var todo_desc = document.getElementById("todo-desc").value;
        var todo_sdate = document.getElementById("todo-sdate").value;
        var todo_stime = document.getElementById("todo-stime").value;
        var todo_edate = document.getElementById("todo-edate").value;
        var todo_etime = document.getElementById("todo-etime").value;
        var todo_allday = document.getElementById("todo-allday").value;
        var todo_tag = document.getElementById("todo-tag").value;

        //debug point for output testing
        /*
        var test = document.getElementById("test");
        test.innerHTML = todo_heading + " " + todo_desc; 
        */

        //check for header is available
        if (todo_heading != '' && todo_sdate != '') {
            db.transaction(function(t) {
                //insert the new todo entry into the database
                t.executeSql("INSERT INTO tododb (heading, desc, sdate, stime, edate, etime, allday, tag) \
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [todo_heading, todo_desc, todo_sdate, todo_stime, todo_edate, todo_etime, todo_allday, todo_tag]);

                console.log("NEW TODO ENTRY");

                //close the addtodo window and refresh the todolist
                exitBtn("app-todoadd");
                displayTodo();
            });
        } else {
            alert("YOU NEED TO HAVE A HEADING AND A START DATE");
            console.log("INCOMPLETE SUBMIT");
        }
    }
}

//display todo list
function displayTodo() {
    if (db) {
        db.transaction(function(t) {
            // display data from the db
            t.executeSql("SELECT * FROM tododb", [], refreshTodo);
            //t.executeSql("SELECT * FROM todo_db ORDER BY sdate ASC", [], refreshTodo);
        });
    } else {
        console.log("LIST DISPLAY ERROR");
    }
}

//refresh the todo list
function refreshTodo(transaction, results) {
    var todoList = document.getElementById("app-content");
    var todoTask = '';

    //clear the todolist
    todoList.innerHTML = '';

    //if data table is empty
    if (results.rows.length == 0) {
        todoList.innerHTML = "EMPTY";
        console.log("DB EMPTY");
    } else {
        for (var i = 0; i < results.rows.length; i++) {
            var todoRaw = results.rows.item(i);

            console.log(todoRaw.heading);

            todoList.innerHTML += 'Mahesh' + todoRaw.heading;

        }
    }
}

function removeTodo(todoID) {
    //check status of db available
    if (db) {
        db.transaction(function(t) {
            t.executeSql("DELETE FROM tododb WHERE todoID=?", [todoID], displayTodo);
        });
    } else {
        console.log("ERROR DELETING TODO id:" + todoID);
    }
}
displayTodo();