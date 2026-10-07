// @ts-nocheck

export const AskChatBot = (question: string) => {
  const chatBot = document.querySelector(".chat-bot");

  const cleverChat = document.getElementsByTagName("clever-chatbot")[0];

  if (cleverChat) {
    if (cleverChat?.shadowRoot?.children[0]?.children[2].children[0]) {
      const buttonToggleChat =
        cleverChat?.shadowRoot?.children[0]?.children[2].children[0];

      buttonToggleChat.click();
    }

    if (
      cleverChat?.shadowRoot?.children[0]?.children[1].children[1].shadowRoot
        ?.children[1].children[0]
    ) {
      const inputMessage = cleverChat.shadowRoot.children[0].children[1]
        .children[1].shadowRoot.children[1].children[0] as HTMLInputElement;

      inputMessage.value = question;
    }
  }
};
