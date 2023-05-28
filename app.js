//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { listeners } = require("process");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://ameersultan777:Thani777@cluster0.bwerrdw.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemSchema = {
  name: String
};




const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
  name: "Welcome to Your todolist!"
})
const item2 = new Item({
  name: "Hit the + button to add a new item."
})
const item3 = new Item({
  name: "<--Hit this button to delete an item. "
})
const defaultItems = [item1, item2, item3]

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  Item.find({}).then((docs) => {
    if (docs.length === 0) {
      Item.insertMany(defaultItems)
      res.redirect("/")
    } else {
      res.render("list", { listTitle: "Today", newListItems: docs });
    }
  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list
  const item = new Item({
    name: itemName
  })
  if (listName === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({ name: listName }).then(docs => {
      docs.items.push(item);
      docs.save()
      res.redirect("/" + listName)
    })
  }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId).then(
      res.redirect("/")
    )
  }
  else{
    List.findOneAndUpdate({name:listName}, {$pull : {items: {_id : checkedItemId}}}).then(docs=>{
    })
    res.redirect("/" + listName)
  }
})

app.get("/:customListName", function (req, res) {
  const ListName = req.params.customListName
  List.findOne({ name: ListName }).then(docs => {
    if (!docs) {
      const list = new List({
        name: ListName,
        items: defaultItems
      });
      list.save()
      res.redirect("/" + ListName)
    }
    else {
      res.render("list", { listTitle: docs.name, newListItems: docs.items })
    }
  })





})



app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
