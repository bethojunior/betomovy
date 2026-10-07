# 🧠 Pulse Middleware – Monitoramento de Logs, Erros e Performance

Este diretório contém middlewares reutilizáveis que integram a aplicação com o serviço **Pulse**, para registrar logs de console, erros globais, falhas HTTP, lentidão de requisições e eventos de socket.

---

## 📆 Visão Geral dos Arquivos

| Arquivo                       | Responsabilidade                                                   |
| ----------------------------- | ------------------------------------------------------------------ |
| `setupConsoleInterceptor.ts`  | Intercepta `console.log`, `warn`, `error`, etc. e envia para Pulse |
| `setupGlobalErrorHandling.ts` | Captura erros fatais JS e promessas rejeitadas sem catch           |
| `applyPulseInterceptors.ts`   | Middleware de Axios para logar erros e lentidão                    |
| `monitorPerformance.ts`       | Mede tempo de execução de funções manuais                          |
| `socketMonitor.ts`            | Observa eventos de conexão, erro e desconexão de socket            |

---

## ✅ Como usar cada middleware

### 🔹 `setupConsoleInterceptor`

```ts
import { setupConsoleInterceptor } from './middleware/consoleInterceptor';

setupConsoleInterceptor();
```

> Intercepta todos os `console.log`, `warn`, `info`, `error` e envia para o Pulse. Ideal para detectar logs inesperados em produção.

---

### 🔹 `setupGlobalErrorHandling`

```ts
import { setupGlobalErrorHandling } from './middleware/setupGlobalErrorHandling';

setupGlobalErrorHandling();
```

> Captura erros JS fatais (`throw new Error`) e promessas rejeitadas sem `.catch()`. Deve ser usado no início do app (ex: `App.tsx` ou `index.ts`).

---

### 🔹 `applyPulseInterceptors` (Axios)

```ts
import axios from 'axios';
import { applyPulseInterceptors } from './middleware/applyPulseInterceptors';

const api = axios.create({ baseURL: 'https://sua-api.com' });
applyPulseInterceptors(api, 'api-nome');

export default api;
```

> Registra erros HTTP e requisições lentas que ultrapassam 1500ms.

---

### 🔹 `monitorPerformance`

```ts
import { monitorPerformance } from './middleware/monitorPerformance';

await monitorPerformance('Carregar perfil do usuário', () =>
  api.get('/user/profile')
);
```

> Mede o tempo de execução de qualquer função ou chamada assíncrona. Útil para detectar gargalos fora do Axios, como cache, pré-carregamento ou processamento.

---

### 🔹 `monitorSocket`

```ts
import { monitorSocket } from './middleware/socketMonitor';

monitorSocket(socketInstance, {
  context: 'driver-socket',
  userId: '1234',
});
```

> Loga automaticamente eventos importantes do socket: conexão, erro, desconexão. Ideal para apps com tempo real.

---

## 💡 Boas práticas

- **Evite logs redundantes:** não use `monitorPerformance` em tudo — só onde realmente importa.
- **Use nomes de contexto** (`context: 'driver-socket'`) para separar logs por origem.
- **Ative apenas em produção** se quiser evitar poluição de logs locais (`__DEV__`).

---

## 📁 Exemplo de inicialização no `App.tsx`

```ts
import { setupConsoleInterceptor } from './middleware/consoleInterceptor';
import { setupGlobalErrorHandling } from './middleware/setupGlobalErrorHandling';

setupConsoleInterceptor();
setupGlobalErrorHandling();
```

---



