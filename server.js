const pug = require('pug');
const express = require('express');
const https = require('https');
const app = express();
const fs = require('fs');

const {Telegram, Keyboard, MessageContext, WebAppDataContext} = require('puregram');
const telegram = Telegram.fromToken(process.env.TELEGRAM_BOT_TOKEN);
const bodyParser = require('body-parser');
const isProduction = process.env.NODE_ENV === 'production';
let options = {}
if (!isProduction){
    const key = fs.readFileSync('./cert/selfsigned.key');
    const cert = fs.readFileSync('./cert/selfsigned.crt');
    options = {
        key: key,
        cert: cert
    };
}

let port = process.env.PORT || 8080

app.use(express.static('js'));
app.use(bodyParser.json());

app.get('/menu', function (req, res) {
    console.log("menu");
    console.log(req)

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(pug.renderFile('button_template.pug'));
    res.end();
});

app.post(
    '/save',
    async function (req, res) {
        return telegram.api.answerWebAppQuery({
            web_app_query_id: req.body.query_id,
            result: {
                type: "article",
                id: Math.random().toString(36),
                title: "Всё получилось",
                input_message_content: {
                    message_text: "Правда-правда получилось"
                }
            }
        })
    });

let server = https.createServer(options, app);

server.listen(port, () => {
    console.log("server starting on port : " + port)
});