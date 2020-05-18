import React from "react";

const GameLogContainer = ({ gameLog }) => {
  return (
    <div className="game-log-container">
      <h2>Game Log</h2>
      {gameLog.map((log) => {
        return <p key={100000000 * Math.random()}>{`• ${log}`}</p>;
      })}
    </div>
  );
};

export default GameLogContainer;
