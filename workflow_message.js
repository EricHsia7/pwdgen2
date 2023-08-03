const fs = require('fs');
const axios = require('axios');
const { execSync } = require('child_process');

function saveMessageId(messageId) {
  if (typeof messageId === 'number' && !isNaN(messageId)) {
    fs.writeFileSync('telegramMessageId.txt', messageId.toString());
  } else {
    console.error('Invalid messageId');
  }
}

function getSavedMessageId() {
  try {
    return parseInt(fs.readFileSync('telegramMessageId.txt', 'utf-8').trim());
  } catch (error) {
    return null;
  }
}

function removeMessageId() {
  try {
    fs.unlinkSync('telegramMessageId.txt');
    console.log('Message ID removed.');
  } catch (error) {
    console.error('Error removing message ID:', error);
  }
}

function sendMessage(token, chatId, name, step, status, id) {
  const message = `Workflow name: ${name}\nCurrent Step: ${step}\nStatus: ${status}\nID: #${id}`;
  const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  axios
    .post(telegramApiUrl, {
      chat_id: parseInt(chatId),
      text: message
    })
    .then((response) => {
      const messageId = response.data.result.message_id;
      saveMessageId(messageId);
      console.log('Message sent:');
      console.log(message);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}

function updateMessage(token, chatId, name, step, status, id) {
  const messageId = getSavedMessageId();

  if (!messageId) {
    console.log('No previous message found. Use "send" command first to send a message.');
    process.exit(1);
  }

  const message = `Workflow name: ${name}\nCurrent Step: ${step}\nStatus: ${status}\nID: #${id}`;
  const telegramApiUrl = `https://api.telegram.org/bot${token}/editMessageText`;

  axios
    .post(telegramApiUrl, {
      chat_id: parseInt(chatId),
      message_id: messageId,
      text: message
    })
    .then((response) => {
      console.log('Message updated:');
      console.log(message);
    })
    .catch((error) => {
      console.error('Error updating message:', error);
    });
}

const args = process.argv.slice(2);
const command = args[0];

const token = args[1];
const chatId = args[2];
const workflowName = args[3];
const workflowStep = args[4];
const workflowStatus = args[5];
const workflowId = execSync('echo $GITHUB_RUN_NUMBER').toString().trim();

if (command === 'remove') {
  removeMessageId();
  process.exit(0);
}

if (command === 'send') {
  sendMessage(token, chatId, workflowName, workflowStep, workflowStatus, workflowId);
} else if (command === 'update') {
  updateMessage(token, chatId, workflowName, workflowStep, workflowStatus, workflowId);
} else {
  console.log('Invalid command. Usage:');
  console.log('node workflowMessage.js send <token> <chat_id> <name> <step> <status>');
  console.log('node workflowMessage.js update <token> <chat_id> <name> <step> <status>');
}
