const express = require("express");
const app = express();
const db = require('./firebase');

app.use(express.json());

//For checking if given link is a threat, or just unverified by devs
app.post('/user_check', async (req, res) => {
    try {
        const { name } = req.body;
        const found = await db.collection("malicious").where("name", "==", name).get();
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

// update pending when user submit request for reporting
app.post('/user_report', async (req, res) => {
    try {
        const { name, type, description } = req.body;
        const check_mali = await db.collection('malicious').where("name", "==", name).get();
        const check_pending = await db.collection('pending').where("name", "==", name).get();
        if (!check_mali.empty || !check_pending.empty) {
            res.status(201).send({ message: 'Already added!' });
        }
        const docRef = await db.collection('pending').add({ name, type, description});
        res.status(201).send({ message: 'Pending added!', id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// once admin approve, delete from pending and add to malicious
app.post('/dev_verify', async (req, res) => {
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

// returns pending verification
app.get('/dev_pending', async (req, res) => {
    try {
        const receive = await db.collection('pending').get();
        const pending = receive.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(201).json({ data: pending });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8080, "127.0.0.1");
