const express = require("express")
const expressLayout = require("express-ejs-layouts")
const axios = require("axios")
const app = express()

app.use(expressLayout)
app.set("view engine","ejs")

app.get("/", async (req, res) => {
    const dat = await axios.get("https://covid19.mathdro.id/api/countries")


    const countryLength = dat.data.countries.length
    countryName = []
    for (i = 0; i < countryLength; i++) {
        countryName[i] = dat.data.countries[i].name
    }
    const total = await axios.get("https://covid19.mathdro.id/api")  
    confirmed=total.data.confirmed.value
    recovered=total.data.recovered.value
    deaths=total.data.deaths.value
    active=confirmed-(recovered+deaths)

    countryConfirmed = []
    countryActive = []
    countryRecovered = []
    countryDeaths = []

    for (i = 0; i < countryLength; i++) {
        try {
            let countryconfirm = await axios.get(`https://covid19.mathdro.id/api/countries/${countryName[i]}/confirmed`)
            if (!countryconfirm) {
                countryConfirmed[i] = "not found"
                countryRecovered[i] = "not found"
                countryDeaths[i] = "not found"
            }
            countryConfirmed[i] = countryconfirm.data[0].confirmed
            countryRecovered[i] = countryconfirm.data[0].recovered
            countryDeaths[i] = countryconfirm.data[0].deaths
        } catch (e) {
            countryConfirmed[i] = "not found"
            countryRecovered[i] = "not found"
            countryDeaths[i] = "not found"
        }
            countryActive[i] = (countryConfirmed[i] - (countryRecovered[i] + countryDeaths[i]))

    }

    res.render("index", {
        countryLength,
        countryName,
        countryConfirmed,
        countryActive,
        countryRecovered,
        countryDeaths,
        confirmed,
        recovered,
        active,
        deaths
    })
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`connected to port ${port}`))