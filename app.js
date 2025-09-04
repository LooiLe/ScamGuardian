const express = require("express");
const db = require("./controller");

const app = express();
app.use(express.json());

//For checking if given link is a threat, or just unverified by devs
app.post('/user_check', db.user_check);

// update pending when user submit request for reporting
app.post('/user_report', db.user_report);

// once admin approve, delete from pending and add to malicious
app.post('/dev_verify', db.dev_verify);

// returns pending verification
app.get('/dev_pending', );

app.listen(8080, "127.0.0.1");
