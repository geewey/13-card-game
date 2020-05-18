const someCardsAreSelected = (arr) => {
  return arr.length > 0 ? true : false;
};

const firstPlayerPlays3Spades = (arr) => {
  if (!arr.some((card) => card.name === "3 Spades")) return false;
  return true;
};

const cardsAreSame = (arr) => {
  if (!arr.every((card) => card.order === arr[0].order)) return false;
  return true;
};

const noTwosAreSelected = (arr) => {
  if (arr.some((card) => card.order === 13)) {
    console.log("2s not allowed in straight!");
    return false;
  }
  return true;
};

const singlesAreConsecutive = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].order - arr[i - 1].order !== 1) {
      return false;
    }
  }
  return true;
};

const doublesAreConsecutive = (arr) => {
  for (let i = 1; i < arr.length; i = i + 2) {
    if (arr[i].order - arr[i - 1].order !== 0) {
      return false;
    }
  }
  for (let i = 1; i < arr.length - 3; i = i + 2) {
    if (arr[i + 1].order - arr[i].order !== 1) {
      return false;
    }
  }
  return true;
};

const triplesAreConsecutive = (arr) => {
  for (let i = 2; i < arr.length; i = i + 3) {
    if (!cardsAreSame([arr[i], arr[i - 1], arr[i - 2]])) {
      return false;
    }
  }
  for (let i = 2; i < arr.length - 3; i = i + 3) {
    if (arr[i + 1].order - arr[i].order !== 1) {
      return false;
    }
  }
  return true;
};

// Valid combos:
// 1. any single, double, triple, quad of the same card
// 2. straights of 3+ consecutive singles (2s cannot be included in straights)
// 3. straights of 3+ consecutive doubles (2s cannot be included in straights)
// 4. straights of 3+ consecutive triples (2s cannot be included in straights)
const comboIsASingle = (cards) => {
  return cards.length === 1;
};
const comboIsADouble = (cards) => {
  return cards.length === 2 && cardsAreSame(cards);
};
const comboIsATriple = (cards) => {
  return cards.length === 3 && cardsAreSame(cards);
};
const comboIsAQuad = (cards) => {
  return cards.length === 4 && cardsAreSame(cards);
};
const comboIsStraightOfSingles = (cards) => {
  return (
    cards.length >= 3 &&
    singlesAreConsecutive(cards) &&
    noTwosAreSelected(cards)
  );
};
const comboIsStraightOfDoubles = (cards) => {
  return (
    cards.length >= 6 &&
    cards.length % 2 === 0 &&
    doublesAreConsecutive(cards) &&
    noTwosAreSelected(cards)
  );
};
const comboIsStraightOfTriples = (cards) => {
  return (
    cards.length >= 9 &&
    cards.length % 3 === 0 &&
    triplesAreConsecutive(cards) &&
    noTwosAreSelected(cards)
  );
};

const comboOfSelectedCards = (cards) => {
  if (comboIsASingle(cards)) return "single";
  if (comboIsADouble(cards)) return "double";
  if (comboIsATriple(cards)) return "triple";
  if (comboIsAQuad(cards)) return "quad";
  if (comboIsStraightOfSingles(cards)) return "single straight";
  if (comboIsStraightOfDoubles(cards)) return "double straight";
  if (comboIsStraightOfTriples(cards)) return "triple straight";
  return false;
};

export { someCardsAreSelected, firstPlayerPlays3Spades, comboOfSelectedCards };
