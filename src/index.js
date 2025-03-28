const app = require("express")();
const Discord = require('discord.js');
const chalk = require('chalk');
require('dotenv').config('./.env');
const axios = require('axios');
const webhook = require("./config/webhooks.json");
const config = require("./config/bot.js");
const webHooksArray = ['startLogs', 'shardLogs', 'errorLogs', 'dmLogs', 'voiceLogs', 'serverLogs', 'serverLogs2', 'commandLogs', 'consoleLogs', 'warnLogs', 'voiceErrorLogs', 'creditLogs', 'evalLogs', 'interactionLogs'];
const rulesChannelId = "1350728749447905300";

// Check if .env webhook_id and webhook_token are set
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
    for (const webhookName of webHooksArray) {
        webhook[webhookName].id = process.env.WEBHOOK_ID;
        webhook[webhookName].token = process.env.WEBHOOK_TOKEN;
    }
}

console.clear();
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), (chalk.green(`Starting up`)), (chalk.white(`...`)))
console.log(`\u001b[0m`)
console.log(chalk.blue(chalk.bold(`System`)), (chalk.white(`>>`)), chalk.red(`Version ${require(`${process.cwd()}/package.json`).version}`), (chalk.green(`loaded`)))
console.log(`\u001b[0m`);

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<iframe style="margin: 0; padding: 0;" width="100%" height="100%" src="https://uoaio.vercel.app/" frameborder="0" allowfullscreen></iframe>`);
    res.end()
});

app.listen(3000, () => console.log(chalk.blue(chalk.bold(`Server`)), (chalk.white(`>>`)), (chalk.green(`Running on`)), (chalk.red(`3000`))))
require('./bot')

// Webhooks
const consoleLogs = new Discord.WebhookClient({
    id: webhook.consoleLogs.id,
    token: webhook.consoleLogs.token,
});

const warnLogs = new Discord.WebhookClient({
    id: webhook.warnLogs.id,
    token: webhook.warnLogs.token,
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・Unhandled promise rejection`)
        .addFields([
            {
                name: "Error",
                value: error ? Discord.codeBlock(error) : "No error",
            },
            {
                name: "Stack error",
                value: error.stack ? Discord.codeBlock(error.stack) : "No stack error",
            }
        ])
    consoleLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending unhandled promise rejection to webhook')
        console.log(error)
    })
});

process.on('warning', warn => {
    console.warn("Warning:", warn);
    const embed = new Discord.EmbedBuilder()
        .setTitle(`🚨・New warning found`)
        .addFields([
            {
                name: `Warn`,
                value: `\`\`\`${warn}\`\`\``,
            },
        ])
    warnLogs.send({
        username: 'Bot Logs',
        embeds: [embed],
    }).catch(() => {
        console.log('Error sending warning to webhook')
        console.log(warn)
    })
});

// Send Rules and Regulations
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const rulesChannel = client.channels.cache.get(rulesChannelId);
    if (rulesChannel) {
        rulesChannel.send(`**RULES AND REGULATIONS**\n\n**CONDUCT 1: RACIAL SLURS**\nPlease do not say any things such as the N word, C word, anything like that you will be immediately banned, and formally banned from any associated servers we have high expectations for this Discord Server and we will not tolerate ANY situations such as these, you have been warned.\n\n**CONDUCT 2: ROBLOX ToU**\nYou must follow Roblox Terms of Service it is required, make sure you are not an exploiter or doing any wrong doing bypassing is not allowed also, things such as sybau, B.>.>I.>.>T.>.>C.>.>H.>.>., the N word is strongly prohibited and our Moderators, and Administration will ensure that any racial slurs or bypassing gets dealt with accordingly.\n\n**CONDUCT 3: DISCORD ToS**\nExploitation of Minors is strongly prohibited and you will be permanently banned, reported to discord moderation team, and we will ensure that you get banned from discord as a whole, and reported to authorities.\nMake sure you are 13 years old and above as said from a direct term from Discord, under the "Age requirements and responsibility of parents and legal guardians" conduct.\nDo not click on any links that are sent to you in Private Message, even if they promise you free Robux, free Nitro, or any other special offers. Do NOT click any links and make sure you have 2-step verification enabled.\n\n**CONDUCT 4: LGBTQ**\nLGBTQ community formally known as, Lesbian Gay Bisexual Transexual Community. Now, you have every right to openly talk if you are a part of the community inside of the DMs, but that does not give you the full right to send someone death threats because they do not agree with your community. Do it = Banned.\n\n**CONDUCT 5: RESPECT**\nRespect is automatically given, and never earned. You will respect everyone from Members to the Owner, no exceptions.\n\n**CONDUCT 6: ASKING FOR RANKS**\nYou may not ask for ranks such as Administrator, Moderator, Developer, Co-owner, or permissions. Ranks will be handed out to trusted individuals only.\n\n**CONDUCT 7: NSFW**\nNSFW content is strictly prohibited. Posting inappropriate content will result in a 7-day kick, and repeated offenses will lead to a permanent ban.\n\n🔗 https://discord.com/terms`);
    }
});

client.login(process.env.TOKEN);
