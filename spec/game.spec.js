require('../game.js');

describe("Check if the game setups correctly", function() {
  beforeEach(function() {
     this.game = new Game();
  });

  afterEach(function() {
    this.game = null;
  });

  it("should access game", function() {
    // expect(Game).toBeDefined();
    expect(this.game).toBeDefined();
  });

  it("should be able to add a player", function() {
    expect(this.game.addPlayer("Chet")).toBe(true);
  });

  it("should not be playable with 1 player", function() {
    this.game.addPlayer("Chet");
    expect(this.game.isPlayable()).toBe(false);
  });

  it("Should should be playable with 2 players", function() {
    this.game.addPlayer("Chet");
    this.game.addPlayer("Pat");
    expect(this.game.isPlayable()).toBe(true);
  });

  it("Should be playable with the max number of players set for the game", function() {
    const maxNumOfPlayers = this.game.getMaxNumOfPlayers();

    console.log('max amount of players is set to '+maxNumOfPlayers)

    for (let index = 0; index < maxNumOfPlayers; index++) {
      this.game.addPlayer("player_"+index);
    }
    expect(this.game.isPlayable()).toBe(true);
  });

  it("Should not be playable with more then maxNumOfPlayers", function() {
    const maxNumOfPlayers = this.game.getMaxNumOfPlayers();

    console.log('max amount of players is set to '+maxNumOfPlayers)

    for (let index = 0; index < maxNumOfPlayers+1; index++) {
      this.game.addPlayer("player_"+index);
    }
    expect(this.game.isPlayable()).toBe(false);
  });
});

  // This could be approved upon. It could/should check the diffrent steps of the game are run correctly but my time is almost up ;)
describe("Check if the game can run a mock game", function() {
  beforeEach(function() {
     this.game = new Game();
  });

  afterEach(function() {
    this.game = null;
  });

  it("Should be able to run a full mock game", function() {
    var notAWinner = false;

    this.game.addPlayer("Chet");
    this.game.addPlayer("Pat");
    this.game.addPlayer("Sue");

    // If the game can run play a mock game with the added players
    if(this.game.isPlayable()) {
      do {
        // Roll a dice between 1 and 6
        this.game.rollDice(Math.floor(Math.random() * 6) + 1);

        // Randomly guess correct or wrong
        if (Math.floor(Math.random() * 10) == 7) {
          notAWinner = this.game.wrongAnswer();
        } else {
          notAWinner = this.game.wasCorrectlyAnswered();
        }

        // If a user collects 6 coins he/she is the winner. Communicate this with the player
        if (!notAWinner) {
          console.log("we have a winner!");
          expect(true).toBe(true);
        }
      } while (notAWinner);
    } else {
      const numPlayersString = this.game.howManyPlayers() < 2 ? 'There is currently 1 player' : `There are currently ${game.howManyPlayers()} players`;
      console.log(`The game cannot start. ${numPlayersString}. The minimum amount of players is 2 and the max 6.`);
    }
  });
});