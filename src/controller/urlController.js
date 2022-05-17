const urlModel = require("../model/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
const base = process.env.PORT

 const createUrl = async function (req, res) {
     try {
         const orgUrl = req.body.longUrl
         if (!validUrl.isUri(orgUrl)) {
           res.status(400).send({
                 status: false,
                 message: " Please provide valid url"
            })
         }

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
        })



    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })

    }
 }


 module.exports.createUrl = createUrl


 const getUrl = async (req , res) =>{
    try{
        let urlCode = req.params.urlCode

     }
    catch(error){

     }
 }