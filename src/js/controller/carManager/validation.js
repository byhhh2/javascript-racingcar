import { CAR_NAME_LENGTH } from "../../constants/games.js";

const isLengthOK = carName => {
  const { MIN, MAX } = CAR_NAME_LENGTH;

  return carName.length >= MIN && carName.length <= MAX;
};

export const isValidLength = carNameArr => {
  for (let i = 0; i < carNameArr.length; i++) {
    if (!carNameArr[i] || !isLengthOK(carNameArr[i])) {
      return false;
    }
  }

  return true;
};

export const isDuplicateName = carNameArr => {
  const carNameSet = new Set(carNameArr);

  if (carNameArr.length !== carNameSet.size) {
    return true;
  }

  return false;
};

export const isValidCarsName = carNameArr => {
  if (
    carNameArr.length <= 1 ||
    isDuplicateName(carNameArr) ||
    !isValidLength(carNameArr)
  ) {
    return false;
  }

  return true;
};
