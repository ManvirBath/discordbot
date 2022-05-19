require("dotenv").config();

//importing client
//allows us to interact with the discord api
const { Client, Intents } = require('discord.js');

//creating an instance of the client class
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on('message', (message) => {
    if(message.author.bot) 
        return;
    if(message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if(CMD_NAME === 'kick') {
            if(!message.member.permissions.has('KICK_MEMBERS')) {
                return message.reply('You do not have permissions to use that command'); 
            }
            if(args.length === 0) {
                return message.reply('Please provide an ID');
            }
            const member = message.guild.members.cache.get(args[0]);
            if(member) {
                member
                .kick()
                .then((member) => message.channel.send(`${member} was kicked.`))
                .catch((err) => message.channel.send('I do not have permissions to kick that user :('));
            } else {
                message.channel.send('That member was not found');
            } 
        } else if(CMD_NAME === 'ban') {
            if(!message.member.permissions.has('BAN_MEMBERS')) {
                return message.reply('You do not have permissions to use that command'); 
            }
            if(args.length === 0) 
                return message.reply('Please provide an ID');
            async function func() {
                try {
                    const user = await message.guild.members.ban(args[0]);
                    message.channel.send('User was banned successfully');
                } catch(err) {
                    console.log(err);
                    message.channel.send('An error occured. Either do not have permissions or user not found.');
                }
            }
        }
    }
});

//login method. log bot in
client.login(process.env.DISCORDBOTJS_BOT_TOKEN);
