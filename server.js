const TOKEN = '6745774930:AAH2D83RGgXaPd9tjuFQFhWHkWSd4vMspE0';
const APIURL = 'https://api.npoint.io/9031f9c27f3d6d5dd7b8';
const TIME = 1000 * 1 * 1; // One hour in milliseconds

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, { polling: true });

// Handle messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    const exchangeRates = await fetchExchangeRates();
    const formattedExchangeRateData = formatExchangeRateData(exchangeRates);
    const option = {
      parse_mode: 'HTML',
    };

    // Check if the formatted exchange rate data is not empty before sending it
    if (!formattedExchangeRateData) {
      console.warn("Empty exchange rate data. Skipping message sending.");
      return;
    }

    bot.sendMessage(chatId, formattedExchangeRateData, option)
      .then((sentMessage) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sentMessage.message_id);
          sendMessageAndDeleteAgain(chatId);
        }, TIME); // One hour
      });
  }
});

// Recurring exchange rate updates
async function sendMessageAndDeleteAgain(chatId) {
  const exchangeRates = await fetchExchangeRates();
  const formattedExchangeRateData = formatExchangeRateData(exchangeRates);
  const option = {
    parse_mode: 'HTML',
  };

  // Check if the formatted exchange rate data is not empty before sending it
  if (!formattedExchangeRateData) {
    console.warn("Empty exchange rate data. Skipping message sending.");
    return;
  }

  bot.sendMessage(chatId, formattedExchangeRateData, option)
    .then((sentMessage) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMessage.message_id);
        sendMessageAndDeleteAgain(chatId);
      }, TIME); // One hour
    });
}

function bold(text) {
  return text.bold();
}

// Format exchange rate data into a readable message
function formatExchangeRateData(exchangeRates) {
  const formattedMessage = `<b>Tỷ giá USD - Digital Banks</b>\n\n${Object.keys(exchangeRates).map((bankName) => {
    const buyPrice = exchangeRates[bankName].buy;
    const sellPrice = exchangeRates[bankName].sell;
    return `${bankName}\n  MUA: ${bold(buyPrice)} VND\n  BÁN: ${bold(sellPrice)} VND`;
  }).join('\n\n')}`;
  return formattedMessage;
}

// Function to fetch exchange rates
async function fetchExchangeRates() {
  const response = await fetch(APIURL);
  const data = await response.json();
  return data;
}
