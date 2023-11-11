const TOKEN = '6745774930:AAH2D83RGgXaPd9tjuFQFhWHkWSd4vMspE0';
const APIURL = 'https://api.npoint.io/9031f9c27f3d6d5dd7b8';
const TIME = 1000 * 60 * 60;

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text == '/start') {
    const exchangeRates = await fetchExchangeRates();
    const option = {
      "parse_mode": "HTML",
    };

    const sentMessageRes = `${bold('Tỷ giá USD - Digital Banks')}\n\n${Object.keys(exchangeRates).map((bankName) => {
      const buyPrice = exchangeRates[bankName].buy;
      const sellPrice = exchangeRates[bankName].sell;
      return `${bankName}\n  MUA: ${bold(buyPrice)} VND\n  BÁN: ${bold(sellPrice)} VND`;
    }).join("\n\n")
      }`;
    bot.sendMessage(chatId, sentMessageRes, option)
      .then((sentMessage) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sentMessage.message_id);
          sendMessageAndDeleteAgain(chatId);
        }, TIME); //one hour
      });
  }
});

// Recurring gold price updates
async function sendMessageAndDeleteAgain(chatId) {
  const exchangeRates = await fetchExchangeRates();
  const option = {
    "parse_mode": "HTML",
  };
  const sentMessageRes = `${bold('Tỷ giá USD - Digital Banks')}\n\n${Object.keys(exchangeRates).map((bankName) => {
    const buyPrice = exchangeRates[bankName].buy;
    const sellPrice = exchangeRates[bankName].sell;
    return `${bankName}\n  MUA: ${bold(buyPrice)} VND\n  BÁN: ${bold(sellPrice)} VND`;
  }).join("\n\n")
    }`;

  if (msg.text == '/start') {
    bot.sendMessage(chatId, sentMessageRes, option)
      .then((sentMessage) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sentMessage.message_id);
          sendMessageAndDeleteAgain(chatId);
        }, TIME); //one hour
      });
  }
}

function bold(text) {
  return text.bold();
}

// Function to fetch gold prices
async function fetchExchangeRates() {
  const response = await fetch(APIURL);
  const data = await response.json();
  return data;
}
