import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    timestamp: Date.now(),
    method: "GET",
    url: request.url,
    headers: {
      host: request.headers.get("host"),
      userAgent: request.headers.get("user-agent"),
      connection: request.headers.get("connection"),
    },
    message: "Connection established successfully",
  });
}
