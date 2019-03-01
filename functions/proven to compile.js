compiled succesfully with 
help/modification from Tyler:

const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/items');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});




exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }

    // [
    //     {
    //         "items":"item1"
    //     }]

    console.log(req.body)
  
    const item = req.body[0]

    database.push(req.body);

    

    let items = [];

    return database.on('value', (snapshot) => {
      snapshot.forEach((item) => {
        items.push({
          id: item.key,
          items: item.val().item,
          
          
        });
      });
      
      res.status(200).json(items)
    }, (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })
  })
})











Second Section, this is the refactored code, with the put
and the get sections modified as per Tyler's 
assistance: it will post, but not get:

const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const database = admin.database().ref('/items');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});

const getItemsFromDatabase = (res) => {
    let items = [];

    return database.on('value', (snapshot) => {
        snapshot.forEach((item) =>{
            items.push({
                id: item.key,
                item: item.val().item
            });
        });
        res.status(200).json(items);
    }, (error) => {
        res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        })
    })
    };



exports.addItem = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    };
    // [
    //     {
    //         "items":"item1"
    //     }]

    const item = req.body[0]

    database.push(req.body);


    // const item = req.body.item;
    // database.push({ item });
    getItemsFromDatabase(res)
});
});

exports.getItems = functions.https.onRequest((req, res) =>{
    return cors(req, res, () =>{
        if(req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
    })
})
    