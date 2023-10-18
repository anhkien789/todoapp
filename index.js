import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import moment from "moment";
import _ from "lodash";
import dotenv from "dotenv";

//Using Environmental Variables
dotenv.config();

const app = express();
const port = process.env.PORT;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connect to mongodb
mongoose.connect(process.env.MONGODB_URL);

//Schema
const itemsSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

//Model
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

//Document
const item1 = new Item({
  name: "Welcome to ToDoList!",
});
const item2 = new Item({
  name: "Hit the + button to add new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete the item",
});

const defaultItem = [item1, item2, item3];

//today's task
app.get("/", (req, res) => {
  Item.find({})
    .then((data) => {
      if (data.length === 0) {
        Item.insertMany(defaultItem)
          .then(() => console.log("Successfully saved items to todolistDB"))
          .catch((err) => console.log(err));
        res.redirect("/");
      } else {
        let today = moment().format("MMMM Do YYYY");
        res.render("index.ejs", {
          listTitle: today,
          todayTaskList: data,
          hrefLink: "/",
        });
      }
    })
    .catch((err) => console.log(err));
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((data) => {
      if (data) {
        res.render("list.ejs", {
          listTitle: customListName,
          newListItems: data.items,
          hrefLink: "/" + customListName,
        });
      } else {
        const list = new List({
          name: customListName,
          items: defaultItem,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    })
    .catch((err) => console.log(err));
});

app.post("/", (req, res) => {
  const task = req.body["task"];
  const listName = req.body["list"];
  console.log("task", task);
  console.log("listName", listName);

  const newItem = new Item({
    name: task,
  });

  let today = moment().format("MMMM Do YYYY");

  if (listName === today) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((data) => {
        data.items.push(newItem);
        data.save();
        res.redirect("/" + listName);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/add", (req, res) => {
  const task = req.body["task"];

  const newItem = new Item({
    name: task,
  });
  newItem.save();

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove({ _id: checkedItemId })
      .then(() => {
        console.log("Successfully deleted!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then(() => {
        console.log("Successfully deleted!");
        res.redirect("/" + listName);
      })
      .catch((err) => console.log(err));
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
