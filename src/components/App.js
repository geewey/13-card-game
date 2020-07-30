import React, { useState } from "react";
import HeaderContainer from "../containers/HeaderContainer";
import GameLogContainer from "../containers/GameLogContainer";
import HandsContainer from "../containers/HandsContainer";
import PlayedCardsContainer from "../containers/PlayedCardsContainer";
import { allCards, suitRankMap } from "../helpers/cardData";
import {
  someCardsAreSelected,
  firstPlayerPlays3Spades,
  comboOfSelectedCards,
} from "../helpers/rulesData";
import "./App.css";
// import { testEndGame, testShortEndGame } from "../helpers/testHands";
import { testShortEndGame } from "../helpers/testHands";

const initialPlayersHands = {
  "1": [],
  "2": [],
  "3": [],
  "4": [],
};

const pickupRoundDefault = {
  isPickupRound: false,
  pickupPlayer: "",
};

const App = () => {
  const [playersHands, setPlayersHands] = useState(initialPlayersHands);
  const [selectedCards, setSelectedCards] = useState([]);
  const [typeOfRound, setTypeOfRound] = useState("");
  const [activePlayers, setActivePlayers] = useState(["1", "2", "3", "4"]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [lastPlayedCardsInRound, setLastPlayedCardsInRound] = useState([]);
  const [pickupRound, setPickupRound] = useState(pickupRoundDefault);
  const [playedCards, setPlayedCards] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  const setNewRound = () => {
    setTypeOfRound("");
    setLastPlayedCardsInRound([]);
  };

  const playersHandsValues = () => {
    return Object.values(playersHands);
  };

  const veryFirstTurn = () => {
    // return playersHandsValues().flat().length === 52 ? true : false;
    return playedCards.length === 0 ? true : false;
  };

  const allHandsEmpty = () => {
    return playersHandsValues().flat().length === 0 ? true : false;
  };

  const isPlayerHandEmpty = (player) => {
    let currentPlayerHand = playersHands[player];
    currentPlayerHand = currentPlayerHand.filter(
      (card) => !selectedCards.includes(card)
    );
    return currentPlayerHand.length === 0;
  };

  const isNewRound = () => {
    return lastPlayedCardsInRound.length === 0 ? true : false;
  };

  const addToGameLog = (messageArray) => {
    // limits messages to 5 displayed
    let messages = [...gameLog];
    if (messages[0] === messageArray[messageArray.length - 1]) messages.shift();
    if (messages.length + messageArray.length > 5) {
      while (messages.length + messageArray.length > 5) messages.pop();
    }
    setGameLog([...messageArray, ...messages]);
  };

  // sets combo type
  const playCombo = (type) => {
    setTypeOfRound(type);
    addToGameLog([
      `Player ${currentPlayer} played a ${type}, ${selectedCards.length} card(s)`,
    ]);
  };

  // sort cards by rank (per rules of 13 card game)
  const sortCards = (cards) => {
    let unsortedCards = [...cards];

    let sortedCards = unsortedCards.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      } else {
        return suitRankMap[a.suit] - suitRankMap[b.suit];
      }
    });
    return sortedCards;
  };

  // marks player as first to go for the game
  const markFirstPlayer = (playerNumber) => {
    setCurrentPlayer(playerNumber);
  };

  // logic for dealing a hand of 13 random cards to 4 players
  const dealNewHands = (allCards) => {
    let availableCards = [...allCards];
    let newPlayersHands = {};
    let firstPlayer = "";

    for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
      let newPlayerHand = [];
      while (newPlayerHand.length < 13) {
        let randomCard =
          availableCards[Math.floor(Math.random() * availableCards.length)];
        newPlayerHand.push(randomCard);

        if (randomCard["name"] === "3 Spades") {
          firstPlayer = playerNumber.toString();
          markFirstPlayer(firstPlayer);
        }
        availableCards = availableCards.filter(
          (availableCard) => randomCard !== availableCard
        );
      }

      // sort hand by rank (per rules of 13 card game)
      let sortedHand = sortCards(newPlayerHand);
      newPlayersHands[[playerNumber.toString()]] = sortedHand;
    }
    setPlayersHands(newPlayersHands);
    // test game logic, scenarios, & hands here by enabling next 2 lines:
    markFirstPlayer("4");
    setPlayersHands(testShortEndGame);

    setGameLog([
      `New game has started! Player ${firstPlayer} has the 3 of Spades, so they go first!`,
    ]);
  };

  const selectedCardsAreValidCombo = () => {
    let sortedSelectedCards = sortCards(selectedCards);

    // rulesData checks if selected cards are valid combo before playing
    let comboName = comboOfSelectedCards(sortedSelectedCards);
    return typeof comboName === "string" ? true : false;
  };

  // logic for selecting a card in the hand
  const handleSelectCard = (card) => {
    let alreadySelectedCards = [...selectedCards];

    // deselects if card is already selected, or else select it
    if (alreadySelectedCards.includes(card)) {
      alreadySelectedCards = alreadySelectedCards.filter(
        (alreadySelectedCard) => alreadySelectedCard !== card
      );
    } else {
      alreadySelectedCards.push(card);
    }
    alreadySelectedCards = sortCards(alreadySelectedCards);
    setSelectedCards(alreadySelectedCards);
  };

  // logic to return boolean, whether card is selected
  const isCardSelected = (card) => {
    return selectedCards.includes(card);
  };

  // logic for filtering played cards out of one hand
  const filterCards = (cards) => {
    let cardsToFilter = [...cards];
    let remainingCards = cardsToFilter.filter(
      (remainingCard) => !isCardSelected(remainingCard)
    );
    return remainingCards;
  };

  // logic for returning the next active player
  // (helper function used when there are >1 active players)
  const nextPlayer = () => {
    // note: player numbers are stores as strings in an array
    let currentPlayerNumber = parseInt(currentPlayer);
    let activePlayersNumbers = activePlayers.map((num) => parseInt(num));
    // if the player number is the "highest", then cycle to "lowest" player number
    // else, just move the player forward by one
    let nextPlayer =
      currentPlayerNumber === Math.max(...activePlayersNumbers)
        ? Math.min(...activePlayersNumbers)
        : activePlayersNumbers[activePlayers.indexOf(currentPlayer) + 1];
    return nextPlayer.toString();
  };

  // logic for moving to next active player
  const moveToNextPlayer = () => {
    setCurrentPlayer(nextPlayer());
  };

  // logic for returning array of player numbers who have cards in hand
  const remainingPlayersWithCards = () => {
    let remainingPlayersArray = [];
    for (const playerNumber in playersHands) {
      if (!isPlayerHandEmpty(playerNumber)) {
        remainingPlayersArray.push(playerNumber);
      }
    }

    let sortedRemainingPlayersArrayNum = remainingPlayersArray
      .map((playerNum) => parseInt(playerNum))
      .sort((a, b) => a - b);
    remainingPlayersArray = sortedRemainingPlayersArrayNum.map((playerNum) =>
      playerNum.toString()
    );
    return remainingPlayersArray;
  };

  // logic to handle when a player finishes hand
  const handlePlayerFinishedHand = (player) => {
    console.log(
      `Player ${player} is out! If nobody beats their last play, Player ${nextPlayer()} can start a new round.`
    );
    addToGameLog([
      `Player ${player} is out! If nobody beats their last play, Player ${nextPlayer()} can start a new round.`,
    ]);
    setPickupRound({ isPickupRound: true, pickupPlayer: nextPlayer() });
  };

  // logic for current player passing their turn
  // break it up - doing too many things:
  // (1) checks if all hands are empty -or- if it's the very first turn
  // (2) assigns the next player based on number of active players
  // (3) checks if a player just got out, or not
  const handlePass = (player) => {
    if (allHandsEmpty() || activePlayers.length === 1) {
      addToGameLog(["Please click 'Deal a new hand' to start a game!"]);
      return;
    } else if (veryFirstTurn()) {
      addToGameLog([
        "The first player cannot pass! Please select and play a combo that includes 3 of spades.",
      ]);
      return;
    } else if (lastPlayedCardsInRound.length === 0) {
      addToGameLog([
        `Player ${currentPlayer}, please lead off the round by selecting and playing any combo!`,
      ]);
      return;
    }
    let nextPlayerToPlay = nextPlayer();
    let remainingPlayers;

    // check if a player just finished their hand
    if (pickupRound.isPickupRound === true && activePlayers.length > 2) {
      remainingPlayers = activePlayers.filter(
        (activePlayer) => activePlayer !== player
      );
      console.log(
        `This player will continue if nobody picks up: Player ${pickupRound.pickupPlayer}`
      );
      addToGameLog([`Player ${player} passed in the pickup round.`]);
      moveToNextPlayer();
    } else if (
      // if a player finished, and there are not more than 2 active players
      pickupRound.isPickupRound === true
    ) {
      addToGameLog([
        `Player ${pickupRound.pickupPlayer} wins the pickup round. New round! Play any combo!`,
        "......",
        `Player ${player} passed in the pickup round.`,
      ]);
      setCurrentPlayer(pickupRound.pickupPlayer);
      setPickupRound(pickupRoundDefault);
      remainingPlayers = remainingPlayersWithCards();
      setNewRound();
    } else if (activePlayers.length > 2) {
      // normal round, there are more than 2 players left
      setPickupRound(pickupRoundDefault);
      remainingPlayers = activePlayers.filter(
        (activePlayer) => activePlayer !== player
      );
      addToGameLog([`Player ${player} passed`]);
      moveToNextPlayer();
    } else {
      // normal round, there is only 1 player left
      setPickupRound(pickupRoundDefault);
      addToGameLog([
        `Player ${nextPlayerToPlay} wins this round. New round! Play any combo!`,
        "......",
        `Player ${player} passed`,
      ]);
      moveToNextPlayer();
      setNewRound();
      // NEED TO FIX THIS to activePlayers who have cards in their hands
      remainingPlayers = remainingPlayersWithCards();
    }
    setSelectedCards([]);
    setActivePlayers(remainingPlayers);
  };

  // logic to check if combo is bigger before playing
  const isSelectedComboBigger = (selectedCards) => {
    let topCard = sortCards(selectedCards)[selectedCards.length - 1];
    let cardToBeat = lastPlayedCardsInRound[lastPlayedCardsInRound.length - 1];
    if (topCard.order !== cardToBeat.order) {
      return topCard.order > cardToBeat.order;
    } else {
      return suitRankMap[topCard.suit] > suitRankMap[cardToBeat.suit];
    }
  };

  // logic to check combo matches round type && combo length
  const selectedComboMatchesRoundType = () => {
    let currentCombo = comboOfSelectedCards(selectedCards);
    if (
      selectedCards.length === lastPlayedCardsInRound.length &&
      typeOfRound === currentCombo
    ) {
      return true;
    }
    return false;
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = (player) => {
    if (allHandsEmpty()) {
      addToGameLog(["Please click 'Deal a new hand' to start a game!"]);
      return;
    }

    if (!someCardsAreSelected(selectedCards)) {
      addToGameLog(["No cards are selected. Not a valid play!"]);
      return;
    }
    // check if first hand has 3 of spades!
    if (veryFirstTurn() && !firstPlayerPlays3Spades(selectedCards)) {
      addToGameLog([
        "First player must start the game by playing a combo with 3 of Spades!",
      ]);
      return;
    }

    // check if selected cards are valid combo to play
    if (!selectedCardsAreValidCombo()) {
      addToGameLog(["Selection is not a valid combo!"]);
      return;
    }

    // check if selected combo is larger than current combo to beat
    if (!isNewRound() && !isSelectedComboBigger(selectedCards)) {
      addToGameLog([
        "Selection must be a combo that beats the last combo played! If you cannot or do not wish to play, please press 'Pass this round' to skip this round.",
      ]);
      return;
    }

    // check to check selected combo is same as round type
    if (!isNewRound() && !selectedComboMatchesRoundType()) {
      addToGameLog([
        `Selected type of combo is not the same as round type! Please play a ${typeOfRound} with ${lastPlayedCardsInRound.length} card(s).`,
      ]);
      return;
    }

    // add selected cards to played cards
    let sortedSelectedCards = sortCards(selectedCards);
    let allPlayedCards = [sortedSelectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);
    playCombo(comboOfSelectedCards(sortedSelectedCards));
    setLastPlayedCardsInRound(sortedSelectedCards);

    // iterate and filter selected cards out of player's hand
    let currentPlayersHands = { ...playersHands };
    let currentPlayerUpdatedHand = filterCards(
      playersHands[parseInt(currentPlayer)]
    );
    currentPlayersHands[player] = currentPlayerUpdatedHand;

    let currentActivePlayers = activePlayers;

    // if the player's hand is now empty, delete it
    if (isPlayerHandEmpty(currentPlayer)) {
      handlePlayerFinishedHand(currentPlayer);
      delete currentPlayersHands[currentPlayer];
      // create a function here to deal with these cases!!
      currentActivePlayers = activePlayers.filter(
        (activePlayer) => activePlayer !== currentPlayer
      );
      if (currentActivePlayers.length === 1) {
        addToGameLog([
          'Game over! Congratulations for a great game! Hit "Deal a new hand!" to start a new game!',
        ]);
      }
    }

    // check if this is in the midst of a pickup round
    if (pickupRound.isPickupRound === true && activePlayers.length > 1) {
      setPickupRound({ ...pickupRound, pickupPlayer: currentPlayer });
    }
    if (pickupRound.isPickupRound === true && activePlayers.length === 1) {
      setPickupRound(pickupRoundDefault);
      currentActivePlayers = remainingPlayersWithCards();
    }

    // set the new hands
    setPlayersHands(currentPlayersHands);
    setActivePlayers(currentActivePlayers);

    // clear selected cards
    setSelectedCards([]);

    // move to the next active player
    moveToNextPlayer();
  };

  const displayRules = () => {
    alert("Click cards, then select 'Play selected cards!'");
    alert("Valid card combos include the following:");
    alert("1. any single, double, triple, or quad of the same card.");
    alert(
      "2. straights of 3+ consecutive singles, doubles, or triples (2s cannot be included in straights)."
    );
    alert("See rules at https://www.pagat.com/climbing/thirteen.html");
    addToGameLog(["See rules at https://www.pagat.com/climbing/thirteen.html"]);
  };

  // HeaderContainer for "Deal button" logic
  const handleDealCards = () => {
    setPlayedCards([]);
    setSelectedCards([]);
    setNewRound();
    dealNewHands(allCards);
    setActivePlayers(["1", "2", "3", "4"]);
  };

  return (
    <>
      <HeaderContainer
        handleDealCards={handleDealCards}
        displayRules={displayRules}
      />
      <HandsContainer
        playersHands={playersHands}
        isCardSelected={isCardSelected}
        handleSelectCard={handleSelectCard}
        handlePlaySelectedCards={handlePlaySelectedCards}
        currentPlayer={currentPlayer}
        handlePass={handlePass}
      />
      <GameLogContainer gameLog={gameLog} />
      <PlayedCardsContainer playedCards={playedCards} />
    </>
  );
};

export default App;
