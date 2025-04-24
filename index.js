const express = require('express');
const http = require('http');
const ws = require('ws');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/logs', (req, res) => {
    res.sendFile(__dirname + '/public/logs_table.html');
});

app.post('/logs', (req, res) => {
    //サイトを作成する際にpostリクエストをfetchで投げて、それをここで受け取り、返すための処理
    const results = [];
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const isNewFile = !fs.existsSync(`./public/logs/${date}.csv`);
    if(isNewFile){
        res.send(results);
        return;
    }
    fs.createReadStream(`./public/logs/${date}.csv`)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            res.send(results);
        });
});

app.post('/append-file', (req, res) => {
    const content = req.body;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const isNewFile = !fs.existsSync(`./public/logs/${date}.csv`);
    const isFolderExist = fs.existsSync('./public/logs');
    if(!isFolderExist){
        fs.mkdirSync('./public/logs');
    }

    if(isNewFile){
        fs.appendFile(`./public/logs/${date}.csv`, `学校所在地,学校区分,その他\n${content.prefecture},${content.classification},${content.university}\n`, 'utf8', (err) => {
            if(err) {
                console.log(err);
                res.status(500).send('Error');
                return;
            }else{
                wss.clients.forEach((client) => {
                    client.send('Update');
                });
                res.send('Saved');
            }
        });
    }else{
        fs.appendFile(`./public/logs/${date}.csv`, `${content.prefecture},${content.classification},${content.university}\n`, 'utf8' ,(err) => {
            if(err) {
                console.log(err);
                res.status(500).send('Error');
                return;
            } else {
                wss.clients.forEach((client) => {
                    client.send('Update');
                });
                res.send('Saved');
            }
        });
    }
});

wss.on('connection', (ws) => {
    console.log('Connected');

    ws.on('close', () => {
        console.log('Disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});