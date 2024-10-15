import { NextRequest, NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    // ${req.query.getStream} is getting from /stream/[getStream].js
    console.log(req.query.id);
    const response = await fetch(`https://livepeer.studio/api/stream/${req.query.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    // return res.status(200).json(data);
    return NextResponse.json({ status: 200, statusText: "OK", body: data });

  } catch (error) {
    // res.status(400).send('Error');
    return NextResponse.json({ status: 400, statusText: "Error Request", body: { error: "An error occurred" } });
  }
}