
const express=require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");

const app= express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs");

// let userList=["wakeup at 8","make food"];
// let workList=[];

const URI="mongodb+srv://adhithya:user1205@cluster0.rowlkxg.mongodb.net/todolistDB";

mongoose.connect(URI, { 
        useNewUrlParser: true
        
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"welcome to your todolist"
})

const item2=new Item({
    name:"press the + button to add an item"
})
const item3=new Item({
    name:"tick the checkbox to remove an item"
})

const defaultItems=[item1,item2,item3];

const listSchema={
    name: String,
    items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

// Item.insertMany(defaultItems).then(function () {
//       console.log("Successfully saved defult items to DB");
//     }).catch(function (err) {
//       console.log(err);
//     });
    
  
app.get("/",function(req,res){

      let today=new Date()
    options={
        weekday:"long", day:'numeric', month:'long',year:'numeric'
    }
    let day=today.toLocaleDateString("en-US",options)

    Item.find({}).then(function(itemss){
        if(itemss.length === 0){
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully saved defult items to DB");
              }).catch(function (err) {
                console.log(err);
              });
              res.redirect("/")
        }else{
            res.render("lists", {header:"today", newList:itemss})
        }
            
        })
    })


    app.get("/:customList",function(req,res){
        var customList = _.capitalize(req.params.customList);
       
        
        List.findOne({name:customList}).then(function(foundItem){
            if(!foundItem){
                console.log("item does not exist")
                const list1=new List({
                    name:customList,
                    items:defaultItems
                })
                list1.save();
                res.redirect("/"+customList);
            }else{
                console.log("foundItem");
                res.render("lists", {header:customList, newList:foundItem.items})
            }
        })
    })

  
   app.post("/",function(req,res){
   const itemName=req.body.userlist;
   const randomList=req.body.randomList;

   const item=new Item({
    name:itemName
});

    if (randomList=="today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:randomList}).then(function(foundlist){
            foundlist.items.push(item)
            foundlist.save()
            res.redirect("/"+randomList)
        })
    }
})


app.post("/delete",function(req,res){
    const checkedId=req.body.checkBox;
    const listName=req.body.listName;
    if(listName==="today"){
        Item.findByIdAndRemove(checkedId).then(function () {
            console.log("Successfully deleted  item");
          }).catch(function (err) {
            console.log(err);
          });
          res.redirect("/")
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedId}}}).then(function () {
            
            res.redirect("/"+listName)
          }).catch(function (err) {
            console.log(err);
          });
          
        
    }

    
})

app.listen(3000,function(req,res){
    console.log("app started at port 3000 haha")
})

//<..........previous post route..........>

// app.post("/", function(req,res){

//     if(req.body.button==="worklist"){
//         workList.push(req.body.userlist)
//         res.redirect("/work")
//     }else{
//         userList.push(req.body.userlist);
//         res.redirect("/")
//     }

// })


// app.get("/work", function(req,res){
//     res.render('lists', {header:"worklist", newList:workList})
// })

// app.get("/about",function(req,res){
//     res.render("about")
// })






//<..........my take on post route..........>

// app.post("/",function(req,res){
//     const item4=new Item({
//         name:req.body.userlist
//     });
//     defaultItems.push(item4);
//     Item.insertMany(defaultItems[(defaultItems.length)-1]).then(function () {
//               console.log("Successfully saved defult item4 to DB");
//             }).catch(function (err) {
//               console.log(err);
//             });
//     res.redirect("/");
// })

//<..........my take on post route..........>