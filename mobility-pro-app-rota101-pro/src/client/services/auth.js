export function signin() {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          token: 'sadsaddad4334342',
          user: {name: 'Emerson', email: 'emerson.jx13@gmail.com'},
        }),
      2000,
    );
  });
}
