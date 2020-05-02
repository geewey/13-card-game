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

    // sort hand by rank aka number
    newHand.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      } else {
        return suitRankMap[a.suit] - suitRankMap[b.suit];
      }
    });
    setHand(newHand);
  };

  // logic for selecting a card in the hand
  const handleSelectCard = (card) => {
    // do nothing if card is already in selected cards
    if (selectedCards.includes(card)) return;

    setSelectedCards([...selectedCards, card]);
    // add logic to add "selected-class" to className
  };

  // logic for playing selected cards
  const handlePlaySelectedCards = () => {
    // add selected cards to played cards
    let allPlayedCards = [...selectedCards, ...playedCards];
    setPlayedCards(allPlayedCards);

    // iterate selected cards and filter each out of hand
    // then, set new hand
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
    <div>
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
              className={`small-card`}
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
    </div>
  );
};

export default App;
