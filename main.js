var http = require("http");
var fileReader = require("fs");
var express = require("express");
const path = require('path');

var app = express();
app.set("view engine","ejs");

var fullFileText = "";
var cfgStrings = fullFileText.split("\r\n");
var isBinary = 0;
var portNumber = 80;
var serverIP = "";
var date;
var img;

app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));

app.get('/', function(request,response)
{
  date = new Date();
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+request);
  response.redirect("/play");
});

app.get("/about", function(request,response)
{
  date = new Date();
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+"/about");
  fileReader.access("abouts.json", fileReader.constants.R_OK, function(err)
  {
    if(err)
    {
      console.log("Error: could not open abouts.json");
    }
    else
    {
      fileReader.readFile("abouts.json", "UTF8", function(error,data)
      {
        var aboutsObject = JSON.parse(data);
        response.render("about",aboutsObject);
      });
    }
  });
});

app.get("/play", function(request,response)
{
  date = new Date();
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+request);
  response.render("play");
});

app.get("/result=:timeRes", function(request,response)
{
  date = new Date();
  console.log("request | "+currentTime+" | "+request.params.timeRes);
  var currentTime = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  var jsonRec = {};
  jsonRec["date"]=date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear();
  jsonRec["time"]=currentTime;
  jsonRec["result"]=request.params.timeRes;
  fileReader.access("records.json", fileReader.constants.R_OK, function(err)
  {
    if(err)
    {
      console.log("Error: could not open records.txt");
    }
    else
    {
      fileReader.readFile("records.json", "UTF8", function(error,data)
      {
        var jsonRecords = JSON.parse(data);
        jsonRecords.records.push(jsonRec);
        fileReader.writeFile("records.json",JSON.stringify(jsonRecords, null, 2),function(error,data)
        {
          if(error)
            console.log("Error: could not open records.json");
        });
      });
    }
  });

  response.redirect('/');
});

app.get("/records", function(request,response)
{
  date = new Date();
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | /records");
  //var recordsObject = {};
  fileReader.access("records.json", fileReader.constants.R_OK, function(err)
  {
    if(err)
    {
      console.log("Error: could not open records.txt");
    }
    else
    {
      fileReader.readFile("records.json", "UTF8", function(error,data)
      {
        var recordsObject = JSON.parse(data);
        for(var i=0;i<recordsObject.records.length;i++)
        {
          for(var j=1;j<recordsObject.records.length-i;j++)
          {
            var result1 = parseInt(recordsObject.records[j-1].result.replace(/-/g,''),10);
            var result2 = parseInt(recordsObject.records[j].result.replace(/-/g,''),10);
            if(result1>result2)
            {
              //console.log(mas[j-1]+"<"+mas[j]);
              [recordsObject.records[j-1], recordsObject.records[j]] = [recordsObject.records[j], recordsObject.records[j-1]];
              // var buffer = mas[j-1];
              // mas[j-1]=mas[j];
              // mas[j]=buffer;
            }
            // else
            //   console.log(mas[j-1]+">="+mas[j]);

          }
          //console.log(mas);
        }
        response.render("records",recordsObject);
      });
    }
  });
});

app.get("/:fileName", function(request,response)
{
  date = new Date();
  var fName = __dirname+'/'+request.params.fileName;
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+request.params.fileName);
  fileReader.access(fName, fileReader.constants.R_OK, function(err)
  {
    if(err)
      response.status(404).render("404");
    else
      response.sendFile(fName);
  });
});

app.get("/public/css/:fileName", function(request,response)
{
  date = new Date();
  var fName = request.params.fileName;
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+fName);
  response.sendFile(__dirname+"/public/css/"+fName);
});

app.get("/public/js/:fileName", function(request,response)
{
  date = new Date();
  var fName = request.params.fileName;
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+fName);
  response.sendFile(__dirname+"/public/js/"+fName);
});

app.get("/public/pixmaps/:fileName", function(request,response)
{
  date = new Date();
  var fName = request.params.fileName;
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | "+fName);
  response.sendFile(__dirname+"/public/pixmaps/"+fName);
});

app.get('*', function(request, response)
{
  date = new Date();
  console.log("request | "+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+" | 404");
  response.status(404).render("404");
});

app.listen(portNumber);
console.log("Listening to port "+portNumber);
