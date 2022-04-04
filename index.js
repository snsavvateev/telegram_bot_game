const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("./options")
const token = '5156339925:AAGEDdQ7sPUCM7YefnkclQY4nTUsszpCSVw'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!")
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);

}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начальное приветствие"},
        {command: "/info", description: "Получить инфомацию о пользователе"},
        {command: "/game", description: "Игра угадай цифру"}
    ])
    bot.on("message", async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/e39/e60/e39e60e4-8fa7-4532-b62d-b141282609b6/192/18.webp")
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот FreeDrivers ')
        }
        if(text === "/info"){
            return bot.sendMessage(chatId, 'Тебя зовут ' + msg.from.first_name + ' ' + msg.from.last_name);
        }
        if (text === "/game"){
            return startGame(chatId);

        }

        return bot.sendMessage(chatId, "Я не понимаю тебя, попробуй еще раз")

    })
    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === "/again"){
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, "Поздравляю, ты отгадал цифру " + chats[chatId], againOptions)
        }else {
            return bot.sendMessage (chatId, "К сожелению ты не угадал, бот загадал цифру " + chats[chatId], againOptions)
        }
    })

}

start()

