var express = require("express");
var path = require("path");
var fs = require("fs");
var util = require("util");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));



var returnedData;
fs.readFile("./db/db.json", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  returnedData = JSON.parse(data);
});


// HTML Routes
// GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
}); 

// GET `*` - Should return the `index.html` file
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html")); 
});


// API routes
// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
  return res.json(returnedData);
});

app.post("/api/notes", function(req, res) {
  let returnedDataLength = returnedData.length;
  var newID;
  if (returnedDataLength === 0) {
    newID = 1;
  }
  else {
    let lastID = parseInt(returnedData[parseInt(returnedData.length) - 1]["id"]);
    newID = lastID + 1;
    console.log(newID);
  }
  let newNote = req.body;
  newNote["id"] = newID;
  returnedData.push(newNote);
  stringifyNotesData = JSON.stringify(returnedData, null, 2);
  fs.writeFile(__dirname + "/db/db.json", stringifyNotesData, (err) => {
    if (err) throw err;
  });
  return res.json(newNote);
});

app.delete("/api/notes/:id", function(req,res) {
  let idDeleteNote = req.params.id;
  let filteredData = returnedData.filter(data => parseInt(data["id"]) !== parseInt(idDeleteNote));
  let noteToBeDeleted = returnedData.filter(data => parseInt(data["id"]) === parseInt(idDeleteNote))[0];
  returnedData = filteredData;

  fs.writeFile("./db/db.json", JSON.stringify(filteredData, null, 2), function (err) {
    if (err) throw err;
  });
  return res.json(noteToBeDeleted);
});


app.listen(PORT, function() {
  console.log("App listening on port" + PORT);
});