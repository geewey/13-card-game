import React, { useState } from "react";
import allCards from "../helpers/cardData";
import "./App.css";

const suitRankMap = {
  spades: 1,
  clubs: 2,
  diamonds: 3,
  hearts: 4,
};

const App = () => {
  const [hand, setHand] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

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

    // sort hand by rank (per rules of 13 card game)
    let sortedHand = sortCards(newHand);
    setHand(sortedHand);
  };

  const isValidCardSelection = (card) => {
    // USE GAME LOGIC BELOW TO CHECK CARD SELECTION!!

    // 1A. User can play singles
    if (selectedCards.length === 0) return true;

    // 1B. User can play pairs, triples, or quads
    if (card.order === selectedCards[0].order) return true;

    // debugger;
    // 2. User can play runs of 3+ consecutive cards (2s not allowed in run)
    if (
      card.order !== 13 &&
      !selectedCards.map((selectedCard) => selectedCard.order).includes(13) &&
      selectedCards
        .map((selectedCard) => Math.abs(selectedCard.order - card.order))
        .includes(1)
    )
      return true;
  };

  // logic for selecting a card in the hand
  const handleSelectCard = (card) => {
    let alreadySelectedCards = [...selectedCards];

    // After game logic is fulfilled, follow selection logic
    if (alreadySelectedCards.includes(card)) {
      // deselect a card if already selected
      alreadySelectedCards = alreadySelectedCards.filter(
        (alreadySelectedCard) => alreadySelectedCard !== card
      );
    } else {
      // select the card
      alreadySelectedCards.push(card);
    }

    setSelectedCards(alreadySelectedCards);
  };

  // for selected cards, add "selected-class" to className
  const isCardSelected = (card) => {
    return selectedCards.includes(card);
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = () => {
    // add selected cards to played cards
    let allPlayedCards = [...selectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);

    // iterate and filter selected cards out of hand
    let updatedHand = [...hand];
    selectedCards.forEach((selectedCard) => {
      updatedHand = updatedHand.filter(
        (remainingCard) => remainingCard !== selectedCard
      );
    });
    setHand(updatedHand);

    // clear selected cards
    setSelectedCards([]);
  };

  // HeaderContainer for "Deal button" logic
  const handleDealCards = (allCards) => {
    setPlayedCards([]);
    setSelectedCards([]);
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
        {hand.map((card) => {
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
