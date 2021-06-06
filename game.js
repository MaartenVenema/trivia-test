/*
  Improvements i made
  - cleaned up function naming and how the function where bound to the game var vs this
  - moved/rewrote some code to make it more readable 
  - renamed a few functions to be more descriptive
  - added comments to make the code clearer to navigate
  - added a max amount of player which is configurable
  - created some more indepth tests
  - added more user feedback messages to make clear where the players stand
    - player amount
    - show when there is a winner
*/
exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function () {
  // Set the max amount of players
  const maxNumOfPlayers = 6;

  var players = new Array();
  var places = new Array(maxNumOfPlayers);
  var purses = new Array(maxNumOfPlayers);
  var inPenaltyBox = new Array(maxNumOfPlayers);

  var popQuestions = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions = new Array();
  var rockQuestions = new Array();

  var currentPlayer = 0;
  var isGettingOutOfPenaltyBox = false;

  // Populate questions
  for (var i = 0; i < 50; i++) {
    popQuestions.push("Pop Question " + i);
    scienceQuestions.push("Science Question " + i);
    sportsQuestions.push("Sports Question " + i);
    rockQuestions.push("Rock Question " + i);
  }

  this.getMaxNumOfPlayers = function () {
    return maxNumOfPlayers;
  }

  this.getPlayers = function () {
    return players;
  }


  // If a player has 6 coins he/she wins
  this.didPlayerWin = function () {
    return !(purses[currentPlayer] == 6);
  };

  // Create question mapping / game board
  this.currentCategory = function () {
    if (
      places[currentPlayer] == 0 ||
      places[currentPlayer] == 4 ||
      places[currentPlayer] == 8
    ) {
      return "Pop";
    }

    if (
      places[currentPlayer] == 1 ||
      places[currentPlayer] == 5 ||
      places[currentPlayer] == 9
    ) {
      return "Science";
    }

    if (
      places[currentPlayer] == 2 ||
      places[currentPlayer] == 6 ||
      places[currentPlayer] == 10
    ) {
      return "Sports";
    }

    return "Rock";
  };

  // Return the amount of players
  this.howManyPlayers = function () {
    return players.length;
  };

  // Check if the game can start
  this.isPlayable = function () {
    return this.howManyPlayers() >= 2 && this.howManyPlayers() <= maxNumOfPlayers;
  };

  // Add a player
  this.addPlayer = function (playerName) {
    players.push(playerName);
    places[this.howManyPlayers() - 1] = 0;
    purses[this.howManyPlayers() - 1] = 0;
    inPenaltyBox[this.howManyPlayers() - 1] = false;

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  // Ask a question and remove the question from the questions array
  this.askQuestion = function () {
    if (this.currentCategory() == "Pop") console.log(popQuestions.shift());
    if (this.currentCategory() == "Science") console.log(scienceQuestions.shift());
    if (this.currentCategory() == "Sports") console.log(sportsQuestions.shift());
    if (this.currentCategory() == "Rock") console.log(rockQuestions.shift());
  };

  // Roll the dice for a player
  this.rollDice = function (roll) {
    console.log(players[currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    // If the player has answered wronly previously they are put in the penalty box and must roll a odd number to get out
    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(
          players[currentPlayer] + " is getting out of the penalty box"
        );
        places[currentPlayer] = places[currentPlayer] + roll;
        if (places[currentPlayer] > 11) {
          places[currentPlayer] = places[currentPlayer] - 12;
        }

        console.log(
          players[currentPlayer] + "'s new location is " + places[currentPlayer]
        );
        console.log("The category is " + this.currentCategory());
        this.askQuestion();
      } else {
        console.log(
          players[currentPlayer] + " is not getting out of the penalty box"
        );
        isGettingOutOfPenaltyBox = false;
      }
    } else {
      // If not in the penalty box a player gets to answer a question
      places[currentPlayer] = places[currentPlayer] + roll;
      if (places[currentPlayer] > 11) {
        places[currentPlayer] = places[currentPlayer] - 12;
      }

      console.log(
        players[currentPlayer] + "'s new location is " + places[currentPlayer]
      );
      console.log("The category is " + this.currentCategory());
      this.askQuestion();
    }
  };

  // If the answer was correct
  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        console.log("Answer was correct!!!!");
        purses[currentPlayer] += 1;
        console.log(
          players[currentPlayer] +
            " now has " +
            purses[currentPlayer] +
            " Gold Coins."
        );

        var winner = this.didPlayerWin();
        currentPlayer += 1;
        if (currentPlayer == players.length) currentPlayer = 0;

        return winner;
      } else {
        currentPlayer += 1;
        if (currentPlayer == players.length) currentPlayer = 0;
        return true;
      }
    } else {
      console.log("Answer was correct!!!!");

      purses[currentPlayer] += 1;
      console.log(
        players[currentPlayer] +
          " now has " +
          purses[currentPlayer] +
          " Gold Coins."
      );

      var winner = this.didPlayerWin();

      currentPlayer += 1;
      if (currentPlayer == players.length) currentPlayer = 0;

      return winner;
    }
  };

  // If the answer was wrong
  this.wrongAnswer = function () {
    console.log("Question was incorrectly answered");
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

    currentPlayer += 1;
    if (currentPlayer == players.length) currentPlayer = 0;
    return true;
  };
};

// Initiate game
var game = new Game();
var notAWinner = false;

// Mock gameplay
game.addPlayer("Chet");
game.addPlayer("Pat");
game.addPlayer("Sue");

// Check if the game is playable. The game is currently set to have between 2 and 6 players
if(game.isPlayable()) {
  do {
    // Roll a dice between 1 and 6
    game.rollDice(Math.floor(Math.random() * 6) + 1);

    // Randomly guess correct or wrong
    if (Math.floor(Math.random() * 10) == 7) {
      notAWinner = game.wrongAnswer();
    } else {
      notAWinner = game.wasCorrectlyAnswered();
    }

    // If a user collects 6 coins he/she is the winner. Communicate this with the player
    if (!notAWinner) {
      // We should let the players know there is a winner
      console.log("we have a winner!!!!");
    }
  } while (notAWinner);
} else {
  // We should let the players know if the game is not setup correctly
  const numPlayersString = game.howManyPlayers() < 2 ? 'There is currently 1 player' : `There are currently ${game.howManyPlayers()} players`;
  console.log(`The game cannot start. ${numPlayersString}. The minimum amount of players is 2 and the max 6.`);
}
