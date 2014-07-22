var ProtocolException = require('./ProtocolException');
var Arena = require('./Arena');
var Human = require('./Human');
var Boxer = require('../samples/Boxer');
var Kickboxer = require('../samples/Kickboxer');
var ServerMode = require('./server/ServerMode');

var FIGHT_HUMAN_SWITCH = '--fight-me';
var FIGHT_BOT_SWITCH = '--fight-bot';
var RUN_ON_SERVER_SWITCH = '--fight-on-server';

var USAGE_INSTRUCTIONS =
  FIGHT_HUMAN_SWITCH + '\t\truns your bot against you in interactive mode\n' +
  FIGHT_BOT_SWITCH + 'boxer\truns your bot against a built-in boxer bot\n' +
  FIGHT_BOT_SWITCH + 'kickboxer\truns your bot against a built-in kickboxer bot\n' +
  RUN_ON_SERVER_SWITCH + '\truns your bot in codefights engine environment';

function SDK(fighter) {
  this.fighter = fighter;
}

SDK.prototype.run = function(argv) {
  var MyFighter = this.fighter;
  var args = argv.splice(2, argv.length),
      arena, serverMode;

  if(this.isFightHumanMode(args)) {
    arena = new Arena();
    arena.registerFighter(new Human(), 'You');
    arena.registerFighter(new MyFighter(), 'Your bot');
    arena.stageFight();
  } else if(this.isFightBotMode(args)) {
    arena = new Arena();
    arena.registerFighter(new MyFighter(), 'Your bot');
    arena.registerFighter(this.createBot(args), args[1]);
    arena.stageFight();
  } else if(this.isRunInServerMode(args)) {
    console.log(MyFighter);
    serverMode = new ServerMode();
    serverMode.run(new MyFighter());
  } else {
    this.printUsageInstructions(args);
  }
};

SDK.prototype.isRunInServerMode = function(args) {
  return args.length === 1 && args[0].toLocaleLowerCase() === RUN_ON_SERVER_SWITCH;
};

SDK.prototype.isFightBotMode = function(args) {
  return args.length >= 2 && args[0].toLocaleLowerCase() === FIGHT_BOT_SWITCH;
};

SDK.prototype.isFightHumanMode = function(args) {
  return args.length === 1 && args[0].toLocaleLowerCase() === FIGHT_HUMAN_SWITCH;
};

SDK.prototype.printUsageInstructions = function(args) {
  if(args.length > 0) {
    console.log('unrecognized option(s): ');
    for(var i = 0; i < args.length; i++) {
      console.log(args[i] + ' ');
    }
    console.log('\n');
  }
  console.log(USAGE_INSTRUCTIONS);
};

SDK.prototype.createBot = function(args) {
  if(args[1].toLocaleLowerCase() === 'boxer') {
    return new Boxer();
  }

  if(args[1].toLocaleLowerCase() === 'kickboxer') {
    return new Kickboxer();
  }

  throw new ProtocolException('unrecognized built-in bot: ' + args[1]);
};

module.exports = SDK;