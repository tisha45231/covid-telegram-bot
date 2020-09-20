require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const countryList = require('./constants');

const bot = new Telegraf(process.env.botToken)
bot.start((ctx) => ctx.reply(`
Привет👋, ${ctx.message.from.first_name}!
Узнай статистику по коронавирусу🦠.
Введи на английском название страны и получи ответ.
Посмотреть весь список стран: /help 🏳
`, Markup.keyboard([
    ['Ukraine', 'Russia'],
    ['US', 'Italy'],
])
    .resize()
    .extra()
)
);

bot.help((ctx) => ctx.reply(countryList));

bot.on('text', async (ctx) => {
    let data = {};

    try {
        data = await api.getReportsByCountries(ctx.message.text);
        let formatData = `
Страна: ${data[0][0].country}
Количество случаев: ${data[0][0].cases}
Количество смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
            `;
        ctx.reply(formatData);
    } catch {
        ctx.reply('Ошибка! Такой страны не существует! Посмотрите: /help 🏳')
    }
});

bot.launch()
console.log('Стартуем!')