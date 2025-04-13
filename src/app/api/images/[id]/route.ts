import { NextResponse } from "next/server";

// 画像のマッピング
const imageMap = {
  "1": "https://placehold.jp/150x150.png",
  "2": "https://placehold.jp/300x300.png",
  "3": "https://placehold.jp/500x500.png",
} as const;

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = await context.params;

  // 有効なIDかチェック
  if (!(id in imageMap)) {
    return NextResponse.json({ error: "Invalid image ID" }, { status: 404 });
  }

  // 対応する画像URLにリダイレクト
  return NextResponse.redirect(imageMap[id as keyof typeof imageMap]);
}
