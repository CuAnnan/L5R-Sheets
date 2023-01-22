import fs from 'fs';
import path from 'path';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFile = fs.readFileSync('./config.json').toString();
const conf = JSON.parse(jsonFile);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandsPath = path.join(__dirname, 'bot-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
     const module = await(import(`./bot-commands/${file}`));
     const command = module.default;

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;


    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found. May be from a different bot.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log in to Discord with your client's token
client.login(conf.token);