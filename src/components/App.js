import React, { useState } from "react";
import allCards from "../helpers/cardData";
import "./App.css";
import { testThreeConsecutiveTriples } from "../helpers/testHands.js";

const suitRankMap = {
  spades: 1,
  clubs: 2,
  diamonds: 3,
  hearts: 4,
};

const App = () => {
  const [hands, setHands] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [typeOfRound, setTypeOfRound] = useState("");
  const [lastPlayedCards, setLastPlayedCards] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

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
  const sortCards = (hand) => {
    let newHand = [...hand];

    let sortedNewHand = newHand.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      } else {
        return suitRankMap[a.suit] - suitRankMap[b.suit];
      }
    });
    return sortedNewHand;
  };

  // logic for dealing a hand of 13 random cards
  const dealHand = (allCards) => {
    let newHand = [];
    let availableCards = [...allCards];

    while (newHand.length < 13) {
      let randomCard =
        availableCards[Math.floor(Math.random() * availableCards.length)];

      newHand.push(randomCard);
      availableCards = availableCards.filter(
        (availableCard) => randomCard !== availableCard
      );
    }

    // insert dummy hand here for testing!
    // newHand = testThreeConsecutiveTriples;
    // sort hand by rank (per rules of 13 card game)
    let sortedHand = sortCards(newHand);
    setHands(sortedHand);
  };

  const areSelectedCardsValidToPlay = () => {
    // USE GAME LOGIC TO CHECK IF SELECTED CARDS ARE VALID BEFORE PLAYING!!

    let sortedSelectedCards = sortCards(selectedCards);

    const areCardsTheSame = (arr) => {
      if (!arr.every((card) => card.order === arr[0].order)) return false;

      if (arr.length === 1) {
        playMap["single"]();
      } else if (arr.length === 2) {
        playMap["double"]();
      } else if (arr.length === 3) {
        playMap["triple"]();
      } else if (arr.length === 4) {
        playMap["quad"]();
      }
      console.log("cards are the same");
      return true;
    };

    const areAnyTwosSelected = (arr) => {
      if (arr.some((card) => card.order === 13)) return false;
      console.log("no 2s in run");
      return true;
    };

    const areSinglesConsecutive = (arr) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].order - arr[i - 1].order !== 1) {
          return false;
        }
      }
      console.log("singles are consecutive");
      playMap["singleRun"]();
      return true;
    };

    const areDoublesConsecutive = (arr) => {
      for (let i = 1; i < arr.length; i = i + 2) {
        if (arr[i].order - arr[i - 1].order !== 0) {
          return false;
        }
      }
      for (let i = 1; i < arr.length - 3; i = i + 2) {
        if (arr[i + 1].order - arr[i].order !== 1) {
          return false;
        }
      }
      console.log("doubles are consecutive");
      playMap["doubleRun"]();
      return true;
    };

    const areTriplesConsecutive = (arr) => {
      // for (let i = 2; i < arr.length; i = i + 3) {
      //   if (
      //     arr[i].order - arr[i - 1].order !== 0 &&
      //     arr[i].order - arr[i - 2].order !== 0
      //   ) {
      //     return false;
      //   }
      // }
      for (let i = 2; i < arr.length; i = i + 3) {
        if (!areCardsTheSame([arr[i], arr[i - 1], arr[i - 2]])) {
          return false;
        }
      }
      for (let i = 2; i < arr.length - 3; i = i + 3) {
        if (arr[i + 1].order - arr[i].order !== 1) {
          return false;
        }
      }
      console.log("triples are consecutive");
      playMap["tripleRun"]();
      return true;
    };

    // Valid hands:
    // 1A. any single card
    // if (sortedSelectedCards.length === 0) return true;
    // 1. any single, double, triple, quad of same card
    if (areCardsTheSame(sortedSelectedCards)) return true;
    // 2. runs of 3+ consecutive singles (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 3 &&
      // !sortedSelectedCards.some((card) => card.order === 13) &&
      areSinglesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    )
      return true;

    // 3. runs of 3+ consecutive doubles (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 6 &&
      sortedSelectedCards.length % 2 === 0 &&
      areDoublesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    )
      return true;

    // 4. runs of 3+ consecutive triples (2s not allowed in run)
    if (
      sortedSelectedCards.length >= 9 &&
      sortedSelectedCards.length % 3 === 0 &&
      areTriplesConsecutive(sortedSelectedCards) &&
      areAnyTwosSelected(sortedSelectedCards)
    )
      return true;
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

  // logic for confirming selected cards, add "selected-class" to className
  const isCardSelected = (card) => {
    return selectedCards.includes(card);
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = () => {
    // check if selected cards are valid to play
    if (!areSelectedCardsValidToPlay()) {
      console.log("Selected cards is not a valid play!");
      alert("Selected cards is not a valid play!");
      return;
    }

    // add selected cards to played cards
    let sortedSelectedCards = sortCards(selectedCards);
    setLastPlayedCards(sortedSelectedCards);
    let allPlayedCards = [...sortedSelectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);

    // iterate and filter selected cards out of hand
    let updatedHand = [...hands];
    selectedCards.forEach((selectedCard) => {
      updatedHand = updatedHand.filter(
        (remainingCard) => remainingCard !== selectedCard
      );
    });
    setHands(updatedHand);

    // clear selected cards
    setSelectedCards([]);
  };

  // HeaderContainer for "Deal button" logic
  const handleDealCards = (allCards) => {
    setPlayedCards([]);
    setSelectedCards([]);
    setTypeOfRound("");
    setLastPlayedCards([]);
    dealHand(allCards);
  };

  return (
    <>
      <div className="header-container">
        {/* clears played cards, assigns 13 new random cards */}
        <button onClick={() => handleDealCards(allCards)}>
          Deal a new hand!
        </button>
      </div>
      <div className="hand-container">
        <p>Your hand (13 random cards)</p>
        {hands.map((card) => {
          return (
            <img
              className={
                "small-card hand " +
                (isCardSelected(card) ? "selected-card" : "")
              }
              src={`/cards/${card.imgName}.png`}
              alt={card.name}
              key={card.name}
              onClick={() => handleSelectCard(card)}
            />
          );
        })}
        <br></br>
        <button onClick={() => handlePlaySelectedCards(selectedCards)}>
          Play selected cards!
        </button>
      </div>
      <div className="played-cards-container">
        <p>Played cards</p>
        {playedCards.map((card) => {
          return (
            <img
              className="small-card"
              src={`/cards/${card.imgName}.png`}
              alt={card.name}
              key={card.name}
              // onClick={() => handleSelectCard(card)}
            />
          );
        })}
      </div>
    </>
  );
};

export default App;
