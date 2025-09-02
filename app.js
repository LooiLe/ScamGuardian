const express = require("express");
const app = express();
const db = require('./firebase');

app.use(express.json());

app.get("/test", (req, res) => {
    const status = {
        "Status": "Running"
    };
    res.send(status);
});

app.post('/check', async (req, res) => {
    try {
        const { name, type, description, threat } = req.body;
        const docRef = await db.collection('malicious').add({ name, type, description, threat });
        res.status(201).send({ message: 'Source added!', id: docRef.id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/check', async (req, res) => {
    try {
        const snapshot = await db.collection('malicious').get();
        const malicious = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(malicious);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/confirmMalicious', async (req, res) => {
    try {
        const { id, threat } = req.body;
        const doc = (await db.collection('pending').doc(id).get());
        const data = doc.data();
        await db.collection('malicious').add({ ...data, threat});
        await db.collection('pending').doc(id).delete();
        res.status(201).send({ message:"Success!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/pending', async (req, res) => {
    try {
        const { name, type, description } = req.body;
        const docRef = await db.collection('pending').add({ name, type, description});
        res.status(201).send({ message: 'pending added!', id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

app.post('/check', async (req, res) => { //For checking if given link is a threat, or just unverified by devs
    try {
        const { link } = req.body;
        const found = await db.collection("malicious").where("description", "==", link).get();
        const snapshot = found.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        if (found.empty) {
            res.status(201).send({ message: "Unverified link" });
        }
        res.status(201).send({ Threat: snapshot[0].threat }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(8080, "127.0.0.1");
console.log("Test thing is running @ 127.0.0.1:8080");
