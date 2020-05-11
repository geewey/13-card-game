import React from "react";

const HandsContainer = ({
  hands,
  selectedCards,
  isCardSelected,
  handleSelectCard,
  handlePlaySelectedCards,
}) => {
  return (
    <div className="hand-container">
      <p>Your hand (13 random cards)</p>
      {hands.map((card) => {
        return (
          <img
            className={
              "small-card hand " + (isCardSelected(card) ? "selected-card" : "")
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
  );
};

export default HandsContainer;
