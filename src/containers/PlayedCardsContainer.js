import React from "react";

const PlayedCardsContainer = ({ playedCards }) => {
  return (
    <div className="played-cards-container">
      <p>Played cards</p>
      {playedCards.map((card) => {
        return (
          <img
            className="small-card"
            src={`/cards/${card.imgName}.png`}
            alt={card.name}
            key={card.name}
          />
        );
      })}
    </div>
  );
};

export default PlayedCardsContainer;
