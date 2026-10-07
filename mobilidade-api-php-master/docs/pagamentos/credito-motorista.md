## Adiciona quitação do motorista para com o gestor de de valor recebido em dinheiro via pix de forma automática
 
- Adiciona rota e service de compra de credito para conta de motorista
- Adiciona 11 novos codigo de erro para pix ```158```

+ Adiciona Controller ```app\controllers\DriverCreditController```
+ Adiciona Controller ```app\services\payment\account\DriverCreditService```

adiciona 2 novas rota para criação da transação de pix que fica pendente até o pagamento do mesmo e uma outra que permite consultar status da transação.

> Sempre que carregar a rota de verificar o saldo em conta do cliente há um script que irá verificar se o mesmo tem transações pendentes e irá consultar o status delas. As mesmas devem ser pagas no máximo 2h.

! Só é permitido a geração de pix quando usando a Adquirente 704pay