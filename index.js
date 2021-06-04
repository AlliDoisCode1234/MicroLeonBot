const tmi = require('tmi.js');
require('dotenv').config({ path: './.env' })
const data = require('./data.json');
const FILE_PATH = './data.json'


jsonfile.writeFile(FILE_PATH, data)

const microLeon = {};
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'FunnyCommentary',
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: ['funnycommentary']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    // Add TTS(text to speech)
    if (message.toLowerCase().indexOf('teach them express') > -1 && tags.username !== 'funnycommentary' && tags.username !== 'imranbmohamed') {
        client.say(channel, `@${tags.username}, You are timed out for 'expressing' yourself`);
        client.say(channel, `/timeout @${tags.username} 3600 Asking me to teach Express`)

    }
});

client.on('message', (channel, tags, message, self) => {
    const microLeonRegex = /(\+\+|--)/g;

    // Need to store session MicroLeons so they persist
    // Put hashmap into separate folder and add data json to create micro leons === whatever 

    if (microLeonRegex.test(message)) {
        const [user, operator] = message.split(microLeonRegex);

        if (!(user in microLeon)) {
            microLeon[user] = 0;
        }

        if (user === 'funnycommentary' || user === 'imranbmohamed' || user === 'dvkr') {
            microLeon[user] += 1000000
        }

        if (operator === '++') {
            microLeon[user]++;
        } else {
            microLeon[user]--;
        }

        client.say(channel, `@${user}, ${user} now has ${microLeon[user]} Micro Leons`);
        return;
    }


    if (self || !message.startsWith('!')) {
        return;
    }



    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'say') {
        client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`);
    } else if (command === 'hello') {
        client.say(channel, `@${tags.username}, Yo what's up`);
    } else if (command === 'yolo') {
        const result = Math.ceil(Math.random() * 2);
        client.say(channel, `@${tags.username}, You rolled a ${result}.`);
    }



});
