import express from "express";
import bodyParser from "body-parser";
import moment from "moment";

const app = express();
const port = 3000;
let todayTaskList = ["task 1", "task 2", "task 3"];
let workList = ["work 1", "work 2", "work 3"];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//today's task
app.get("/", (req, res) => {
  let today = moment().format("MMMM Do YYYY");
  res.render("index.ejs", {
    today: today,
    todayTaskList: todayTaskList,
    hrefLink: "/",
  });
});

app.post("/add", (req, res) => {
  //   console.log(req.body);
  let task = req.body["task"];
  todayTaskList.push(task);
  res.redirect("/");
});

//work list relate to today's task
app.get("/work", (req, res) => {
  res.render("work.ejs", {
    workList: workList,
    hrefLink: "/work",
  });
});

app.post("/work/add", (req, res) => {
  //   console.log(req.body);
  let task = req.body["task"];
  workList.push(task);
  res.redirect("/work");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
