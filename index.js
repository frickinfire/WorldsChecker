const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, channel_id } = require('./config.json');
var mainWebUp = "Offline";
var worldServerUp = "Offline";
const client = new Client({ intents: [ 
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,] });
const net = require('net');

client.once(Events.ClientReady, readyClient => {
	console.log(`worldschecker started as ${readyClient.user.tag}`);
});
client.on("messageCreate", (message) => {
	if (message.channel.id === channel_id) {
     console.log("checking...")
if (message.content.startsWith(`start`)) {

	updateStatus(message);
  }
 }

});
async function updateStatus(msg) {
	pingHostname("worlds.net");
	pingHostname("www.3dcd.com");
	const channel = client.channels.cache.get(channel_id);

    const messageManager = channel.messages;
    const messages = await messageManager.channel.messages.fetch({ limit: 99 });
	channel.bulkDelete(messages,true);
	
  
 
	channel.send({
  "embeds": [
    {
      "type": "rich",
      "title": `Worlds.com status`,
      "description": "",
      "color": 0xef1111,
      "fields": [
        {
          "name": `🌐 Main webserver: ` + mainWebUp,
          "value": `🎮 Alt webserver/WorldServer: ` + worldServerUp
        }
      ]
    }
  ]
});
setTimeout(updateStatus, 10000);
}
async function pingHostname(hostname) {
   return new Promise((resolve, reject) => {
      const socket = net.createConnection(80, hostname);
      socket.setTimeout(3000);
      socket.on('connect', () => {
         socket.end();
         resolve(true);
		 if (hostname === "worlds.net"){ mainWebUp = "Online"; }
		 if (hostname === "www.3dcd.com"){ worldServerUp = "Online"; }	 
		
      });
      socket.on('timeout', () => {
         socket.destroy();
         resolve(false);
		 if (hostname === "worlds.net"){ mainWebUp = "Offline"; }
		 if (hostname === "www.3dcd.com"){ worldServerUp = "Offline"; }	 
      });
      socket.on('error', () => {
         socket.destroy();
         resolve(false);
		 if (hostname === "worlds.net"){ mainWebUp = "Offline"; }
		 if (hostname === "www.3dcd.com"){ worldServerUp = "Offline"; }	 
      });
   });
}
client.login(token);