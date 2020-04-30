import React, { useState } from "react";
import allCards from "../helpers/cardData";
import "./App.css";

const App = () => {
  const [hand, setHand] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);

  // logic for dealing a hand with 13 random cards
  const dealHand = (allCards) => {
    let hand = [];
    let availableCards = [...allCards];

    while (hand.length < 13) {
      let randomCard =
        availableCards[Math.floor(Math.random() * availableCards.length)];

      hand.push(randomCard);
      availableCards = availableCards.filter((card) => randomCard !== card);
    }
    setHand(hand);
  };

  // logic for selecting a card
  const handleSelectCard = (card) => {
    console.log(card);
  };

  // HeaderContainer for "Deal button" logic
  const handleDeal = (allCards) => {
    dealHand(allCards);
  };

  return (
    <div>
      <div>
        {/* clears played cards, assigns 13 new random cards */}
        <button onClick={() => handleDeal(allCards)}>Deal button</button>
      </div>
      <div>
        <p>Your hand (13 random cards)</p>
        {hand.map((card) => {
          return (
            <img
              className="small-card"
              src={`/cards/${card.code}.png`}
              alt={card.name}
              key={card.name}
              onClick={() => handleSelectCard(card)}
            />
          );
        })}
      </div>
      <div>
        <p>Played cards</p>
      </div>
    </div>
  );
};

export default App;
