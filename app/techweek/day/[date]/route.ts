import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const u = new URL(req.url).searchParams.get("u");
    if (!u) {
      return new NextResponse("Missing ?u", { status: 400 });
    }

    const upstream = await fetch(u, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; TWKProxy/1.0)" },
    });

    const body = await upstream.arrayBuffer();
    const headers = new Headers(upstream.headers);

    headers.set("access-control-allow-origin", "*");
    headers.set("cache-control", "no-store");

    return new NextResponse(body, {
      status: upstream.status,
      headers,
    });
  } catch (e) {
    return new NextResponse("proxy error", { status: 502 });
  }
}
