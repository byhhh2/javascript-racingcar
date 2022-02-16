const baseUrl = "../../index.html";
const SELECTOR = {
  CAR_NAMES_INPUT: "#car-names-input",
  CAR_NAMES_SUBMIT: "#car-names-submit",
  RACING_COUNT_INPUT: "#racing-count-input",
  RACING_COUNT_SUBMIT: "#racing-count-submit",
  RACING_RESULT: "#racing-result",
  RACING_WINNER: "#racing-winner",
  RESTART_BUTTON: "#restart-button",
};

const submitCarNames = carNames => {
  const { CAR_NAMES_INPUT, CAR_NAMES_SUBMIT } = SELECTOR;

  cy.get(CAR_NAMES_INPUT).type(carNames);
  cy.get(CAR_NAMES_SUBMIT).click();
  cy.get(CAR_NAMES_INPUT).should("have.attr", "readonly", "readonly");
  cy.get(CAR_NAMES_SUBMIT).should("have.attr", "disabled", "disabled");
};

const submitRacingCount = racingCnt => {
  const { RACING_COUNT_INPUT, RACING_COUNT_SUBMIT } = SELECTOR;

  cy.get(RACING_COUNT_INPUT).type(racingCnt);
  cy.get(RACING_COUNT_SUBMIT).click();
  cy.get(RACING_COUNT_INPUT).should("have.attr", "readonly", "readonly");
  cy.get(RACING_COUNT_SUBMIT).should("have.attr", "disabled", "disabled");
};

const submitCarNamesAlert = () => {
  const alertStub = cy.stub();

  cy.on("window:alert", alertStub);
  cy.get(SELECTOR.CAR_NAMES_SUBMIT)
    .click()
    .then(() => {
      expect(alertStub).to.be.called;
    });
};

const submitRacingCountAlert = () => {
  const alertStub = cy.stub();

  cy.on("window:alert", alertStub);
  cy.get(SELECTOR.RACING_COUNT_SUBMIT)
    .click()
    .then(() => {
      expect(alertStub).to.be.called;
    });
};

const countLocation = () => {
  let movieCount, haleeCount;

  cy.get("#movie-container")
    .find(".position-arrow")
    .then(position => {
      movieCount = Cypress.$(position).length;
    })
    .then(() => {
      cy.get("#halee-container")
        .find(".position-arrow")
        .then(position => {
          haleeCount = Cypress.$(position).length;
          getWinner(movieCount, haleeCount);
        });
    });
};

const getWinner = (movieCount, haleeCount) => {
  const { RACING_WINNER } = SELECTOR;

  if (movieCount > haleeCount) {
    cy.get(RACING_WINNER).should("have.text", "movie");
  } else if (movieCount < haleeCount) {
    cy.get(RACING_WINNER).should("have.text", "halee");
  } else if (movieCount === haleeCount) {
    cy.get(RACING_WINNER).should("have.text", "movie, halee");
  }
};

describe("정상 시나리오에 대해 만족해야 한다.", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  afterEach(() => {
    cy.reload();
  });

  it("사용자가 자동차 이름을 쉼표로 구분하여 5자 이하로 알맞게 입력했을 경우, 성공적으로 입력창이 비활성화 상태가 된다.", () => {
    submitCarNames("movie, halee");
  });

  it("사용자가 레이싱 횟수를 1이상 정수로 입력했을 경우, 성공적으로 입력창이 비활성화 상태가 된다.", () => {
    submitCarNames("movie, halee");
    submitRacingCount(10);
  });

  it("게임을 종료되면 우승자를 확인할 수 있어야 한다.", () => {
    submitCarNames("movie, halee");
    submitRacingCount(10);
    countLocation();
  });

  it("'다시 시작하기' 버튼을 누르면 화면 내의 모든 값이 초기화되어야 한다.", () => {
    const {
      CAR_NAMES_INPUT,
      RACING_COUNT_INPUT,
      RACING_RESULT,
      RACING_WINNER,
      RESTART_BUTTON,
    } = SELECTOR;
    submitCarNames("movie, halee");
    submitRacingCount(10);
    cy.get(RESTART_BUTTON).click();
    cy.get(CAR_NAMES_INPUT).should("have.value", "");
    cy.get(RACING_COUNT_INPUT).should("have.value", "");
    cy.get(RACING_RESULT).should("have.value", "");
    cy.get(RACING_WINNER).should("have.value", "");
  });
});

describe("비정상 시나리오에 대해서는 사용자에게 경고를 준다.", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  afterEach(() => {
    cy.reload();
  });

  it("자동차 이름이 아무것도 입력되지 않았을 경우 사용자에게 경고를 준다.", () => {
    submitCarNamesAlert();
  });

  it("자동차 이름의 길이가 5자를 초과했을 경우 사용자에게 경고를 준다.", () => {
    const invalidInput = "loveracingcar";

    cy.get(SELECTOR.CAR_NAMES_INPUT).type(invalidInput);
    submitCarNamesAlert();
  });

  it("중복된 이름의 자동차가 입력될 경우 사용자에게 경고를 준다.", () => {
    const invalidInput = "woowa,course,woowa";

    cy.get(SELECTOR.CAR_NAMES_INPUT).type(invalidInput);
    submitCarNamesAlert();
  });

  it("레이싱 횟수가 정수가 아닌 경우 사용자에게 경고를 준다.", () => {
    const invalidInput = 12.5;

    submitCarNames("movie, halee");
    cy.get(SELECTOR.RACING_COUNT_INPUT).type(invalidInput);
    submitRacingCountAlert();
  });

  it("레이싱 횟수가 1이상의 수가 아닌 경우 사용자에게 경고를 준다.", () => {
    const invalidInput = 0;

    submitCarNames("movie, halee");
    cy.get(SELECTOR.RACING_COUNT_INPUT).type(invalidInput);
    submitRacingCountAlert();
  });
});
