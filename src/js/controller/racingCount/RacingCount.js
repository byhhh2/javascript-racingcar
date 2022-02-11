import { isInteger } from "./checkFunctions.js";
import Game from "../game/Game.js";
import {
  EVENT,
  EXCEPTIONS,
  RACING_COUNT,
  KEYBOARD,
} from "../../util/constants.js";
import {
  racingCountInput,
  racingCountSubmitButton,
} from "../../util/elements.js";

export default class RacingCount {
  constructor(cars) {
    this.init();
    this.addRacingCountInputEnterEvent();
    this.addRacingCountSubmitButtonClickEvent();
    this.cars = cars;
  }

  init() {
    this.racingCount = 0;
  }

  isValidRacingCount(racingCountInput) {
    if (
      !isInteger(racingCountInput) ||
      parseInt(racingCountInput) < RACING_COUNT.MIN
    ) {
      return false;
    }

    return true;
  }

  makeRacingCount() {
    if (
      !racingCountInput.value ||
      !this.isValidRacingCount(racingCountInput.value)
    ) {
      return alert(EXCEPTIONS.INCORRECT_RACING_COUNT);
    }

    this.racingCount = parseInt(racingCountInput.value);

    return true;
  }

  goNextStep() {
    racingCountInput.readOnly = true;
    racingCountSubmitButton.disabled = true;
    Game.getResult(this.cars, this.racingCount);
    Game.setResult(this.cars);
  }

  addRacingCountInputEnterEvent() {
    racingCountInput.addEventListener(EVENT.KEYUP, e => {
      if (e.keyCode === KEYBOARD.ENTER && this.makeRacingCount()) {
        this.goNextStep();
      }
    });
  }

  addRacingCountSubmitButtonClickEvent() {
    racingCountSubmitButton.addEventListener(EVENT.CLICK, () => {
      if (this.makeRacingCount()) {
        this.goNextStep();
      }
    });
  }
}
