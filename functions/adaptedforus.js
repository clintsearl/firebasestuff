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
          recipe: item.val().item,
          ingredients: item.val().item,
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