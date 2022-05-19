const urlModel = require("../model/urlModel")
const shortId = require("shortid")
const validUrl = require("valid-url")
// const base = process.env.PORT

const redis = require("redis");

const { promisify } = require("util");

// Connect to redis
const redisClient = redis.createClient(
    13613,
    "redis-13613.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("tkxuRsvItmWDXmxktzlBZsXHM9n4CRLI", function (err) {
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

const isValidRequest = function (reqBody) {
    return Object.keys(reqBody).length > 0;
}
const isValidValue = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if( typeof value === 'number' && value.toString().trim().length === 0) return false;
    return true;
}

const isValidUrl = function (url) {
    const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
    return urlRegex.test(url)
}

const shortenUrl = async (req, res) => {
    try {
        let longUrl = req.body.longUrl
     //input validation
        if (!isValidRequest(req.body)) return res.status(400).send({ status: false, message: "No input by user" })

        if (!isValidValue(longUrl)) return res.status(400).send({ status: false, message: "longUrl is required." })


    //validation for Long Url
        if (!validUrl.isUri(longUrl)) return res.status(400).send({ status: false, message: "Long Url is invalid." })
        if (!isValidUrl(longUrl)) return res.status(400).send({ status: false, message: "Long Url is invalid reg." })

        let baseUrl = "http://localhost:3000"
    // validation for base Url
        if (!validUrl.isUri(baseUrl)) return res.status(400).send({ status: false, message: `${baseUrl} is invalid base Url` })

     //if the Long url is already exist
        const alreadyExistUrl = await urlModel.findOne({ longUrl })
        if (alreadyExistUrl) {
            res.status(200).send({ status:true, "message": "Shorten link already generated previously", data: alreadyExistUrl })
        } else {

            let shortUrlCode = shortId.generate()

            if(validUrl.isUri(longUrl)){
                const urldata = await GET_ASYNC(`${longUrl}`)
                const urlRes = JSON.parse(urldata)
                if(urldata) return res.status(200).send({status:true , message: `data for  ${longUrl}from the cache`, data :urlRes})
            } else{
                const url = await urlModel.findOne({longUrl:longUrl}).select({id:0, longUrl:1, shortUrl:1,urlCode:1})
                if (url) {
                    await SET_ASYNC(`${longUrl}`, JSON.stringify(url))
                    
                    return res.status(200).send({ status: true, msg: "fetch from db", data: url })
                }
            }
            
        //if the Urlcode is already exist
            const alreadyExistCode = await urlModel.findOne({ urlCode: shortUrlCode })
            if (alreadyExistCode) return res.status(400).send({ status: false, message: `${alreadyExistCode} is already exist` })

            let shortUrl = baseUrl + '/' + shortUrlCode

            const alreadyShortUrl = await urlModel.findOne({ shortUrl })
            if (alreadyShortUrl) return res.status(400).send({ status: false, message: `${alreadyShortUrl} is already exist` })

            const generateUrl = {
                longUrl: longUrl,
                shortUrl: shortUrl,
                urlCode: shortUrlCode
            }

            await urlModel.create(generateUrl)
            return res.status(201).send({ status: true, message: "Short url Successfully created", data: generateUrl })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUrl = async (req, res) => {
    try {
        let urlCode = req.params.urlCode
        
        let cacheProfileData = await GET_ASYNC(`${urlCode}`)

        console.log(cacheProfileData)

        if (cacheProfileData) {
            let response = JSON.parse(cacheProfileData)
            return res.redirect(302, `${response.longUrl}`)
        } else {
            let urlData = await urlModel.findOne({ urlCode: req.params.urlCode })
            console.log(urlData)
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(urlData))
            return res.redirect(302, urlData.longUrl)


        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { shortenUrl, getUrl } 