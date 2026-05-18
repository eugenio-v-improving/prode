import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.prodeUserFinalsMatch.deleteMany();
  await prisma.prodeUserGroupMatch.deleteMany();
  await prisma.userProde.deleteMany();
  await prisma.match.deleteMany();
  await prisma.country.deleteMany();
  await prisma.prode.deleteMany();

  const prode = await prisma.prode.create({
    data: {
      created: new Date(),
      stage: "GROUPS",
      groupSubmissionsEnd: new Date("2022-11-20T16:00:00.000Z"),
      finalsSubmissionsEnd: new Date("2022-12-03T15:00:00.000Z"),
      prodeEnd: new Date("2022-12-18T15:00:00.000Z"),
    },
  });

  await prisma.country.createMany({
    data: [
      {
        name: "ARGENTINA",
        code: "ARG",
      },
      {
        name: "AUSTRALIA",
        code: "AUS",
      },
      {
        name: "BÉLGICA",
        code: "BEL",
      },
      {
        name: "BRASIL",
        code: "BRA",
      },
      {
        name: "CANADÁ",
        code: "CAN",
      },
      {
        name: "SUIZA",
        code: "CHE",
      },
      {
        name: "CAMERÚN",
        code: "CMR",
      },
      {
        name: "COSTA RICA",
        code: "CRI",
      },
      {
        name: "ALEMANIA",
        code: "DEU",
      },
      {
        name: "DINAMARCA",
        code: "DNK",
      },
      {
        name: "ECUADOR",
        code: "ECU",
      },
      {
        name: "INGLATERRA",
        code: "ENG",
      },
      {
        name: "ESPAÑA",
        code: "ESP",
      },
      {
        name: "FRANCIA",
        code: "FRA",
      },
      {
        name: "GALES",
        code: "GBR.4",
      },
      {
        name: "GHANA",
        code: "GHA",
      },
      {
        name: "CROACIA",
        code: "HRV",
      },
      {
        name: "IRÁN",
        code: "IRN",
      },
      {
        name: "JAPÓN",
        code: "JPN",
      },
      {
        name: "COREA S.",
        code: "KOR",
      },
      {
        name: "MARRUECOS",
        code: "MAR",
      },
      {
        name: "MÉXICO",
        code: "MEX",
      },
      {
        name: "P. BAJOS",
        code: "NLD",
      },
      {
        name: "POLONIA",
        code: "POL",
      },
      {
        name: "PORTUGAL",
        code: "PRT",
      },
      {
        name: "CATAR",
        code: "QAT",
      },
      {
        name: "A. SAUDITA",
        code: "SAU",
      },
      {
        name: "SENEGAL",
        code: "SEN",
      },
      {
        name: "SERBIA",
        code: "SRB",
      },
      {
        name: "TÚNEZ",
        code: "TUN",
      },
      {
        name: "URUGUAY",
        code: "URU",
      },
      {
        name: "EEUU",
        code: "USA",
      },
    ],
  });

  const countries = await prisma.country.findMany();

  //GROUP A
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "QAT")?.id || "1",
        countryRightId: countries.find((row) => row.code === "ECU")?.id || "1",
        date: new Date("2022-11-20T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "SEN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "NLD")?.id || "1",
        date: new Date("2022-11-21T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "QAT")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SEN")?.id || "1",
        date: new Date("2022-11-25T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "NLD")?.id || "1",
        countryRightId: countries.find((row) => row.code === "ECU")?.id || "1",
        date: new Date("2022-11-25T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ECU")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SEN")?.id || "1",
        date: new Date("2022-11-29T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_A",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "NLD")?.id || "1",
        countryRightId: countries.find((row) => row.code === "QAT")?.id || "1",
        date: new Date("2022-11-29T15:00:00.000Z"),
      },
    ],
  });

  //GROUP B
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ENG")?.id || "1",
        countryRightId: countries.find((row) => row.code === "IRN")?.id || "1",
        date: new Date("2022-11-21T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "USA")?.id || "1",
        countryRightId:
          countries.find((row) => row.code === "GBR.4")?.id || "1",
        date: new Date("2022-11-21T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "GBR.4")?.id || "1",
        countryRightId: countries.find((row) => row.code === "IRN")?.id || "1",
        date: new Date("2022-11-25T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ENG")?.id || "1",
        countryRightId: countries.find((row) => row.code === "USA")?.id || "1",
        date: new Date("2022-11-25T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "IRN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "USA")?.id || "1",
        date: new Date("2022-11-29T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_B",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "GBR.4")?.id || "1",
        countryRightId: countries.find((row) => row.code === "ENG")?.id || "1",
        date: new Date("2022-11-29T19:00:00.000Z"),
      },
    ],
  });

  //GROUP C
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ARG")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SAU")?.id || "1",
        date: new Date("2022-11-22T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "MEX")?.id || "1",
        countryRightId: countries.find((row) => row.code === "POL")?.id || "1",
        date: new Date("2022-11-22T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "POL")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SAU")?.id || "1",
        date: new Date("2022-11-26T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ARG")?.id || "1",
        countryRightId: countries.find((row) => row.code === "MEX")?.id || "1",
        date: new Date("2022-11-26T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "POL")?.id || "1",
        countryRightId: countries.find((row) => row.code === "ARG")?.id || "1",
        date: new Date("2022-11-30T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_C",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "SAU")?.id || "1",
        countryRightId: countries.find((row) => row.code === "MEX")?.id || "1",
        date: new Date("2022-11-30T19:00:00.000Z"),
      },
    ],
  });

  //GROUP D
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "DNK")?.id || "1",
        countryRightId: countries.find((row) => row.code === "TUN")?.id || "1",
        date: new Date("2022-11-22T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "FRA")?.id || "1",
        countryRightId: countries.find((row) => row.code === "AUS")?.id || "1",
        date: new Date("2022-11-22T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "TUN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "AUS")?.id || "1",
        date: new Date("2022-11-26T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "FRA")?.id || "1",
        countryRightId: countries.find((row) => row.code === "DNK")?.id || "1",
        date: new Date("2022-11-26T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "AUS")?.id || "1",
        countryRightId: countries.find((row) => row.code === "DNK")?.id || "1",
        date: new Date("2022-11-30T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_D",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "TUN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "FRA")?.id || "1",
        date: new Date("2022-11-30T15:00:00.000Z"),
      },
    ],
  });

  //GROUP E
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "DEU")?.id || "1",
        countryRightId: countries.find((row) => row.code === "JPN")?.id || "1",
        date: new Date("2022-11-23T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ESP")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CRI")?.id || "1",
        date: new Date("2022-11-23T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "JPN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CRI")?.id || "1",
        date: new Date("2022-11-27T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "ESP")?.id || "1",
        countryRightId: countries.find((row) => row.code === "DEU")?.id || "1",
        date: new Date("2022-11-27T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "JPN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "ESP")?.id || "1",
        date: new Date("2022-12-01T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_E",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "CRI")?.id || "1",
        countryRightId: countries.find((row) => row.code === "DEU")?.id || "1",
        date: new Date("2022-12-01T19:00:00.000Z"),
      },
    ],
  });

  //GROUP F
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "MAR")?.id || "1",
        countryRightId: countries.find((row) => row.code === "HRV")?.id || "1",
        date: new Date("2022-11-23T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "BEL")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CAN")?.id || "1",
        date: new Date("2022-11-23T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "BEL")?.id || "1",
        countryRightId: countries.find((row) => row.code === "MAR")?.id || "1",
        date: new Date("2022-11-27T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "HRV")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CAN")?.id || "1",
        date: new Date("2022-11-27T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "HRV")?.id || "1",
        countryRightId: countries.find((row) => row.code === "BEL")?.id || "1",
        date: new Date("2022-12-01T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_F",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "CAN")?.id || "1",
        countryRightId: countries.find((row) => row.code === "MAR")?.id || "1",
        date: new Date("2022-12-01T15:00:00.000Z"),
      },
    ],
  });

  //GROUP G
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "CHE")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CMR")?.id || "1",
        date: new Date("2022-11-24T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "BRA")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SRB")?.id || "1",
        date: new Date("2022-11-24T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "CMR")?.id || "1",
        countryRightId: countries.find((row) => row.code === "SRB")?.id || "1",
        date: new Date("2022-11-28T10:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "BRA")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CHE")?.id || "1",
        date: new Date("2022-11-28T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "SRB")?.id || "1",
        countryRightId: countries.find((row) => row.code === "CHE")?.id || "1",
        date: new Date("2022-12-02T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_G",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "CMR")?.id || "1",
        countryRightId: countries.find((row) => row.code === "BRA")?.id || "1",
        date: new Date("2022-12-02T19:00:00.000Z"),
      },
    ],
  });

  //GROUP H
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "URU")?.id || "1",
        countryRightId: countries.find((row) => row.code === "KOR")?.id || "1",
        date: new Date("2022-11-24T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "PRT")?.id || "1",
        countryRightId: countries.find((row) => row.code === "GHA")?.id || "1",
        date: new Date("2022-11-24T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "KOR")?.id || "1",
        countryRightId: countries.find((row) => row.code === "GHA")?.id || "1",
        date: new Date("2022-11-28T13:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "PRT")?.id || "1",
        countryRightId: countries.find((row) => row.code === "URU")?.id || "1",
        date: new Date("2022-11-28T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "GHA")?.id || "1",
        countryRightId: countries.find((row) => row.code === "URU")?.id || "1",
        date: new Date("2022-12-02T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "GROUP_H",
        goalsLeft: 0,
        goalsRight: 0,
        countryLeftId: countries.find((row) => row.code === "KOR")?.id || "1",
        countryRightId: countries.find((row) => row.code === "PRT")?.id || "1",
        date: new Date("2022-12-02T15:00:00.000Z"),
      },
    ],
  });

  //FINALS_8
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "FINALS_8_1", //1A-2B
        date: new Date("2022-12-03T16:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_2", //1B-2A
        date: new Date("2022-12-04T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_3", //1C-2D
        date: new Date("2022-12-03T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_4", //1D-2C
        date: new Date("2022-12-04T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_5", //1E-2F
        date: new Date("2022-12-05T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_6", //1F-2E
        date: new Date("2022-12-06T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_7", //1G-2H
        date: new Date("2022-12-05T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_8_8", //1H-2G
        date: new Date("2022-12-06T19:00:00.000Z"),
      },
    ],
  });

  //FINALS_4
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "FINALS_4_1", //FINALS_8_1-FINALS_8_3
        date: new Date("2022-12-09T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_4_2", //FINALS_8_2-FINALS_8_4
        date: new Date("2022-12-10T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_4_3", //FINALS_8_5-FINALS_8_7
        date: new Date("2022-12-09T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_4_4", //FINALS_8_6-FINALS_8_8
        date: new Date("2022-12-10T15:00:00.000Z"),
      },
    ],
  });

  //FINALS_2
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "FINALS_2_1", //FINALS_4_1-FINALS_4_3
        date: new Date("2022-12-13T19:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "FINALS_2_2", //FINALS_4_2-FINALS_4_4
        date: new Date("2022-12-14T19:00:00.000Z"),
      },
    ],
  });

  //FINALS
  await prisma.match.createMany({
    data: [
      {
        prodeId: prode.id,
        stage: "FINALS",
        date: new Date("2022-12-18T15:00:00.000Z"),
      },
      {
        prodeId: prode.id,
        stage: "THIRD_PLACE",
        date: new Date("2022-12-17T15:00:00.000Z"),
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
