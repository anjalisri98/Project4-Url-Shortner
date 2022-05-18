const urlModel = require("../model/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
// const base = process.env.PORT
const baseUrl = 'http://localhost:3000'

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  14951,
  "redis-14951.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("L5yqDhOI1FMd2je3LWxV4ESAua90Mw0U", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);





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

        await SET_ASYNC(`${urlCode}`, JSON.stringify(urlCreated))

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


const getUrl = async (req,res) =>{
    try{
let urlCode = req.params.urlCode
let cahcedUrlData = await GET_ASYNC(`${urlCode}`)

let data = JSON.parse(cahcedUrlData);


if (cahcedUrlData) {
    res.status(301).redirect(301, `${data.longUrl}`)
}
else{
let urlData  = await urlModel.findOne({urlCode:urlCode})

if (!urlData) {
    return res.status(400).send({ status: false, msg: "this short url does not exist please provide valid url code " })
}


await SET_ASYNC(`${urlCode}`, JSON.stringify(urlData))

return res.status(301).redirect(301,`${urlData.longUrl}`)
}

    }
    catch(error){
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.getUrl = getUrl