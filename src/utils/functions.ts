export const removeSpaces = (string: string): string =>{
  return string.replace(/\s+/g, '');
}

export const onlyNumbers = (string: string): string => {
  return string.replace(/\D+/g, '');
}

export function numberToBRL(value: string | number){
  if(typeof value === 'number')value = value.toString();
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(parseFloat(value.replace(/\D/g, "")) / 100);
}

export const percentStringToNumber = (percent: string): number => {
  return parseFloat(percent.replace("%", ""));
}

export const toPercentString = (value: number): string => {
  return value.toFixed(2) + "%";
}

export const normalizeName = (name: string) => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const convertUTCtoSaoPauloTime = (date: Date) =>{
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const saoPauloTimeString = formatter.format(new Date(date));

  const leftSide = saoPauloTimeString.split(",")[0].split("-");
  const rightSide = saoPauloTimeString.split(", ")[1].split(":");

  const saoPauloTimeDate = new Date(`${leftSide[0]}-${leftSide[1]}-${leftSide[2]}T${rightSide[0]}:${rightSide[1]}:${rightSide[2]}.000Z`);

  return saoPauloTimeDate;
}

export const generateRandomFlightCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < 2; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 4; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return result;
}

export const randomFutureDate = (maxDaysAhead = 90) => {
  const now = Date.now();

  const randomDays = Math.floor(Math.random() * maxDaysAhead) + 1;
  const randomMs = randomDays * 24 * 60 * 60 * 1000;

  return new Date(now + randomMs);
}
