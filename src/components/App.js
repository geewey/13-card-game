import React, { useState } from "react";
import HeaderContainer from "../containers/HeaderContainer";
import GameLogContainer from "../containers/GameLogContainer";
import HandsContainer from "../containers/HandsContainer";
import PlayedCardsContainer from "../containers/PlayedCardsContainer";
import allCards from "../helpers/cardData";
import {
  someCardsAreSelected,
  firstPlayerPlays3Spades,
  comboOfSelectedCards,
} from "../helpers/rulesData";
import "./App.css";

const suitRankMap = {
  spades: 1,
  clubs: 2,
  diamonds: 3,
  hearts: 4,
};

const initialPlayersHands = {
  "1": [],
  "2": [],
  "3": [],
  "4": [],
};

const App = () => {
  const [playersHands, setPlayersHands] = useState(initialPlayersHands);
  const [selectedCards, setSelectedCards] = useState([]);
  const [typeOfRound, setTypeOfRound] = useState("");
  const [activePlayers, setActivePlayers] = useState(["1", "2", "3", "4"]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [lastPlayedCardsInRound, setLastPlayedCardsInRound] = useState([]);
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
    return playersHandsValues().flat().length === 52 ? true : false;
  };

  const allHandsEmpty = () => {
    return playersHandsValues().flat().length === 0 ? true : false;
  };

  const isNewRound = () => {
    return lastPlayedCardsInRound.length === 0 ? true : false;
  };

  const addToGameLog = (message) => {
    // limiting messages until I figure out CSS...
    let messages = [...gameLog];
    if (messages.length > 5) messages.pop();
    setGameLog([message, ...messages]);
  };

  // sets combo type
  const playCombo = (type) => {
    setTypeOfRound(type);
    addToGameLog(
      `Player ${currentPlayer} played a ${type}, ${selectedCards.length} card(s)`
    );
    console.log(
      `Player ${currentPlayer} played a ${type}, ${selectedCards.length} card(s)`
    );
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

  // marks player as first to go
  const markFirstPlayer = (playerNumber) => {
    setCurrentPlayer(playerNumber);
  };

  // logic for dealing a hand of 13 random cards
  const dealNewHands = (allCards) => {
    let availableCards = [...allCards];
    let newPlayersHands = {};
    let firstPlayer = "";

    for (let i = 1; i <= 4; i++) {
      let newPlayerHand = [];
      while (newPlayerHand.length < 13) {
        let randomCard =
          availableCards[Math.floor(Math.random() * availableCards.length)];
        newPlayerHand.push(randomCard);

        if (randomCard["name"] === "3 Spades") {
          markFirstPlayer(i.toString());
          firstPlayer = i.toString();
        }
        availableCards = availableCards.filter(
          (availableCard) => randomCard !== availableCard
        );
      }

      // sort hand by rank (per rules of 13 card game)
      let sortedHand = sortCards(newPlayerHand);
      newPlayersHands[[i.toString()]] = sortedHand;
    }
    setPlayersHands(newPlayersHands);
    setGameLog([
      `New game has started! Player ${firstPlayer} has the 3 of Spades, so they go first!`,
    ]);
    console.log(
      `New game has started! Player ${firstPlayer} has the 3 of Spades, so they go first!`
    );
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
  // (assuming more than 1 active player)
  const nextPlayer = () => {
    let currentPlayerNumber = parseInt(currentPlayer);
    let activePlayersNumbers = activePlayers.map((num) => parseInt(num));
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

  // logic for current player passing their turn
  const handlePass = (player) => {
    if (allHandsEmpty()) {
      addToGameLog("Please click 'Deal a new hand' to start a game!");
      console.log("Please click 'Deal a new hand' to start a game!");
      alert("Please click 'Deal a new hand' to start a game!");
      return;
    } else if (veryFirstTurn()) {
      addToGameLog(
        "The first player cannot pass! Please select and play a combo that includes 3 of spades."
      );
      console.log(
        "The first player cannot pass! Please select and play a combo that includes 3 of spades."
      );
      alert(
        "The first player cannot pass! Please select and play a combo that includes 3 of spades."
      );
      return;
    }

    addToGameLog(`Player ${player} passed`);
    console.log(`Player ${player} passed`);

    let remainingPlayers;
    if (activePlayers.length > 2) {
      remainingPlayers = activePlayers.filter(
        (activePlayer) => activePlayer !== player
      );
      moveToNextPlayer();
    } else {
      addToGameLog(
        `Player ${player} passed. Player ${nextPlayer()} wins this round. New round! Play any combo!`
      );
      console.log(
        `Player ${player} passed. Player ${nextPlayer()} wins this round. New round! Play any combo!`
      );
      moveToNextPlayer();
      setNewRound();
      // NEED TO FIX THIS
      remainingPlayers = activePlayers;
    }
    setSelectedCards([]);
    setActivePlayers(remainingPlayers);
  };

  // logic to check if combo is bigger before playing
  const isSelectedComboBigger = (topCard) => {
    let cardToBeat = lastPlayedCardsInRound[lastPlayedCardsInRound.length - 1];
    if (topCard.order !== cardToBeat.order) {
      return topCard.order > cardToBeat.order;
    } else {
      return suitRankMap[topCard.suit] > suitRankMap[cardToBeat.suit];
    }
  };

  // logic to check combo matches round type
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

  // logic for checking if player's hand is empty
  const isPlayerHandEmpty = (player) => {
    let playerNumber = player;
    return playersHands[playerNumber].length === 0;
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = (player) => {
    if (!someCardsAreSelected(selectedCards)) {
      addToGameLog("No cards are selected. Not a valid play!");
      console.log("No cards are selected. Not a valid play!");
      alert("No cards are selected. Not a valid play!");
      return;
    }
    // check if first hand has 3 of spades!
    if (veryFirstTurn() && !firstPlayerPlays3Spades(selectedCards)) {
      addToGameLog("First player in game must play a combo with 3 of Spades!");
      console.log("First player in game must play a combo with 3 of Spades!");
      alert("First player in game must play a combo with 3 of Spades!");
      return;
    }

    // check if selected cards are valid combo to play
    if (!selectedCardsAreValidCombo()) {
      addToGameLog("Selection is not a valid combo!");
      console.log("Selection is not a valid combo!");
      alert("Selection is not a valid combo!");
      return;
    }

    // check if selected combo is larger than current combo to beat
    if (
      !isNewRound() &&
      !isSelectedComboBigger(selectedCards[selectedCards.length - 1])
    ) {
      addToGameLog(
        "Selection must be a combo that beats the last combo played! If you cannot or do not wish to play, please press 'Pass this round' to skip this round."
      );
      console.log(
        "Selection must be a combo that beats the last combo played! If you cannot or do not wish to play, please press 'Pass this round' to skip this round."
      );
      alert(
        "Selection must be a combo that beats the last combo played! If you cannot or do not wish to play, please press 'Pass this round' to skip this round."
      );
      return;
    }

    // check to check selected combo is same as round type
    if (!isNewRound() && !selectedComboMatchesRoundType()) {
      addToGameLog("Selected type of combo is not the same as round type!");
      console.log("Selected type of combo is not the same as round type!");
      alert("Selected type of combo is not the same as round type!");
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
    currentPlayersHands[currentPlayer] = currentPlayerUpdatedHand;

    // if the player's hand is now empty, delete it
    if (isPlayerHandEmpty(currentPlayer)) {
      currentPlayersHands.delete(currentPlayer);
      addToGameLog(`Player ${currentPlayer} has no more cards!`);
    }
    // set the new hands
    setActivePlayers(Object.keys(currentPlayersHands));
    setPlayersHands(currentPlayersHands);

    // clear selected cards
    setSelectedCards([]);

    // move to the next active player
    moveToNextPlayer();
  };

  const displayRules = () => {
    alert("Click cards, then select 'Play selected cards!'");
    alert("Valid card combos include the following:");
    alert("1. any single, double, triple, quad of same card");
    alert("2. runs of 3+ consecutive singles (2s not allowed in run)");
    alert("3. runs of 3+ consecutive doubles (2s not allowed in run)");
    alert("4. runs of 3+ consecutive triples (2s not allowed in run)");
    alert("See rules at https://www.pagat.com/climbing/thirteen.html");
    addToGameLog(`See rules at https://www.pagat.com/climbing/thirteen.html`);
  };

  // HeaderContainer for "Deal button" logic
  const handleDealCards = () => {
    setPlayedCards([]);
    setSelectedCards([]);
    setNewRound();
    dealNewHands(allCards);
  };

  return (
    <>
      <HeaderContainer
        handleDealCards={handleDealCards}
        displayRules={displayRules}
      />
      <GameLogContainer gameLog={gameLog} />
      <HandsContainer
        playersHandsValues={playersHandsValues()}
        isCardSelected={isCardSelected}
        handleSelectCard={handleSelectCard}
        handlePlaySelectedCards={handlePlaySelectedCards}
        currentPlayer={currentPlayer}
        handlePass={handlePass}
      />
      <PlayedCardsContainer playedCards={playedCards} />
    </>
  );
};

export default App;
