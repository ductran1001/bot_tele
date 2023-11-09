const TelegramBot = require('node-telegram-bot-api');

const token = '6958740287:AAFf4sru-A-AQzuYY886fK3RW-R4NJ23sc8';

const bot = new TelegramBot(token, { polling: true });

// Handle '/echo' command
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const goldPrices = await fetchGoldPrices();

  const sentMessageRes = `**Exchange Rates:**\n\n${Object.keys(goldPrices).map((paymentMethod) => {
    const sellPrice = goldPrices[paymentMethod].sell;
    return `${paymentMethod}: ${sellPrice}`;
  }).join("\n\n")
    }`;
  bot.sendMessage(chatId, sentMessageRes)
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
        sendMessageAndDeleteAgain(chatId);
      }, 2000); //one hour
    });
});

// Recurring gold price updates
async function sendMessageAndDeleteAgain(chatId) {
  const goldPrices = await fetchGoldPrices();

  const sentMessageRes = `**Exchange Rates:**\n\n${Object.keys(goldPrices).map((paymentMethod) => {
    const sellPrice = goldPrices[paymentMethod].sell;
    return `${paymentMethod}: ${sellPrice}`;
  }).join("\n\n")
    }`;

  bot.sendMessage(chatId, sentMessageRes)
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
        sendMessageAndDeleteAgain(chatId);
      }, 2000); //one hour
    });
}

// Function to fetch gold prices
async function fetchGoldPrices() {
  const apiUrl = 'https://api.npoint.io/9031f9c27f3d6d5dd7b8';
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}
