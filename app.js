const mineflayer = require('mineflayer')
require('dotenv').config();
const bot = mineflayer.createBot({
    host: 'jp.mcfallout.net', // minecraft server ip
    username: process.env.email, // minecraft username
    auth: 'microsoft', // for offline mode servers, you can set this to 'offline'
    // port: 25565,                // only set if you need a port that isn't 25565
    version: "1.19.3",             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
    // password: '12345678'        // set if you want to use password-based auth (may be unreliable)
})

var rate = "", lock = false


bot.on('spawn', (username, message) => {
    //if (username === bot.username) return
    //bot.chat(message)
    //console.log(username+ message)
    setTimeout(function () {
        bot.chat("/ctrade data-api")
    }, 3000);
})

bot.on('message', async (jsonMsg, position, sender, verified) => {
    //if (username === bot.username) return
    //bot.chat(message)
    if (!lock && jsonMsg.toString().indexOf(new Date(new Date().setHours(new Date().getHours() + 8)).toJSON().slice(0, 10)) == 0) {
        lock = true
        rate = jsonMsg.toString()
        console.warn(rate)
        var response = await (await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "GET", headers: { Authorization: `Bearer ${process.env.gh_pat}` } })).json();
        if (Buffer.from(response.content, 'base64').toString().indexOf(rate.split(",")[0]) != -1) {
            console.log("data already updated")
            process.exit(1204)
        }
        var content = `{\"message\":\"automated comment\",\"content\":\"${Buffer.from(Buffer.from(response.content, 'base64').toString() + rate + "\n").toString("base64")}\",\"sha\":\"${response.sha}\",\"branch\":\"data\"}`
        response = await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "PUT", body: content, headers: { Authorization: `Bearer ${process.env.gh_pat}` } });
        lock = false
        console.log(await response.status)
        process.exit(await response.status)
    }
    //console.log(jsonMsg.toString())
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)


