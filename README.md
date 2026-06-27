# desafio-backend

---

# Uso:

**1. Clonar e baixar dep**

Clone o repositório e instale as dependências com o programa de preferência:

```bash
git clone https://github.com/pokerhawk/desafio-backend.git
```

instalar com o programa selecionado:

```bash
yarn
```

ou

```bash
npm install
```

---

**2. Database**

Com o docker + docker-compose instalados, inicialize o banco de dados:

Tenha certeza de que a porta 5432 (padrão) esteja disponivel

```bash
cd /FOLDER/WHERE/PROJECT/IS/desafio-backend/postgresDB/
docker-compose up -d
```

Aplique as migrations atraves do prisma, populando a DB com as tabelas:

```bash
npx prisma migrate dev
```

---

**3. Executar**

Tenha certeza de que a porta 8080 (padrão) esteja disponivel

```bash
yarn start:dev
```

ou


```bash
npm run start:dev
```

---

# DATABASE:

Table USER

```bash
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    mfaEnabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfaSecret TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    deletedAt TIMESTAMP
);
```

Table TROP

```bash
CREATE TABLE "Trip" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(100) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    flight_number VARCHAR(100) NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    route VARCHAR(255) NOT NULL,
    passengers INT NOT NULL,
    ticket_price INT NOT NULL,
    delay_minutes INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    deletedAt TIMESTAMP
);
```

Table N:N USER-TRIPS

```bash
CREATE TABLE "UserTrips" (
    userId UUID NOT NULL,
    tripId UUID NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (userId, tripId),

    CONSTRAINT fk_usertrip_user
        FOREIGN KEY (userId)
        REFERENCES "User"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_usertrip_trip
        FOREIGN KEY (tripId)
        REFERENCES "Trip"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

Table PASSENGER

```bash
CREATE TABLE "Passenger" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(255) NOT NULL UNIQUE,
    documentType VARCHAR(50) NOT NULL DEFAULT 'cpf',
    seat_number VARCHAR(20) NOT NULL,
    flight_class VARCHAR(50) NOT NULL DEFAULT 'economic',
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    deletedAt TIMESTAMP,

    tripId UUID NOT NULL,

    CONSTRAINT fk_passenger_trip
        FOREIGN KEY (tripId)
        REFERENCES "Trip"(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

---

# SQL:

**Diagrama Relacionamento**

```bash
┌────────────────────┐
│        User        │
├────────────────────┤
│ PK id              │
│ operator (UNIQUE)  │
│ email (UNIQUE)     │
│ password           │
│ mfaEnabled         │
│ mfaSecret          │
│ createdAt          │
│ updatedAt          │
│ deletedAt          │
└────────────────────┘
          │
          │  N:N
          │
          ▼
┌────────────────────┐
│     UserTrips      │
├────────────────────┤
│ PK/FK userId       │
│ PK/FK tripId       │
│ createdAt          │
└────────────────────┘
          ▲
          │
          │  N:N
          │
┌────────────────────┐
│        Trip        │
├────────────────────┤
│ PK id              │
│ status             │
│ destination        │
│ flight_number      │
│ departure_date     │
│ route              │
│ passengers         │
│ ticket_price       │
│ delay_minutes      │
│ createdAt          │
│ updatedAt          │
│ deletedAt          │
└────────────────────┘
          │
          │ 1:N
          │
          ▼
┌────────────────────┐
│     Passenger      │
├────────────────────┤
│ PK id              │
│ name               │
│ document (UNIQUE)  │
│ documentType       │
│ seat_number        │
│ flight_class       │
│ createdAt          │
│ updatedAt          │
│ deletedAt          │
│ FK tripId          │
└────────────────────┘
```

---

# SQL-QUERY

Query que retorne o destino (mais algumas informações adicionais) de todas as viagens com mais de 5 passageiros cadastrados na classe Primeira Classe:

```bash
SELECT DISTINCT t.id, t.status, t.flight_number, t.destination 
FROM "Trip" t
JOIN "Passenger" p
    ON p."tripId" = t.id
WHERE p.flight_class = 'first_class'
GROUP BY t.id, t.destination
HAVING COUNT(p.id) > 5;
```

---

# API:

**1. Lista de Endpoints:**

login:

```bash
POST public
http://localhost:8080/auth/login
body_example: {
	"email": "fulano@gmail.com",
	"password": "Abc@123"
}
```

register:

```bash
POST public
http://localhost:8080/auth/register
body_example: {
	"operator": "Fulano",
	"email": "fulano@gmail.com",
	"password": "Abc@123"
}
```

createPassenger:

```bash
POST auth JWT
http://localhost:8080/trips/passenger
body_example: {
	"trip_id": "TRIP_1001",
	"name": "fulano",
	"document": "MG757314",
	"documentType": "passport",
	"seat_number": "42",
	"flight_class": "first_class"
}
```

getPassengersPaginated:

```bash
GET auth JWT
http://localhost:8080/trips/passengers
params_example : {
	"name": "fulano",
	"document": "MG757314",
	"documentType": "passport",
	"flight_class": "first_class"
	"tripId": "TRIP_1001",
	"rows": 5,
	"page": 1,
}
```

getTripsPaginated:

```bash
GET auth JWT
http://localhost:8080/trips
params_example : {
	"trip_id": "TRIP_1001",
	"status": "awaiting",
	"departure_date": "2026-06-27",
	"rows": 5,
	"page": 1,
}
```

createTrip:

```bash
POST auth JWT
http://localhost:8080/trips/passenger
body_example: {
	"id": "TRIP_1001",
	"status": "awaiting",
	"destination": "São Paulo",
	"flight_number": "21",
	"departure_date": "2026-06-27",
	"route": "Rio de Janeiro - São Paulo",
	"passengers": 42,
	"ticket_price": 72,
	"delay_minutes": 12
}
```

analytics:

Este endpoint tambem alimenta o banco de dados com a planilha a primeira vez que é rodado (para conveniência)

```bash
POST auth JWT
http://localhost:8080/analytics
body_multipart_example: {
  file: example_file.csv
}
```
