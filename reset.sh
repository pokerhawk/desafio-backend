cd postgresDB
docker compose down
docker compose up -d
cd ..
rm -r prisma/migrations/
wait 3
npx prisma migrate dev
