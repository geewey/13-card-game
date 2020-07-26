import React from "react";

const HeaderContainer = ({ handleDealCards, displayRules }) => {
  return (
    <div className="header-container">
      <h2 className="app-title">Thirteen Card Game!</h2>
      <button className="deal-button" onClick={() => handleDealCards()}>
        Deal a new hand!
      </button>
      <button className="rules-button" onClick={() => displayRules()}>
        Explain rules!
      </button>
    </div>
  );
};

export default HeaderContainer;
