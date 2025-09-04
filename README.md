# ScamGuardian

### Requirments
* node.js ([Download](https://nodejs.org/en/download/))
* Firebase admin service account key (Settings -> Users & Permissions -> Service accounts)
* ```npm install express```


### Firebase Setup
1. Use firestore database 
2. Create 2 collections (DBs); `pending` (active reports), `malicious` (verified links)
3. For fields, `pending`:
    * _id (Document id)
    * name (link)
    * type
    * description

    For `malicious`:
    * _id
    * name 
    * type
    * description
    * threat


### Usage
```
node app.js
```


### Functions
For users,

* Check, against `malicious`, if link is malicious
* Submit a report not currently in `pending`

For devs,

* Verify report, then adds to `malicious`, delets from `pending`
* List all `pending` reports
