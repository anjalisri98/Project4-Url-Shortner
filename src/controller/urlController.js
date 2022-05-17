const urlModel = require("../model/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
// const base = process.env.PORT
const baseUrl = 'http://localhost:3000'


<<<<<<< HEAD
 const createUrl = async function (req, res) {
     try {
         const orgUrl = req.body.longUrl
         if (!validUrl.isUri(orgUrl)) {
           res.status(400).send({
                 status: false,
                 message: " Please provide valid url"
=======
const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl
        if (!validUrl.isUri(longUrl)) {
            res.status(400).send({
                status: false,
                message: " Please provide valid url"
>>>>>>> 6d9b2d2797d61c9c84e9b27c5c576dbc441c3e28
            })
         }

<<<<<<< HEAD
         const checkUrl = await urlModel.findOne({ longUrl: orgUrl })

         if (!checkUrl) {
             res.status(400).send({
                 status: false,
                 message: "The url povided is not exist, please prove another url"
            })
         }

         const urlCode = shortId.generate();

         const shortUrl = `${base}/${urlId}`;
         const url = new Url({
             longUrl,
            shortUrl,
           urlCode,
        });

         await url.save();
         res.status(201).send({
            status: true,
             message: "Url is shortened",
             data: url
=======
        // const checkUrl = await urlModel.findOne({ longUrl: orgUrl })

        // if (!checkUrl) {
        //     res.status(400).send({
        //         status: false,
        //         message: "The url povided is not exist, please prove another url"
        //     })
        // }

        const urlCode = shortId.generate();
        const shortUrl = baseUrl + '/' + urlCode


        // const shortUrl = `${base}+'/'+${urlCode}`;
        // const url = new Url({
        //     longUrl,
        //     shortUrl,
        //     urlCode,
        // });
        
        const Data = { longUrl, shortUrl, urlCode: urlCode }

        const urlCreated = await urlModel.create(Data)
        // await url.save();
        res.status(201).send({
            status: true,
            message: "Url is shortened",
            data: urlCreated
>>>>>>> 6d9b2d2797d61c9c84e9b27c5c576dbc441c3e28
        })



    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })

    }
 }

<<<<<<< HEAD

 module.exports.createUrl = createUrl


 const getUrl = async (req , res) =>{
    try{
        let urlCode = req.params.urlCode

     }
    catch(error){

     }
 }
=======
module.exports ={createUrl}
>>>>>>> 6d9b2d2797d61c9c84e9b27c5c576dbc441c3e28
