import React from "react";

const PlayedCardsContainer = ({ playedCards }) => {
  return (
    <div className="played-cards-container">
      <h2>Played cards</h2>
      {playedCards.map((cards, idx) => {
        return (
          <div key={idx + 1}>
            {cards.map((card) => {
              return (
                <img
                  className="small-card"
                  src={`/imgs/cards/${card.imgName}.png`}
                  alt={card.name}
                  key={card.name}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PlayedCardsContainer;
