//Dependencies
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Deck = mongoose.model('Deck');

//Main
module.exports = class DeckCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deck',
      guildOnly: true,
      aliases: [],
      group: 'inventory',
      memberName: 'deck',
      description: 'Show all the cards in your main deck',
      examples: ['deck']
    });
  }

  async run(msg) {
    const deck = await Deck.findOne({ memberID: msg.member.id }).exec();

    if (!deck)
      return msg.embed(
        new MessageEmbed()
          .setTitle("Profile doesn't exist")
          .setDescription(
            "Profile doesn't exist, use `register` command to register profile"
          )
          .setColor('#f44336')
      );

    let str = '';

    let arr = [];

    deck.mainDeck.forEach(card => {
      if (_.includes(arr.map(c => c[0]), card.cardName))
        arr[_.findIndex(arr, c => c[0] === card.cardName)][1]++;
      else arr.push([card.cardName, 1]);
    });

    arr.forEach(card => {
      str += `• ${card[0]} x${card[1]}\n`;
    });

    msg.embed(
      new MessageEmbed()
        .setTitle('Sent in DM')
        .setDescription('Please check your DM')
        .setColor('#2196f3')
    );
    msg.member.send(
      new MessageEmbed()
        .setTitle('Main Deck')
        .setDescription(str)
        .setColor('#2196f3')
    );
  }
};
