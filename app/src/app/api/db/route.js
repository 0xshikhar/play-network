import fs from 'fs';
import path from 'path';

// Define the path to the db.json file
const dbFilePath = path.resolve(process.cwd(), 'db.json');

// Read the contents of the db.json file
const rawData = fs.readFileSync(dbFilePath);
const data = JSON.parse(rawData);

export async function POST(req, res) {
  // res.status(200).json(data);
  return NextResponse.json({ status: 200, statusText: "OK", data: data });
}
