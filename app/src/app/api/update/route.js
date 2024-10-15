
import { NextRequest, NextResponse } from "next/server";
import { JsonDatabase } from "brackets-json-db";
import { BracketsManager } from "brackets-manager";

const storage = new JsonDatabase();
const manager = new BracketsManager(storage);

export async function POST(req, res) {
  try {

    const { opp1Data, opp2Data, gameIdForServer } = req.body;

    const r1 = opp1Data > opp2Data ? "win" : "loss";
    const r2 = opp2Data > opp1Data ? "win" : "loss";

    await manager.update.match({
      id: gameIdForServer, // First match of winner bracket (round 1)
      opponent1: { score: opp1Data, result: r1 },
      opponent2: { score: opp2Data, result: r2 },
    });

    // await manager.update.match({
    //   id:1,
    //   opponent1: { score: 13, result: 'win' },
    //   opponent2: { score: 11 },
    // })

    // await manager.update.match({
    //     id:6,
    //     opponent1: { score: 111, result: 'win' },
    //     opponent2: { score: 1 },
    //   })

    return NextResponse.json({ status: 200, statusText: "OK", body: { message: "Data updated successfully" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, statusText: "Internal Server Error", body: { error: "An error occurred" } });
  }
}
