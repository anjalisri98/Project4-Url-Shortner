const urlModel = require("../model/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
// const base = process.env.PORT
const baseUrl = 'http://localhost:3000'


const createUrl = async function (req, res) {
    try {
        const longUrl = req.body.longUrl
        if (!validUrl.isUri(longUrl)) {
            res.status(400).send({
                status: false,
                message: " Please provide valid url"
            })
        }

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
        })



    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })

    }
}

module.exports ={createUrl}
