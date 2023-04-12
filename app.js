const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
const mongoose = require("mongoose");
const _ = require('lodash');
// console.log(date.getday());




const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"))

let port = process.env.PORT;

if(port == null || port == ""){
    port = 3000;
}


app.listen(port,function() {
    console.log("server started at port 3000");
    console.log("mongodb+srv://"+process.env.dbUser+":"+process.env.pass+"@cluster0.z04gxte.mongodb.net/todolistDB")
    
});



const url = process.env.MONGO_URL;
mongoose.connect(url);




const itemSchema = new mongoose.Schema({name: String});
const Item = mongoose.model(
   "Item",itemSchema 
);


const item1 = new Item({name: "welcome to your todo list!"});
const item2 = new Item({name: "hit + to add a new item"});
const item3 = new Item({name: "hit this to delete an item"});
const defaultItems = [item1,item2,item3];





const listSchema = new mongoose.Schema({name: String, items: [itemSchema]});
const Lists = mongoose.model(
    "List", listSchema
);








app.use( function(req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
  
   next();
    
  });



app.get("/",function(req,res){

    Item.find({}).then(function(foundItems,err){
        
        if(foundItems.length === 0){
            Item.insertMany(defaultItems).then(function(err){
                
                    console.log("succesfully saved default items to DB.");
                
            });
            res.redirect("/");
        }
        else{
           let day = date.getdate();
           res.render("list", {listTitle: "today", task1: foundItems});
        }
    });
    
    // //res.render("list", {kindOfDay:day});
    // res.render("list", {listItem: day,task1: tasks})
    
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    Lists.findOne({name: customListName}).then(function(foundItems){
        if(foundItems == null){
            console.log("this item list doesnt exist");
            const newList = new Lists({name: customListName, items: defaultItems});
            newList.save();
            res.redirect("/"+customListName);
        }
        else{
            console.log("this list exists already");
            res.render("list", {listTitle: foundItems.name, task1: foundItems.items})
        }
    });
    
});

app.post("/", function(req,res){
    const added  =  req.body.newitem ;
    const listName = req.body.listName;
        //workitems.push(req.body.newitem);
        // Item.insertOne({name: req.body.newitem}).then(function(){
        // console.log("succesfully added new item to the list");
        // });
        
        

    const addedItem = new Item({ name: added });

    if(listName === "today"){
        
        addedItem.save();
        res.redirect("/");
    }else{

        Lists.findOne({name: listName}).then(function(foundList){
            // console.log(foundList);
            foundList.items.push(addedItem);
            foundList.save();
            res.redirect("/"+listName);
        });
    };

    

    
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName == "today") {
      Item.findByIdAndRemove(checkedItemId).then(function(){
        
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        
      });
    } else {
      Lists.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function(err, foundList){
        
          res.redirect("/" + listName);
        
      });
    }
  
  
  });




app.get("/about" , function(req,res){
    res.render("about")
});






app.post("/:customListName", function(req,res){
    const newItem = req.body.newItem;
    const addedItem = new Item({name: newItem});
    const listUpdate = new Lists({})
});

    
    
    // console.log(newList);
    // console.log(customListName);
    

//"mongodb://127.0.0.1:27017/persons"