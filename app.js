const { response, json } = require('express')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const https = require('https')
const fs = require('fs')
const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

var query;
const apiKey = '63a5ecdb759a5f22f67decb809b9f1d6'
let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey

app.get('/response', (req, res) => {
    url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey
    https.get(url, (response) => {
        response.on('data', (data) => {
            const weatherData = JSON.parse(data)
            console.log(weatherData)
            const imageURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"
            fs.writeFile(path.join(__dirname+'/response.html'),
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${query}</title>
                <link rel="stylesheet" href="css/styles.css" type="text/css">
            </head>
            <body>
                <div class="formResult">
                    <h1 class="headingResult">It is currently ${(weatherData.main.temp - 273.16).toPrecision(3)} degree Celsius in ${query} .</h1> 
                    <img src=${imageURL}>
                </div>
            </body>
            </html>
            ` ,(err)=>{
                if(err) console.log(err)
            })
            setTimeout(() => {
                res.sendFile(path.join(__dirname + '/response.html'))
            }, 200);
        })
    })
})

app.post('/', (req, res) => {
    query = req.body.cityName
    res.redirect('/response');
})

app.listen(3500, () => {
    console.log('Server live on port 3500.')
})
