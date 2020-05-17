import React, { useState } from "react";
import HandsContainer from "../containers/HandsContainer";
import HeaderContainer from "../containers/HeaderContainer";
import PlayedCardsContainer from "../containers/PlayedCardsContainer";
import allCards from "../helpers/cardData";
import {
  isAnythingSelected,
  doesFirstPlayerPlay3Spades,
  areCardsTheSame,
  areAnyTwosSelected,
  areSinglesConsecutive,
  areDoublesConsecutive,
  areTriplesConsecutive,
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
  // const [hands, setHands] = useState([]);
  const [hands, setHands] = useState(playersInitialHands);
  const [selectedCards, setSelectedCards] = useState([]);
  const [typeOfRound, setTypeOfRound] = useState("");
  const [activePlayers, setActivePlayers] = useState(["1", "2", "3", "4"]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  // consider refactoring and deleting cardToBeat
  const [cardToBeat, setCardToBeat] = useState("");
  const [lastPlayedCards, setLastPlayedCards] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

  const handsValues = () => {
    return Object.values(hands);
  };

  const veryFirstTurn = () => {
    return handsValues().flat().length === 52 ? true : false;
  };

  const allHandsEmpty = () => {
    return handsValues().flat().length === 0 ? true : false;
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

  const isTheComboBigger = (topCard) => {
    if (topCard.order !== cardToBeat.order) {
      return topCard.order > cardToBeat.order;
    } else {
      return suitRankMap[topCard.suit] > suitRankMap[cardToBeat.suit];
    }
  };

  // set first player
  const markFirstPlayer = (playerNumber) => {
    setCurrentPlayer(playerNumber);
  };

  // logic for dealing a hand of 13 random cards
  const dealHand = (allCards) => {
    let availableCards = [...allCards];
    let newHands = {};

    for (let i = 1; i <= 4; i++) {
      let newHand = [];
      while (newHand.length < 13) {
        let randomCard =
          availableCards[Math.floor(Math.random() * availableCards.length)];
        newHand.push(randomCard);

        if (randomCard["name"] === "3 Spades") {
          markFirstPlayer(i.toString());
        }
        availableCards = availableCards.filter(
          (availableCard) => randomCard !== availableCard
        );
      }

      // insert dummy hand here for testing!
      // newHand = testThreeConsecutiveTriples;
      // sort hand by rank (per rules of 13 card game)
      let sortedHand = sortCards(newHand);
      newHands[[i.toString()]] = sortedHand;
    }
    setHands(newHands);
    console.log("New game has started!");
  };

  const areSelectedCardsValidToPlay = () => {
    let sortedSelectedCards = sortCards(selectedCards);
    // USE GAME LOGIC TO CHECK IF SELECTED CARDS ARE VALID BEFORE PLAYING!!

    // Valid hands:
    // 1. any single, double, triple, quad of same card
    if (areCardsTheSame(sortedSelectedCards)) {
      if (sortedSelectedCards.length === 1) {
        console.log(`Player ${currentPlayer} played a single`);
        playMap["single"]();
      } else if (sortedSelectedCards.length === 2) {
        console.log(`Player ${currentPlayer} played a double`);
        playMap["double"]();
      } else if (sortedSelectedCards.length === 3) {
        console.log(`Player ${currentPlayer} played a triple`);
        playMap["triple"]();
      } else if (sortedSelectedCards.length === 4) {
        console.log(`Player ${currentPlayer} played a quad`);
        playMap["quad"]();
      }
      return true;
    }
    // 2. runs of 3+ consecutive singles (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 3 &&
      // !sortedSelectedCards.some((card) => card.order === 13) &&
      areSinglesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    ) {
      console.log(
        `Player ${currentPlayer} played run of singles, ${sortedSelectedCards.length} cards`
      );
      playMap["singleRun"]();
      return true;
    }

    // 3. runs of 3+ consecutive doubles (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 6 &&
      sortedSelectedCards.length % 2 === 0 &&
      areDoublesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    ) {
      console.log(
        `Player ${currentPlayer} played run of doubles, ${sortedSelectedCards.length} cards`
      );
      playMap["doubleRun"]();
      return true;
    }

    // 4. runs of 3+ consecutive triples (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 9 &&
      sortedSelectedCards.length % 3 === 0 &&
      areTriplesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    ) {
      console.log(
        `Player ${currentPlayer} played run of triples, ${sortedSelectedCards.length} cards`
      );
      playMap["tripleRun"]();
      return true;
    }
  };

  // logic for selecting a card in the hand
  const handleSelectCard = (card) => {
    let alreadySelectedCards = [...selectedCards];

    // After game logic is fulfilled, follow selection logic
    // deselect if already selected, or else select it
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
      // } else if (lengthOfAllHandsValues === 52) {
    } else if (veryFirstTurn()) {
      console.log("The first player cannot pass!");
      alert("The first player cannot pass!");
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
      console.log(`Player ${nextPlayer()} wins this round`);
      console.log("New round!");
      moveToNextPlayer();
      setCardToBeat("");
      setTypeOfRound("");
      remainingPlayers = ["1", "2", "3", "4"];
    }
    setActivePlayers(remainingPlayers);
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = () => {
    if (!isAnythingSelected(selectedCards)) {
      console.log("No selection is not a valid play!");
      alert("No selection is not a valid play!");
      return;
    }
    // check if first hand has 3 of spades!
    if (veryFirstTurn() && !doesFirstPlayerPlay3Spades(selectedCards)) {
      console.log("First player in game must play a combo with 3 of Spades!");
      alert("First player in game must play a combo with 3 of Spades!");
      return;
    }

    // check if selected cards are valid combo to play
    if (!areSelectedCardsValidToPlay()) {
      console.log("Selection is not a valid play!");
      alert("Selection is not a valid play!");
      return;
    }

    // check if selected combo is larger than current combo to beat
    if (
      cardToBeat !== "" &&
      !isTheComboBigger(selectedCards[selectedCards.length - 1])
    ) {
      console.log("Selection must be larger than current combo to beat");
      alert("Selection must be larger than current combo to beat");
      return;
    }

    // add selected cards to played cards
    let sortedSelectedCards = sortCards(selectedCards);
    let allPlayedCards = [sortedSelectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);

    // check for the combo hierarchy to beat
    setLastPlayedCards(sortedSelectedCards);
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
    setTypeOfRound("");
    setCardToBeat("");
    setLastPlayedCards([]);
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
