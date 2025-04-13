import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expires = searchParams.get("expires");

  // 必須パラメータのチェック
  if (!expires) {
    return NextResponse.json(
      { error: "Missing expires parameter" },
      { status: 400 },
    );
  }

  const expiresNumber = Number.parseInt(expires, 10);
  const currentTime = Date.now();

  // 有効期限のチェック
  if (currentTime > expiresNumber) {
    return NextResponse.json({ error: "URL has expired" }, { status: 403 });
  }

  // 有効期限内の場合、画像URLにリダイレクト
  return NextResponse.redirect("https://placehold.jp/150x150.png");
}
