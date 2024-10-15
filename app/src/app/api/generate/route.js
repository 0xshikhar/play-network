// const { JsonDatabase } = require("brackets-json-db");
// const { BracketsManager } = require("brackets-manager");

import { NextRequest, NextResponse } from "next/server";
import { JsonDatabase } from "brackets-json-db";
import { BracketsManager } from "brackets-manager";

const storage = new JsonDatabase();
const manager = new BracketsManager(storage);

export async function POST(req, res) {
  try {

    const { tournamentName, gameName, type, numberOfTeams, teamNames, randomNum } = req;
    // Create an elimination stage for tournament `3`.
    console.log("req :", randomNum, tournamentName, gameName, type, numberOfTeams, teamNames)
    console.log("req :", req)
    if (teamNames) {
      await manager.create.stage({
        tournamentId: randomNum,
        name: tournamentName+"_game",
        type: type,
        seeding: teamNames.split(',').map((name) => name.trim()),
        settings: { grandFinal: 'double' },
      });
    }
    else {
      console.log("else part")
      await manager.create.stage({

        tournamentId: randomNum,
        stageId: randomNum,
        name: tournamentName +"_game",
        type: type,
        numberOfTeams: numberOfTeams,
        seeding: teamNames,
        settings: { grandFinal: 'double' },
      });
    }


    console.log("error occured :", error)

    // res.status(200).json({ message: "Data updated successfully" });
    return NextResponse.json({ status: 200, statusText: "OK", body: { message: "Data updated successfully" } });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: "An error occurred" });
    return NextResponse.json({ status: 500, statusText: "Internal Server Error", body: { error: error } });
  }
}
