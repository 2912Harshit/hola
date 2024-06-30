const express = require("express");
const bodyParser = require("body-parser");
const fs=require("fs");
const json = require("body-parser/lib/types/json");
const { parse } = require("path");
const app = express();

app.use(bodyParser.json());
const filePath = "/Users/admin/Desktop/coding/javascript/todo/todos.json";
app.get("/todos",function(req,res){
  fs.readFile(filePath,"utf-8",function(err,data){
    if(err){
      res.send("no file found")
    }else{
      res.json(JSON.parse(data))
    }

  })
})
app.get("/todos/:id",function(req,res){
  fs.readFile(filePath,"utf-8",function(err,data){
    if(err){
      res.status(404).send("file not found")
    }else{
      let todos=JSON.parse(data);
      let todo=todos.find((t)=>{return t.id===parseInt(req.params.id)})
      if(!todo){
        res.status(404).send("todo not found")
      }else{
        res.json(todo)
      }
    }

  })

})
app.post("/todos",function(req,res){
  fs.readFile(filePath,"utf-8",function(err,data){
    if(err){
      res.status(404).send("file not found");
    }else{
      let todos=JSON.parse(data)
      let todo={
        "id":todos.length+1,
        "title":req.body.title,
        "completed":req.body.completed,
        "description":req.body.description
      }
      todos.push(todo)
      fs.writeFile(filePath,JSON.stringify(todos),function(err){
        if(err){
          res.status(500).send("Cannot write file")
        }else{
          res.json(todo)
        }
      })
    }
  })
})
app.post("/todos/:id",function(req,res){
  fs.readFile(filePath,"utf-8",function(err,data){
    if(err){
      res.send("file not found").status(404)
    }
    else{
      let todos=JSON.parse(data)
      let todo=todos.find(t=>t.id==parseInt(req.params.id))
      if(!todo){
        res.send("cannnot find todo").status(500)
      }else{
        todo.title=req.body.title
        todo.completed=req.body.completed
        todo.description=req.body.description
        fs.writeFile(filePath,JSON.stringify(todos),function(err){
          if(err){
            res.send("cannot write file").status(404)
          }else{
            res.send("file updated")
          }
        })
      }
    }
  })
})

app.delete("/todos/:id",function(req,res){
  fs.readFile(filePath,"utf-8",function(err,data){
    if(err){
      res.send("file not found").status(400)
    }else{
      let todos=JSON.parse(data)
      let todo=todos.find(t=>t.id===parseInt(req.params.id))
      if(!todo){
        res.send("todo not found").status(404)
      }else{
        let index=todos.indexOf(todo)
        todos.splice(index,1)
        fs.writeFile(filePath,JSON.stringify(todos),function(err){
          if(err){
            res.send("cannot write file").status(400)
          }else{
            res.send("todo deleted")
          }
        })
      }
    }
  })
})
app.listen(3000,()=>{
  console.log("server is running on 3000")
})