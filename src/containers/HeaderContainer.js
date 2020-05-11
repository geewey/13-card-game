import React from "react";

const HeaderContainer = ({ handleDealCards, displayRules }) => {
  return (
    <div className="header-container">
      <button onClick={() => handleDealCards()}>Deal a new hand!</button>
      <button onClick={() => displayRules()}>Explain rules!</button>
    </div>
  );
};

export default HeaderContainer;
