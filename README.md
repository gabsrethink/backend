# API - Lista de Filmes

Este é o back-end para a aplicação de Lista de Filmes, desenvolvido como parte de um desafio. A API gerencia a autenticação de usuários (via Firebase), a interação com a API do The Movie Database (TMDb) e o armazenamento/compartilhamento de listas de filmes favoritos.

## Tecnologias Principais

- Node.js: Ambiente de execução JavaScript no servidor.

- TypeScript: Superset do JavaScript que adiciona tipagem estática.

- Express: Framework web minimalista para Node.js, usado para criar a API REST.

- Prisma: ORM (Object-Relational Mapper) moderno para Node.js e TypeScript. Facilita a interação com o banco de dados.

- PostgreSQL: Banco de dados relacional utilizado (hospedado no Neon para deploy).

- Firebase Admin SDK: Utilizado no back-end para verificar os tokens de autenticação gerados pelo Firebase Authentication no front-end.

- Axios: Cliente HTTP baseado em Promises para fazer chamadas à API do TMDb.

- CORS: Middleware para habilitar o Cross-Origin Resource Sharing, permitindo que o front-end (em outro domínio) acesse a API.

- Vercel: Plataforma de deploy utilizada para hospedar a API como funções serverless.

## Estrutura do Projeto
```bash
/backend
├── api/
│   └── index.ts         # Ponto de entrada principal do Express (configurado para Vercel)
│
├── prisma/
│   ├── schema.prisma    # Definição dos modelos de dados (User, FavoriteList)
│   └── migrations/      # Histórico de migrações do banco de dados
│
├── src/
│   ├── routes/          # Definição dos endpoints da API
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── favorites.routes.ts
│   │   ├── movies.routes.ts
│   │   └── share.routes.ts
│   │
│   ├── controllers/     # Lógica de negócio para cada rota
│   │   ├── auth.controller.ts
│   │   ├── favorites.controller.ts
│   │   ├── movies.controller.ts
│   │   └── share.controller.ts
│   │
│   ├── middlewares/     # Funções que rodam antes dos controllers (ex: autenticação)
│   │   ├── decodeFirebaseToken.ts # Verifica o token JWT do Firebase
│   │   └── findUserInDb.ts        # Busca o usuário no banco Prisma a partir do token
│   │
│   └── lib/             # Módulos de utilidade e configuração
│       ├── prisma.ts        # Instância singleton do PrismaClient
│       ├── firebaseAdmin.ts # Inicialização do Firebase Admin SDK
│       └── tmdbApi.ts       # Instância pré-configurada do Axios para o TMDb
│
├── types/                 # Definições de tipos TypeScript (ex: extensão do Request do Express)
│
├── .env                   # Arquivo para variáveis de ambiente locais
├── .gitignore
├── package.json
├── tsconfig.json          # Configuração do compilador TypeScript
└── vercel.json            # Configuração de deploy para a Vercel
```

## Configuração Local

Clone o repositório: (Se aplicável)

```bash
git clone <url-do-repositorio>
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure as Variáveis de Ambiente:

- Crie um arquivo .env na raiz do projeto.

- Copie o conteúdo do arquivo .env.example (se existir) ou adicione as seguintes variáveis:

```bash
# URL de conexão do seu banco de dados PostgreSQL (local ou Neon/Supabase)
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"

# Tokens da API do TMDb (V4 Read Access Token é recomendado)
TMDB_API_KEY="sua_chave_v3_aqui"
TMDB_API_READ_TOKEN="seu_token_de_leitura_v4_completo_aqui"

# Configuração do Firebase Admin SDK (JSON gerado no Console do Firebase)
# Cole o conteúdo COMPLETO do JSON como uma string de linha única
FIREBASE_ADMIN_SDK_CONFIG='{"type": "service_account", ...}'
```

Execute as Migrações do Prisma:
Este comando cria as tabelas (User, FavoriteList) no seu banco de dados com base no prisma/schema.prisma.
```bash
npx prisma migrate dev --name init
```

Inicie o Servidor de Desenvolvimento:
```bash
npm run dev
```

A API estará rodando em http://localhost:3001 (ou a porta definida).

### Endpoints da API

A base da URL em produção é a URL fornecida pela Vercel (https://backend-delta-ebon-36.vercel.app). Em desenvolvimento, é http://localhost:3001.

Autenticação: A maioria das rotas requer um Bearer Token (JWT do Firebase) no cabeçalho Authorization. Um token de teste (SUPER_SECRET_TOKEN_FOR_POSTMAN) pode ser usado em desenvolvimento (configurado em src/middlewares/decodeFirebaseToken.ts).

#### Autenticação (/auth)

- POST /auth/sync
    - Descrição: Sincroniza um usuário autenticado pelo Firebase com o banco de dados local. Cria um novo registro User e FavoriteList se o usuário for novo.

    - Proteção: Requer Bearer Token válido do Firebase.

    - Corpo: Nenhum.

    - Resposta (Sucesso): 201 Created (usuário novo) ou 200 OK (usuário existente) com os dados do usuário do Prisma.

    - Resposta (Erro): 401 Unauthorized (token inválido), 500 Internal Server Error.

#### Filmes (/movies)

- GET /movies/trending

    - Descrição: Retorna a lista de filmes em alta (trending) do dia, buscados do TMDb.

    - Proteção: Requer Bearer Token.

    - Query Params: Nenhum.

    - Resposta (Sucesso): 200 OK com a resposta da API do TMDb (incluindo results com a lista de filmes).

    - Resposta (Erro): 401 Unauthorized, 502 Bad Gateway (erro ao falar com TMDb), 500 Internal Server Error.

- GET /movies/search

    - Descrição: Busca filmes no TMDb com base em uma query.

    - Proteção: Requer Bearer Token.

    - Query Params: query (string, obrigatório) - O termo a ser buscado.

    - Resposta (Sucesso): 200 OK com a resposta da API do TMDb.

    - Resposta (Erro): 400 Bad Request (falta query), 401 Unauthorized, 502 Bad Gateway, 500 Internal Server Error.

- GET /movies/details/:id

    - Descrição: Retorna os detalhes completos de um filme específico do TMDb, incluindo créditos (diretores) e datas de lançamento (classificação).

    - Proteção: Requer Bearer Token.

    - Path Params: id (number, obrigatório) - O ID do filme no TMDb.

    - Resposta (Sucesso): 200 OK com o objeto de detalhes do filme do TMDb.

    - Resposta (Erro): 401 Unauthorized, 404 Not Found (filme não encontrado no TMDb), 502 Bad Gateway, 500 Internal Server Error.

    - Favoritos (/favorites)

- GET /favorites

    - Descrição: Retorna a lista de filmes favoritos do usuário autenticado, incluindo os detalhes completos de cada filme (buscados do TMDb) e o shareId da lista.

    - Proteção: Requer Bearer Token.

    - Resposta (Sucesso): 200 OK com { movieDetails: Movie[], shareId: string }.

    - Resposta (Erro): 401 Unauthorized, 404 Not Found (lista não encontrada), 502 Bad Gateway, 500 Internal Server Error.

- POST /favorites/add

    - Descrição: Adiciona um filme à lista de favoritos do usuário.

    - Proteção: Requer Bearer Token.

    - Corpo: { "movieId": number } (ID do filme no TMDb).

    - Resposta (Sucesso): 200 OK com { movieIds: number[] } (a lista de IDs atualizada - Nota: Pode precisar atualizar para retornar a lista completa).

    - Resposta (Erro): 400 Bad Request (falta movieId), 401 Unauthorized, 500 Internal Server Error.

- POST /favorites/remove

    - Descrição: Remove um filme da lista de favoritos do usuário.

    - Proteção: Requer Bearer Token.

    - Corpo: { "movieId": number } (ID do filme no TMDb).

    - Resposta (Sucesso): 200 OK com { movieIds: number[] } (a lista de IDs atualizada - Nota: Pode precisar atualizar para retornar a lista completa).

    - Resposta (Erro): 400 Bad Request (falta movieId), 401 Unauthorized, 500 Internal Server Error.

    - Compartilhamento (/share)

- GET /share/:shareId

    - Descrição: Rota pública que retorna os detalhes completos dos filmes de uma lista de favoritos compartilhada.

    - Proteção: Nenhuma.

    - Path Params: shareId (string, obrigatório) - O ID de compartilhamento único da lista.

    - Resposta (Sucesso): 200 OK com { movieDetails: Movie[] }.

    - Resposta (Erro): 404 Not Found (lista não encontrada), 502 Bad Gateway, 500 Internal Server Error.

## Deploy

O projeto está configurado para deploy na Vercel. É crucial configurar as mesmas Variáveis de Ambiente (DATABASE_URL, TMDB_API_READ_TOKEN, FIREBASE_ADMIN_SDK_CONFIG) nas configurações do projeto na Vercel.

O ficheiro vercel.json gerencia o roteamento e o build na plataforma. O script build (ou postinstall) no package.json garante que o prisma generate seja executado durante o deploy.