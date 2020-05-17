const someCardsAreSelected = (arr) => {
  if (arr.length === 0) return false;
  return true;
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
    console.log("2s not allowed in run!");
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

export {
  someCardsAreSelected,
  firstPlayerPlays3Spades,
  cardsAreSame,
  noTwosAreSelected,
  singlesAreConsecutive,
  doublesAreConsecutive,
  triplesAreConsecutive,
};
