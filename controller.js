const db = require("./firebase");

async function user_check(req, res) { 
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
}

async function user_report(req, res) {
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
}

async function dev_verify(req, res) {
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
}

async function dev_pending(req, res) {
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
}

module.exports = {user_check, user_report, dev_verify, dev_pending};