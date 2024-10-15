const { JsonDatabase } = require("brackets-json-db");
const { BracketsManager } = require("brackets-manager");

const storage = new JsonDatabase();
const manager = new BracketsManager(storage);

export default async function handler(req, res) {
  try {
    const { tournamentName, gameName, type, numberOfTeams, teamNames,randomNum } =
      req.body;
    // Create an elimination stage for tournament `3`.
    await manager.create({
      tournamentId: randomNum,
      name: tournamentName,
      type: type,
      seeding: teamNames.split(',').map((name) => name.trim()),
      settings: { grandFinal: 'double'},
    });
    
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}
