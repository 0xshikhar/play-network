import { NextRequest, NextResponse } from "next/server";
import { JsonDatabase } from "brackets-json-db";
import { BracketsManager } from "brackets-manager";

const storage = new JsonDatabase();
const manager = new BracketsManager(storage);

export async function POST(req, res) {
  try {
    const { tournamentId } = req.body;
    const id = parseInt(tournamentId);
    await manager.delete.tournament(id);

    return NextResponse.json({ status: 200, statusText: "OK", body: { message: "Tournament deleted successfully" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, statusText: "Internal Server Error", body: { error: "An error occurred" } });
  }
}
