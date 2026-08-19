const verificationToken =
  "google-site-verification: google250753ed1b6bfb6b.html";

export function onRequest() {
  return new Response(verificationToken, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
