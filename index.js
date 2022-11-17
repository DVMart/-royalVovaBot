const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const config = require('./config.json')

const bot = new TelegramApi(config.token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал цифру от 0 до 9. Угадай ее.')
    const randomNumder = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumder;
    await bot.sendMessage(chatId, 'Отгадай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Старт бота' },
        { command: '/info', description: 'Палит твое имя' },
        { command: '/game', description: 'Играет' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const name = msg.from.first_name;
        const chatId = msg.chat.id;
        const msgId = msg.message_id;

        try {
            console.log(msg)

            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6a3/497/6a34971d-6648-37c2-8f2b-8940f65ba906/14.webp')
                bot.forwardMessage(config.adminChatId, chatId, msgId)
                return bot.sendMessage(chatId, 'Приветствую!')
                
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут ${name}!`)
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, '¯\\_(ツ)_/¯')
        } catch (e) {
            return bot.sendMessage(adminChatId, 'Произошла какая-то ошибка');
        }
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал. Была цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start()