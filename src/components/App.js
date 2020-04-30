import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [hand, setHand] = useState([]);

  const allCardsArray = [];

  const code = "1h";
  const cardName = "whatever";
  // create a button to "deal" cards
  // show all cards
  // create a button to "undeal cards"

  return (
    <div>
      <p>Your hand</p>
      <img className="small-card" src={`/cards/${code}.png`} alt={cardName} />
    </div>
  );
};

export default App;
