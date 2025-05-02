const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario a expulsar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('razón')
        .setDescription('Razón de la expulsión')
        .setRequired(false)
    ),

  async execute(interaction) {
    const miembro = interaction.options.getMember('usuario');
    const razon = interaction.options.getString('razón') || 'No se proporcionó una razón';

    // Verifica si el usuario que ejecuta el comando tiene permisos
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '🚫 No tienes permisos para expulsar usuarios.', ephemeral: true });
    }

    // Verifica si el bot tiene permisos para expulsar
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '⚠️ No tengo permisos para expulsar usuarios.', ephemeral: true });
    }

    // Verifica si el usuario es expulsable
    if (!miembro.kickable) {
      return interaction.reply({ content: '❌ No puedo expulsar a este usuario.', ephemeral: true });
    }

    try {
      await miembro.kick(razon);

      const embed = new EmbedBuilder()
        .setTitle('👢 Usuario Expulsado')
        .setColor(0xff9900)
        .addFields(
          { name: 'Usuario', value: miembro.user.tag, inline: true },
          { name: 'Expulsado por', value: interaction.user.tag, inline: true },
          { name: 'Razón', value: razon }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Ocurrió un error al expulsar al usuario.', ephemeral: true });
    }
  }
};
