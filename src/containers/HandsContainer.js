import React from "react";

const HandsContainer = ({
  playersHands,
  isCardSelected,
  handleSelectCard,
  handlePlaySelectedCards,
  currentPlayer,
  handlePass,
}) => {
  return (
    <div className="hand-container">
      {Object.entries(playersHands).map(([playerNumber, playerHand]) => {
        return (
          <div
            key={playerNumber}
            className={currentPlayer !== playerNumber ? "hidden" : ""}
          >
            <h2>{`Player ${playerNumber} Hand`}</h2>
            {playerHand.map((card) => {
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

      {/* // let playersHandsValues = Object.values(playersHands);
  // return (
  //   <div className="hand-container">
  //     {playersHandsValues.map((playerHand, idx) => {
  //       let playerNumber = (idx + 1).toString();
  //       return (
  //         <div
  //           key={playerNumber}
  //           className={currentPlayer !== playerNumber ? "hidden" : ""}
  //         >
  //           <h2>{`Player ${playerNumber} Hand`}</h2>
  //           {playerHand.map((card) => {
  //             return (
  //               <img
  //                 className={
  //                   "small-card hand " +
  //                   (isCardSelected(card) ? "selected-card" : "")
  //                 }
  //                 src={`/imgs/cards/${card.imgName}.png`}
  //                 alt={card.name}
  //                 key={card.name}
  //                 onClick={() => handleSelectCard(card)}
  //               />
  //             );
  //           })}
  //         </div>
  //       );
  //     })}
   */}
      <br></br>
      <button onClick={() => handlePlaySelectedCards(currentPlayer)}>
        Play selected cards!
      </button>
      <button onClick={() => handlePass(currentPlayer)}>Pass this round</button>
    </div>
  );
};

export default HandsContainer;
