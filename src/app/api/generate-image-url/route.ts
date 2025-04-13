import { NextResponse } from "next/server";

export async function GET() {
  // 5分後の有効期限を計算（ミリ秒）
  const expires = Date.now() + 5 * 60 * 1000;

  // 生成するURL
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const url = `${baseUrl}/api/image?expires=${expires}`;

  return NextResponse.json({
    url,
    expires,
    expiresIn: "5 minutes",
  });
}
