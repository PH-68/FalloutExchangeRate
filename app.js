const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
    host: 'mcfallout.net', // minecraft server ip
    username: 'ianhong68@outlook.com', // minecraft username
    auth: 'microsoft', // for offline mode servers, you can set this to 'offline'
    // port: 25565,                // only set if you need a port that isn't 25565
    version: "1.19.3",             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
    // password: '12345678'        // set if you want to use password-based auth (may be unreliable)
})

var rate = "", flag = false


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
    if (flag) {
        rate = jsonMsg.toString()
        flag = false
        console.warn(rate)
        var response = await (await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "GET" })).json();
        var content = `{\"message\":\"automated comment\",\"content\":\"${Buffer.from(Buffer.from(response.content, 'base64').toString() + rate + "\n").toString("base64")}\",\"sha\":\"${response.sha}\",\"branch\":\"data\"}`
        response = await fetch("https://api.github.com/repos/PH-68/FalloutExchangeRate/contents/rate.csv?ref=data", { method: "PUT", body: content, headers: {Authorization: "Bearer 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" } });
        console.log(await response.json())
        return;
    }
    if (jsonMsg.toString().includes("cepool-data-api-price")) {
        flag = true
    }
    console.log(jsonMsg.toString())
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)