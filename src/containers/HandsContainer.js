import React from "react";

const HandsContainer = ({
  // hands,
  handsValues,
  selectedCards,
  isCardSelected,
  handleSelectCard,
  handlePlaySelectedCards,
  currentPlayer,
  handlePass,
}) => {
  return (
    <div className="hand-container">
      {handsValues.map((hand, idx) => {
        let playerNumber = (idx + 1).toString();
        return (
          <div
            key={playerNumber}
            className={currentPlayer !== playerNumber ? "hidden" : ""}
          >
            <h4>{`Player ${playerNumber} Hand`}</h4>
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
      <button onClick={() => handlePass(currentPlayer)}>Pass this round</button>
    </div>
  );
};

export default HandsContainer;
