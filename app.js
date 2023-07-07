const mineflayer = require('mineflayer')
require('dotenv').config();
const bot = mineflayer.createBot({
    host: 'mcfallout.net', // minecraft server ip
    username: process.env.email, // minecraft username
    auth: 'microsoft', // for offline mode servers, you can set this to 'offline'
})

var rate = "", lock = false


bot.on('spawn', (username, message) => {
    setTimeout(function () {
        bot.chat("/ctrade data-api")
    }, 3000);
})

bot.on("health", () => {
    if (bot.health < 20) {
        console.log(`Low health(${bot.health})`)
        process.exit()
    }
})

bot.on('message', async (jsonMsg, position, sender, verified) => {
    checkHealth()

    var currentDateString = new Date(new Date().setHours(new Date().getHours() + 8)).toJSON();
    if (!lock && jsonMsg.toString().indexOf(currentDateString.slice(0, 10)) == 0) {
        lock = true
        rate = jsonMsg.toString()
        var response = await (await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "GET", headers: { Authorization: `Bearer ${process.env.gh_pat}` } })).json();
        if (Buffer.from(response.content, 'base64').toString().indexOf(rate.split(",")[0]) != -1) {
            console.log(`[${currentDateString.slice(11, 19)}]Data already updated`)
        }
        else {
            var commitMessage = `{"message":"${rate}","content":"${Buffer.from(Buffer.from(response.content, 'base64').toString() + rate + "\n").toString("base64")}","sha":"${response.sha}","branch":"data"}`
            response = await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "PUT", body: commitMessage, headers: { Authorization: `Bearer ${process.env.gh_pat}` } });
            console.log(`[${currentDateString.slice(11, 19)}]Updated`)
        }
        lock = false
        bot.quit()
    }
})

function checkHealth() {
    if (bot.health < 20) {
        console.log(`Low health(${bot.health})`)
        process.exit()
    }
}

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)


