export const dynamic = "force-static";

export function GET() {
  return new Response(
    "google-site-verification: google250753ed1b6bfb6b.html",
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
