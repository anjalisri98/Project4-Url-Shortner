const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*----------------------------------------------------------------------
🗃️ connect mongo db
----------------------------------------------------------------------*/
mongoose.connect("mongodb+srv://AnjaliSrivastava:e5YgmiAmxGsiLRwp@cluster0.i6luj.mongodb.net/group26Database?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then((result) => console.log("MongoDb is connected"))
    .catch((err) => console.log(err))


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});