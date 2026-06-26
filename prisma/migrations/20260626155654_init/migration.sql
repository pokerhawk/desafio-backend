-- CreateEnum
CREATE TYPE "FlightClassEnum" AS ENUM ('first_class', 'executive', 'economic');

-- CreateEnum
CREATE TYPE "DocumentTypeEnum" AS ENUM ('cpf', 'passport');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "flight_number" TEXT NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "trip_id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "ticket_price" INTEGER NOT NULL,
    "delay_minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentTypeEnum" NOT NULL DEFAULT 'cpf',
    "seat_number" TEXT NOT NULL,
    "flight_class" "FlightClassEnum" NOT NULL DEFAULT 'economic',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "tripId" TEXT NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TripToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TripToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_operator_key" ON "User"("operator");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_trip_id_key" ON "Trip"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Passenger_document_key" ON "Passenger"("document");

-- CreateIndex
CREATE INDEX "_TripToUser_B_index" ON "_TripToUser"("B");

-- AddForeignKey
ALTER TABLE "Passenger" ADD CONSTRAINT "Passenger_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripToUser" ADD CONSTRAINT "_TripToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TripToUser" ADD CONSTRAINT "_TripToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
