import { type Context, Hono } from "hono";
import { etag } from "hono/etag";

type Bindings = {
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const getImageOptions = (c: Context): RequestInitCfPropertiesImage => {
  const { width, height, fit, format } = c.req.query();

  const imageOptions: RequestInitCfPropertiesImage = {};

  if (width) imageOptions.width = Number.parseInt(width, 10);
  if (height) imageOptions.height = Number.parseInt(height, 10);
  if (fit) imageOptions.fit = fit as RequestInitCfPropertiesImage["fit"];
  if (format)
    imageOptions.format = format as RequestInitCfPropertiesImage["format"];

  return imageOptions;
};

app.use("/cf/images/:imageId", etag());
app.get("/cf/images/:imageId", async (c) => {
  const imageId = c.req.param("imageId");
  const imageAuthUrl = `${c.env.APP_URL}/api/images/${imageId}`;
  const searchParams = new URLSearchParams(c.req.query());

  // キャッシュの確認
  const cache = caches.default;
  const cacheKey = new Request(
    new URL(`${imageAuthUrl}?${searchParams.toString()}`),
  );
  const cachedResponse = await cache.match(cacheKey);
  let response: Response;

  if (cachedResponse) {
    response = new Response(cachedResponse.body, cachedResponse);
    response.headers.set("cache-control", "s-maxage=10");
  } else {
    const headers = new Headers(c.req.header());
    // 画像認証サーバーに対する条件付きリクエスト（GET）を無効化
    headers.delete("if-none-match");
    headers.delete("if-modified-since");

    const request: RequestInfo = new Request(imageAuthUrl, {
      headers: headers,
      cf: {
        image: {
          ...getImageOptions(c),
          "origin-auth": "share-publicly",
        },
      },
      redirect: "follow", // default
    });

    response = await fetch(request);

    if (!response.ok) {
      return new Response("Image not found", { status: 404 });
    }

    response = new Response(response.body, response);
    // キャッシュの設定
    response.headers.set("cache-control", "s-maxage=10");

    // middleware で生成する ETag を使用するため、画像認証サーバーからの ETag を削除
    response.headers.delete("etag");
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
});

// @opennextjs/cloudflare でデプロイされた場合の next/image は、ただ fetch しているだけ
// @see https://github.com/opennextjs/opennextjs-cloudflare/blob/%40opennextjs/cloudflare%401.0.0-beta.3/packages/cloudflare/src/cli/templates/worker.ts#L28-L33
// そのため、画像用プロキシ Worker にリダイレクトする

app.get("/_next/image", (c) => {
  const { url } = c.req.query();

  if (url.startsWith(c.env.APP_URL) || url.startsWith("/cf/images/")) {
    return c.redirect(new URL(url, c.req.raw.url).pathname, 301);
  }

  return fetch(c.req.raw);
});

app.get("*", (c) => fetch(c.req.raw));

export default app;
