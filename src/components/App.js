import React, { useState } from "react";
import HandsContainer from "../containers/HandsContainer";
import HeaderContainer from "../containers/HeaderContainer";
import PlayedCardsContainer from "../containers/PlayedCardsContainer";
import allCards from "../helpers/cardData";
import {
  someCardsAreSelected,
  firstPlayerPlays3Spades,
  comboIsASingle,
  comboIsADouble,
  comboIsATriple,
  comboIsAQuad,
  comboIsRunOfSingles,
  comboIsRunOfDoubles,
  comboIsRunOfTriples,
  comboOfSelectedCards,
} from "../helpers/rulesData";
// import { testThreeConsecutiveTriples } from "../helpers/testHands.js";
import "./App.css";

const suitRankMap = {
  spades: 1,
  clubs: 2,
  diamonds: 3,
  hearts: 4,
};

const playersInitialHands = {
  "1": [],
  "2": [],
  "3": [],
  "4": [],
};

const App = () => {
  const [hands, setHands] = useState(playersInitialHands);
  const [selectedCards, setSelectedCards] = useState([]);
  const [typeOfRound, setTypeOfRound] = useState("");
  const [activePlayers, setActivePlayers] = useState(["1", "2", "3", "4"]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  // consider refactoring and deleting cardToBeat
  const [cardToBeat, setCardToBeat] = useState("");
  const [lastPlayedCardsInRound, setLastPlayedCardsInRound] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

  const setNewRound = () => {
    setTypeOfRound("");
    setLastPlayedCardsInRound([]);
    setCardToBeat("");
  };

  const handsValues = () => {
    return Object.values(hands);
  };

  const veryFirstTurn = () => {
    return handsValues().flat().length === 52 ? true : false;
  };

  const allHandsEmpty = () => {
    return handsValues().flat().length === 0 ? true : false;
  };

  const isNewRound = () => {
    return lastPlayedCardsInRound.length === 0 && cardToBeat === "";
  };

  const playSingle = () => {
    setTypeOfRound("single");
  };

  const playDouble = () => {
    setTypeOfRound("double");
  };

  const playTriple = () => {
    setTypeOfRound("triple");
  };

  const playQuad = () => {
    setTypeOfRound("quad");
  };

  const playSingleRun = () => {
    setTypeOfRound("singleRun");
  };

  const playDoubleRun = () => {
    setTypeOfRound("doubleRun");
  };

  const playTripleRun = () => {
    setTypeOfRound("tripleRun");
  };

  const playMap = {
    single: playSingle,
    double: playDouble,
    triple: playTriple,
    quad: playQuad,
    singleRun: playSingleRun,
    doubleRun: playDoubleRun,
    tripleRun: playTripleRun,
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

  // set first player
  const markFirstPlayer = (playerNumber) => {
    setCurrentPlayer(playerNumber);
  };

  // logic for dealing a hand of 13 random cards
  const dealHand = (allCards) => {
    let availableCards = [...allCards];
    let newHands = {};
    let firstPlayer = "";

    for (let i = 1; i <= 4; i++) {
      let newHand = [];
      while (newHand.length < 13) {
        let randomCard =
          availableCards[Math.floor(Math.random() * availableCards.length)];
        newHand.push(randomCard);

        if (randomCard["name"] === "3 Spades") {
          markFirstPlayer(i.toString());
          firstPlayer = i.toString();
        }
        availableCards = availableCards.filter(
          (availableCard) => randomCard !== availableCard
        );
      }

      // sort hand by rank (per rules of 13 card game)
      let sortedHand = sortCards(newHand);
      newHands[[i.toString()]] = sortedHand;
    }
    setHands(newHands);
    console.log("New game has started!");
    console.log(`Player ${firstPlayer} has 3 of Spades and goes first!`);
  };

  const selectedCardsAreValidCombo = () => {
    let sortedSelectedCards = sortCards(selectedCards);

    // GAME LOGIC TO CHECK IF SELECTED CARDS ARE VALID COMBO BEFORE PLAYING!!
    // Valid combos:
    // 1. any single, double, triple, quad of same card
    // 2. runs of 3+ consecutive singles (2s not allowed in run)
    // 3. runs of 3+ consecutive doubles (2s not allowed in run)
    // 4. runs of 3+ consecutive triples (2s not allowed in run)

    if (comboIsASingle(sortedSelectedCards)) {
      console.log(`Player ${currentPlayer} played a single`);
      playMap["single"]();
      return true;
    } else if (comboIsADouble(sortedSelectedCards)) {
      console.log(`Player ${currentPlayer} played a double`);
      playMap["double"]();
      return true;
    } else if (comboIsATriple(sortedSelectedCards)) {
      console.log(`Player ${currentPlayer} played a triple`);
      playMap["triple"]();
      return true;
    } else if (comboIsAQuad(sortedSelectedCards)) {
      console.log(`Player ${currentPlayer} played a quad`);
      playMap["quad"]();
      return true;
    } else if (comboIsRunOfSingles(sortedSelectedCards)) {
      console.log(
        `Player ${currentPlayer} played run of singles, ${sortedSelectedCards.length} cards`
      );
      playMap["singleRun"]();
      return true;
    } else if (comboIsRunOfDoubles(sortedSelectedCards)) {
      console.log(
        `Player ${currentPlayer} played run of doubles, ${sortedSelectedCards.length} cards`
      );
      playMap["doubleRun"]();
      return true;
    } else if (comboIsRunOfTriples(sortedSelectedCards)) {
      console.log(
        `Player ${currentPlayer} played run of triples, ${sortedSelectedCards.length} cards`
      );
      playMap["tripleRun"]();
      return true;
    }
    return false;
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

  // logic to check if card is selected
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
      console.log("Please click 'Deal a new hand' to start a game!");
      alert("Please click 'Deal a new hand' to start a game!");
      return;
    } else if (veryFirstTurn()) {
      console.log(
        "The first player cannot pass! Please select and play a combo that includes 3 of spades."
      );
      alert(
        "The first player cannot pass! Please select and play a combo that includes 3 of spades."
      );
      return;
    }

    console.log(`Player ${player} passed`);

    let remainingPlayers;
    if (activePlayers.length > 2) {
      remainingPlayers = activePlayers.filter(
        (activePlayer) => activePlayer !== player
      );
      moveToNextPlayer();
    } else {
      console.log(`Player ${nextPlayer()} wins this round. New round!`);
      moveToNextPlayer();
      setNewRound();
      remainingPlayers = ["1", "2", "3", "4"];
    }
    setSelectedCards([]);
    setActivePlayers(remainingPlayers);
  };

  // logic to check if combo is bigger before playing
  const isSelectedComboBigger = (topCard) => {
    if (topCard.order !== cardToBeat.order) {
      return topCard.order > cardToBeat.order;
    } else {
      return suitRankMap[topCard.suit] > suitRankMap[cardToBeat.suit];
    }
  };

  // logic to check combo matches round type
  const selectedComboMatchesRoundType = () => {
    if (
      selectedCards.length !== lastPlayedCardsInRound.length &&
      typeOfRound !== comboOfSelectedCards(selectedCards)
    ) {
      return false;
    }
    return true;
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = () => {
    if (!someCardsAreSelected(selectedCards)) {
      console.log("No cards are selected. Not a valid play!");
      alert("No cards are selected. Not a valid play!");
      return;
    }
    // check if first hand has 3 of spades!
    if (veryFirstTurn() && !firstPlayerPlays3Spades(selectedCards)) {
      console.log("First player in game must play a combo with 3 of Spades!");
      alert("First player in game must play a combo with 3 of Spades!");
      return;
    }

    // check if selected cards are valid combo to play
    if (!selectedCardsAreValidCombo()) {
      console.log("Selection is not a valid combo!");
      alert("Selection is not a valid combo!");
      return;
    }

    // check if selected combo is larger than current combo to beat
    if (
      !isNewRound() &&
      !isSelectedComboBigger(selectedCards[selectedCards.length - 1])
    ) {
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
      console.log("Selected type of combo is not the same as round type!");
      alert("Selected type of combo is not the same as round type!");
      return;
    }

    // add selected cards to played cards
    let sortedSelectedCards = sortCards(selectedCards);
    let allPlayedCards = [sortedSelectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);

    // sets the history for combo to beat
    setLastPlayedCardsInRound(sortedSelectedCards);
    setCardToBeat(sortedSelectedCards[sortedSelectedCards.length - 1]);

    // iterate and filter selected cards out of hand
    let currentHands = { ...hands };
    let currentPlayerUpdatedHand = filterCards(hands[parseInt(currentPlayer)]);
    currentHands[currentPlayer] = currentPlayerUpdatedHand;
    setHands(currentHands);

    // clear selected cards
    setSelectedCards([]);

    // move to the next active player
    moveToNextPlayer();
  };

  const displayRules = () => {
    alert("Click cards, then select 'Play selected cards!'");
  };

  // HeaderContainer for "Deal button" logic
  const handleDealCards = () => {
    setPlayedCards([]);
    setSelectedCards([]);
    setNewRound();
    dealHand(allCards);
  };

  return (
    <>
      <HeaderContainer
        handleDealCards={handleDealCards}
        displayRules={displayRules}
      />
      <HandsContainer
        handsValues={handsValues()}
        selectedCards={selectedCards}
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
