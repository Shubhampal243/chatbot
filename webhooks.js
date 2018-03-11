const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

const request = require('request');
const apiaiApp = require('apiai')("d818c40e1f9940bf9203a3a141d5eba7");



function sendMessage(event) {
  let sender = event.sender.id;
  let text = event.message.text;

  let apiai = apiaiApp.textRequest(text, {
    sessionId: 'tabby_cat' // use any arbitrary id
  });

  apiai.on('response', (response) => {
    // Got a response from api.ai. Let's POST to Facebook Messenger
    apiai.on('response', (response) => {
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: "EAAIFgdRCUzoBAC42imZBcobg4KHgDHYY7oOHWmexGEm0tOywZCqIQ6H9G8Drpu2EHjMcBLE3v8ZA5b23TI7EwZCUpqFsQUZAsmsqPtpS5VVVXFTawG8kKdyRNlybKK8hKsvlbFKD4CwnnrljV9aJWFVobWlVXZBxd65KOnG8pL3gZDZD"},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
 });

  });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}



