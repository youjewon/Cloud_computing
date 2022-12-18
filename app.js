const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

//DB 연결 및 확인
const db = mysql.createConnection({
    host : 'database-1.ctepkhj4f79e.ap-northeast-2.rds.amazonaws.com',
    prot : '3306',
    user : 'poem',
    password : '1q2w3e4r',
    database : 'board'
})
db.connect(function(err){
    if(err) console.log(err);
    console.log('Database is connecting...');
})

app.set("view engine","ejs");
app.use(express.static(__dirname+'/'));
app.use(express.urlencoded({ extended: false }));

//메인페이지
app.get("/main",function(req,res){
    const query = "SELECT * FROM poem";
    db.query(query,function(err,results){
        if(err) res.render(err);
        else{
            res.render("main",{ data : results });
        }
    }) 
    //console.log("페이지 실행"); 
});

//글 수정삭제 페이지
app.get("/edit/:id", (req, res) => {
    const ID = req.params.id;
    const query = "SELECT * FROM poem where id = ?";
    db.query(query, ID, (err, result) => {
      if (err) {
        res.send(err);
      } else if (result == "") {
        res.send("찾으시는 페이지가 존재하지않습니다.");
      } else res.render("Edit", { id: ID, Data: result[0] });
    });
});

//글 생성페이지
app.get("/create",function(req,res){
    res.render("Create");
});

//글 수정페이지 반환
app.post("/edit", (req, res) => {
    const Title = req.body.Title;
    const Contents = req.body.Contents;
    const ID = req.body.id;
    const query = `update poem set title =?,Contents = ?,Date=DATE_FORMAT(now(), '%Y-%m-%d')where id = ?`;
    db.query(query, [Title, Contents,ID], (err, result) => {
      err ? console.log(err) : res.redirect("/main");
    });
});

//글 삭제페이지 반환
app.post("/delete", (req, res) => {
    const Title = req.body.Title;
    const query = `delete from poem where title = ?`;
    db.query(query, [Title], (err, result) => {
      err ? console.log(err) : res.redirect("/main");
    });
});

//글 생성페이지 반환
app.post("/create", (req, res) => {
    const Title = req.body.Title;
    const Contents = req.body.Contents;
    const ID = req.body.id;
    const query = `
    insert into poem(title ,Contents, Date, id)
    values(?,?,DATE_FORMAT(now(), '%Y-%m-%d'),?)`;
    db.query(query, [Title, Contents,ID], (err, result) => {
      err ? res.send(err) : res.redirect("/main");
    });
});

//서버 가동
app.listen(3000,function(){
    console.log("실행중....");
})
