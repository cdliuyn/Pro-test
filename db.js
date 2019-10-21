var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mytest.db');



/*db.serialize(function() {

    // fn_dbrun();
    
    (async ()=>{
        arr = [fn_createTbl(), fn_insertRows(), fn_selectRows(),fn_updateRows(),fn_selectRows()]
        for (var i=0; i < arr.length; i++) {
            result = await arr[i]();
            console.log(result);
        }
    })();
    
    /*db.run("CREATE TABLE Table1 (id INT, info TEXT)");
        
    db.run("BEGIN TRANSACTION");
    var stmt1 = db.prepare("INSERT INTO Table1 VALUES(?, ?)");
    for (var i = 1; i < 101; i++) {
        stmt1.run(i, "Ipsum " + i);
    }
    stmt1.finalize();
    db.run("COMMIT TRANSACTION");
    console.log("1--------------------");

    db.each("SELECT id, info FROM Table1", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
    db.run("BEGIN TRANSACTION");
    var stmt2 = db.prepare("UPDATE Table1 SET info = ? WHERE id = ?");
    for (var i = 1; i < 101; i++) {
        stmt2.run("Ipsum " + (i+1), i);
    }
    stmt2.finalize();
    db.run("COMMIT TRANSACTION");
    console.log("2--------------------");

    db.each("SELECT id, info FROM Table1", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
    console.log("3--------------------");

});*/


const beginTra = () => {
    return new Promise((resolve, reject)=>{
        try {
            var sql = "BEGIN TRANSACTION";
            db.run(sql, function(err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(`BEGIN TRANSACTION`); 
                }                
            });        
        } catch (error) {
            reject(error);  
        }   
    })
}

const createTbl = () => {
    return new Promise((resolve, reject)=>{
        try {
            // db.run("BEGIN TRANSACTION");
            var sql = "CREATE TABLE Table1 (id INT, info TEXT)";
            db.run(sql, function(err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(`1------------------------`); 
                }                
            });
            // db.run("COMMIT TRANSACTION");         
        } catch (error) {
            reject(error);  
        }   
    })
}

const selectRows = () => {
    return new Promise((resolve, reject)=>{
        // db.run("BEGIN TRANSACTION");
        var sql = "SELECT id, info FROM Table1";
        db.all(sql, function(err, rows) {
            if (err) {
                console.log('Error running sql ' + sql)
                console.log(err)
                reject(err)
            } else {                
                console.log("rows.length: " + rows.length);
                rows.forEach((row,index) => {
                    console.log(row.id + ": " + row.info);
                    if(index === 99) {
                        resolve(`select all------------------------`); 
                    }
                });
            }                
        });        
        // db.run("COMMIT TRANSACTION");
    })
  }

const insertRows = () => {
    return new Promise((resolve, reject)=>{
        try {
            // db.run("BEGIN TRANSACTION");
            var stmt1 = db.prepare("INSERT INTO Table1 VALUES(?, ?)");
            for (let i = 1; i < 101; i++) {
                stmt1.run([i, "Ipsum " + i],err => {
                    if(err) {
                        throw err;
                    }
                    if(i===100){
                        stmt1.finalize();
                        resolve(`2------------------------`); 
                    }
                });
            }
            // db.run("COMMIT TRANSACTION");     
        } catch (error) {
            reject(error);  
        } 
    })
}


const updateRows = () => {
    return new Promise((resolve, reject)=>{
        try {
            // db.run("BEGIN TRANSACTION");
            var stmt2 = db.prepare("UPDATE Table1 SET info = ? WHERE id = ?");
            for (let i = 1; i < 101; i++) {
                stmt2.run(["Ipsum " + (i+1), i], err => {
                    if(err) {
                        throw err;
                    }
                    if(i===100){
                        stmt2.finalize();
                        resolve(`3------------------------`);   
                    }

                });
            }
            // db.run("COMMIT TRANSACTION");   
        } catch (error) {
            reject(error);  
        } 
    })
}


function fn_createTbl() {
    return ()=> {
      return createTbl();
    }
}

function fn_selectRows() {
    return ()=> {
      return selectRows();
    }
}

function fn_insertRows() {
    return ()=> {
      return insertRows();
    }
}

function fn_updateRows() {
    return ()=> {
      return updateRows();
    }
}

function fn_dbrun () {
    /*db.run("CREATE TABLE foo (id INT)", function(e){
        if(e !== null){
        throw e;
       }
        //循环生成sql语句，批次插入多条数据
        var sql = "";
        for(var i = 0 ; i < 500; i ++){
        sql += 'INSERT INTO foo VALUES(' + i + ');'
       }
        database.exec(sql, done)
       });*/
    try {        
        (async ()=>{
            
            db.run("BEGIN TRANSACTION");
            arr = [fn_createTbl(), fn_insertRows(), fn_selectRows(), fn_updateRows(), fn_selectRows()]
            for (var i=0; i < arr.length; i++) {
                result = await arr[i]();
                console.log(result);
            }
            
            db.run("COMMIT TRANSACTION"); 
        })();
    } catch (error) {
        console.log(error);
    }
    
    db.close();
}

module.exports = fn_dbrun