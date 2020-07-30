import React from "react";

const GameLogContainer = ({ gameLog }) => {
  return (
    <div className="game-log-container">
      <h2>Game Log</h2>
      {gameLog.map((log) => {
        if (log.includes("http")) {
          let index = log.indexOf("https");
          let url = log.slice(index);
          let message = log.slice(0, index);
          return (
            <p key={100000000 * Math.random()}>
              {`• ${message}`}{" "}
              <a
                href={`${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="url"
              >{`${url}`}</a>
            </p>
          );
        } else {
          return <p key={100000000 * Math.random()}>{`• ${log}`}</p>;
        }
      })}
    </div>
  );
};

export default GameLogContainer;
