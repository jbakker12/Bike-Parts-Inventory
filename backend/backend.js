// "StAuth10244: I Jacob Bakker certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."

import sqlite3 from 'sqlite3';
var db = new sqlite3.Database("a7.db")
import * as sqlite from 'sqlite';

/**
 * Initializing Table
 */
db.serialize(()=>{
    db.run('drop table if exists bikeparts');
    db.run(
        `CREATE TABLE IF NOT EXISTS bikeparts (
        id integer primary key autoincrement,
        make text not null,
        model text not null,
        type text not null,
        mrsp real not null
    )`
    )
    //CODE HERE FOR ANY TROUBLESHOOTING--------------------------
    // const stmt = db.prepare("INSERT into bikeparts(make,model,type,mrsp) values (?,?,?,?)");
    // const items = [
    //     ["Pinarello","Montello","Road Bike",1499.99]
    // ];

    // for(const item of items){
    //     stmt.run(item)
    // }
   
        
    // db.each("select * from bikeparts", (err,row)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log(`${row.id}, ${row.make}, ${row.model}, ${row.type}, ${row.mrsp}`);
    //     }
    // });
    // stmt.finalize();
},()=>{
    db.close();
});

import express  from 'express';
import cors from 'cors'

const app = express();
const port = 3001; //port 3001 as requested

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

//ROUTES----------------------------------------------------------------------
//GET /api
//returns JSON array of collection
app.get('/api', async(req,res)=>{
    try{
    const db2 = await sqlite.open({
        filename: 'a7.db',
        driver: sqlite3.Database
    })
    var result = await db2.all("select * from bikeparts");
    res.json(result);}
    catch(err){
        console.log("backend get error:" + err);
    }
});


//POST /api
//adds item to collection
app.post('/api', async(req, res)=>{
    try{
        const db2 = await sqlite.open({
        filename: 'a7.db',
        driver: sqlite3.Database
    })
    const { make, model, type, mrsp } = req.body
    const result = await db2.run("INSERT into bikeparts(make,model,type,mrsp) values (?,?,?,?)",make,model,type,mrsp);
    res.json(result);
    }
    catch (err){
        console.log(err);
    }
});

//DELETE /api
//deletes entire collection
app.delete('/api', async(req, res)=>{
    try{
        const db2 = await sqlite.open({
        filename: 'a7.db',
        driver: sqlite3.Database
    })
    var result = await db2.run("DELETE from bikeparts");
    res.json({ status: "DELETE SUCCESSFUL" });
    }
    catch (err){
        console.log(err);
    }
});

//---------------------------------------------------------------
//ITEMS
//GET /api/id
//gets a specific item by id
app.get('/api/id', async(req,res)=>{
try {
    const db2 = await sqlite.open({
      filename: 'a7.db',
      driver: sqlite3.Database
    });
    const id = req.query.id;
    const result = await db2.get("SELECT id,make,model,type,mrsp FROM bikeparts WHERE id = ?", id);
    res.json(result);
  } catch (err) {
    console.log("backend get error:" + err);
 
  }
});

//PUT /api/id
//edits a specific item by id
app.put('/api/id', async(req, res)=>{
    try{
        const db2 = await sqlite.open({
        filename: 'a7.db',
        driver: sqlite3.Database
    })
    const { id, make, model, type, mrsp } = req.body
    console.log("MRSP is:" + mrsp);
    const result = await db2.run(`UPDATE bikeparts 
             SET make = ?, model = ?, type = ?, mrsp = ?
             WHERE id = ?`,make,model,type,mrsp,id);
    res.json(result);
    }
    catch (err){
        console.log(err);
    }
});

//DELETE /api/id
//deletes a specific item by id
app.delete('/api/id', async(req, res)=>{
        try{
            const db2 = await sqlite.open({
            filename: 'a7.db',
            driver: sqlite3.Database
        })
        const {id} = req.body;
        var result = await db2.run("DELETE from bikeparts where id=?",id);
        res.json({ status: "DELETE SUCCESSFUL"});
        }
        catch (err){
            console.log("id is: "+ req.body.id)
            console.log(err);
        }
});


// ---------------------------------------------------------------
const server = app.listen(port, function(){
    console.log(`Backend running http://localhost:${port}`);
});