const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = '!';

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'kick') {
    // Verificar permisos del autor
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('🚫 No tienes permisos para usar este comando.');
    }

    // Verificar que se haya mencionado a un usuario
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Debes mencionar a un usuario para expulsarlo.');
    }

    // Verificar si se puede expulsar
    if (!member.kickable) {
      return message.reply('⚠️ No puedo expulsar a ese usuario.');
    }

    try {
      await member.kick();

      const embed = new EmbedBuilder()
        .setTitle('👢 Usuario Expulsado')
        .setColor(0xff0000)
        .addFields(
          { name: 'Usuario', value: `${member.user.tag}`, inline: true },
          { name: 'Expulsado por', value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('❌ Hubo un error al intentar expulsar al usuario.');
    }
  }
});

client.login(process.env.TOKEN);
