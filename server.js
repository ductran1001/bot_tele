const TelegramBot = require('node-telegram-bot-api');

const token = '6949067750:AAHODXJs-6nng3CHInjGU9I_QkAOKpQRr8I';

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
      }, 1000 * 60 * 60); //one hour
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
      }, 1000 * 60 * 60); //one hour
    });
}

// Function to fetch gold prices
async function fetchGoldPrices() {
  const apiUrl = 'https://api.npoint.io/d0e75247700affeb2da2';
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}
