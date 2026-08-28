# TripPing API

API REST da agenda TripPing, desenvolvida com Java 21, Spring Boot, Spring Web MVC, `JdbcTemplate` e PostgreSQL. O projeto não utiliza JPA ou Hibernate.

## Pré-requisitos

- Java 21.
- PostgreSQL instalado e em execução.
- Banco de dados chamado `tripping`.

## Criar o banco

Crie um banco vazio pelo pgAdmin ou pelo `psql`:

```powershell
psql -U postgres -c "CREATE DATABASE tripping;"
```

Ao iniciar a API, o Spring executa automaticamente `src/main/resources/schema.sql`. O arquivo cria as tabelas `app_user` e `trip`, seus relacionamentos, índices e validações.

O script também remove a antiga coluna `phone`, que não faz mais parte do sistema. Se uma instalação antiga possuir usuários sem e-mail, corrija esses registros antes de executar a migração.

## Variáveis de ambiente

O `application.properties` lê:

| Variável | Finalidade | Valor padrão |
|---|---|---|
| `DB_URL` | URL JDBC do PostgreSQL | `jdbc:postgresql://localhost:5432/tripping` |
| `DB_USUARIO` | Usuário do PostgreSQL | `postgres` |
| `DB_SENHA` | Senha do PostgreSQL | `postgres` |
| `CORS_ORIGEM_PERMITIDA` | Origem autorizada do front | `http://localhost:5173` |

Defina as variáveis no PowerShell antes de executar a API:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/tripping"
$env:DB_USUARIO="postgres"
$env:DB_SENHA="sua_senha"
$env:CORS_ORIGEM_PERMITIDA="http://localhost:5173"
```

Elas valem para o terminal atual. No IntelliJ, abra a configuração da classe `Application` e adicione as mesmas chaves em **Environment variables**.

Não coloque senhas reais no `application.properties` nem envie arquivos com credenciais ao Git.

## Executar a API

No PowerShell, dentro de `tripping.app`:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8080/api`.

## Compilar

```powershell
.\mvnw.cmd -DskipTests compile
```

## Endpoints

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/api/users/identify` | Identificar usuário pelo e-mail |
| POST | `/api/users` | Cadastrar usuário |
| GET | `/api/users/{usuarioId}/trips` | Listar viagens |
| POST | `/api/users/{usuarioId}/trips` | Cadastrar viagem |
| PUT | `/api/trips/{viagemId}` | Atualizar viagem |
| DELETE | `/api/trips/{viagemId}` | Excluir viagem |

Requisições, respostas, parâmetros, validações e códigos HTTP estão em `../docs/API.md`.

## Estrutura principal

```text
src/main/java/school/sptech/tripping/app/
├── config/       # CORS
├── controller/   # endpoints REST
├── dto/          # corpos recebidos
├── exception/    # erros padronizados
├── model/        # modelos
├── repository/   # SQL e JdbcTemplate
└── service/      # validações e regras de negócio
```

## Problemas comuns

- **Falha de autenticação:** confira `DB_USUARIO` e `DB_SENHA`.
- **Banco inexistente:** crie `tripping` ou ajuste `DB_URL`.
- **Porta ocupada:** encerre o processo na porta `8080` antes de iniciar a API.
- **CORS bloqueado:** confira se `CORS_ORIGEM_PERMITIDA` corresponde exatamente à URL do front.
- **Falha ao migrar banco antigo:** verifique se existem usuários com `email` nulo.
