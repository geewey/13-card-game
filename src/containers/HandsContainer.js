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
      {hands.map((hand, idx) => {
        return (
          <div key={idx}>
            <p>{`Player ${idx + 1} Hand`}</p>
            {hand.map((card) => {
              return (
                <img
                  className={
                    "small-card hand " +
                    (isCardSelected(card) ? "selected-card" : "")
                  }
                  src={`/imgs/cards/${card.imgName}.png`}
                  alt={card.name}
                  key={card.name}
                  onClick={() => handleSelectCard(card)}
                />
              );
            })}
          </div>
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
