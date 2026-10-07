describe("Test Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("captcha sum number correctly", () => {
    cy.get('[data-test="button-login"]').should("not.exist");

    cy.wait(1500);
    cy.get('[data-test="text-numbers-captcha"]')
      .invoke("text")
      .as("textCaptcha");

    cy.get("@textCaptcha").then((text: any) => {
      const teste = text.replace("Soma", "").trim().split("+");
      const firstNumber = Number(teste[0]);
      const secondNumber = Number(teste[1]);

      const resultSum = String(firstNumber + secondNumber);

      cy.wait(1500);

      cy.get('[data-test="input-sum-captcha"]').type(resultSum);

      cy.wait(1500);

      cy.get('[data-test="button-check-captcha"]').click();

      cy.get('[data-test="button-login"]').should("exist");
    });
  });

  it("captcha sum number incorrectly", () => {
    cy.get('[data-test="button-login"]').should("not.exist");

    cy.wait(1500);
    cy.get('[data-test="text-numbers-captcha"]')
      .invoke("text")
      .as("textCaptcha");

    cy.get("@textCaptcha").then((text: any) => {
      const teste = text.replace("Soma", "").trim().split("+");
      const firstNumber = Number(teste[0]);
      const secondNumber = Number(teste[1]);

      const resultSum = String(firstNumber + secondNumber + 1);

      cy.wait(1500);

      cy.get('[data-test="input-sum-captcha"]').type(resultSum);

      cy.wait(1500);

      cy.get('[data-test="button-check-captcha"]').click();

      cy.get('[data-test="button-login"]').should("not.exist");
    });
  });
});
