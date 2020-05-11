import React from "react";

const HeaderContainer = ({ handleDealCards }) => {
  return (
    <div className="header-container">
      <button onClick={() => handleDealCards()}>Deal a new hand!</button>
    </div>
  );
};

export default HeaderContainer;
