import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = [
    "/dashboard",
    "/create/good-morning", "/create/good-night", "/create/mothers-day", "/create/fathers-day",
    "/create/wedding", "/create/new-baby", "/create/get-well-soon", "/create/good-luck",
    "/create/housewarming", "/create/diwali", "/create/sinhala-tamil-new-year",
  ];
  const needsAuth = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p));

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/good-morning/:path*", "/create/good-night/:path*", "/create/mothers-day/:path*", "/create/fathers-day/:path*",
    "/create/wedding/:path*", "/create/new-baby/:path*", "/create/get-well-soon/:path*", "/create/good-luck/:path*",
    "/create/housewarming/:path*", "/create/diwali/:path*", "/create/sinhala-tamil-new-year/:path*",
  ],
};
