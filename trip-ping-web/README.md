# TripPing Web

Front-end React da agenda pessoal de viagens TripPing. A aplicação utiliza JSX, estado, componentização, CSS Modules e `fetch` nativo para consumir a API.

As únicas dependências de execução são React e React DOM. Os dados de usuários e viagens vêm do back-end; não existe uma base simulada como fonte principal.

## Pré-requisitos

- Node.js e npm instalados.
- API TripPing executando, normalmente em `http://localhost:8080`.

## Variáveis de ambiente

O Vite lê variáveis definidas em um arquivo `.env` dentro da pasta `trip-ping-web`.

Crie o arquivo a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Configuração recomendada para desenvolvimento:

```env
VITE_API_BASE_URL=/api
```

Com `/api`, o navegador envia as requisições para o Vite e o proxy de desenvolvimento encaminha tudo para `http://localhost:8080`. Essa configuração está em `vite.config.js`.

Se o front for executado sem o proxy, informe a URL completa:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Nesse caso, o back-end precisa permitir a origem do front pelo CORS.

> Variáveis do Vite precisam começar com `VITE_`. Reinicie `npm run dev` depois de alterar o `.env`.

## Instalar e executar

No PowerShell, dentro de `trip-ping-web`:

```powershell
npm install
npm run dev
```

Abra `http://localhost:5173`.

O front precisa do back-end e do PostgreSQL ativos para identificar usuários e carregar a agenda.

## Fluxo principal

1. Informe um e-mail.
2. Se o usuário não existir, informe o nome para criar a agenda.
3. Cadastre uma viagem pelo botão **Anotar viagem**.
4. A agenda consulta a API e exibe os dados persistidos no PostgreSQL.
5. As viagens também podem ser editadas ou apagadas.

## Cadastro de viagem

O formulário possui seis campos: destino, data de ida, data de volta, moeda, status e anotações.

## Comandos disponíveis

```powershell
npm run dev      # servidor de desenvolvimento
npm run lint     # análise do código
npm run build    # build de produção
npm run preview  # prévia do build
```

## Integração

As chamadas HTTP ficam em `src/services/httpClient.js` e `src/services/travelService.js`. O contrato completo está em `../docs/API.md`.

## Problemas comuns

- **Erro ao identificar usuário:** confirme que a API está ativa na porta `8080`.
- **Erro ao abrir a agenda:** confirme que o PostgreSQL está ativo e que o back-end conectou ao banco.
- **Alteração no `.env` sem efeito:** encerre e execute `npm run dev` novamente.
- **Erro de CORS usando URL completa:** confira `CORS_ORIGEM_PERMITIDA` no back-end.
