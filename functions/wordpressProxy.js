
export async function onRequest({ request }) {
  const url = new URL(request.url);
  const targetPath = url.pathname + url.search;

  const wordpressApiURL = `${process.env.WORDPRESS_API_URL}${targetPath}`;

  const modifiedRequest = new Request(wordpressApiURL, {
    method: request.method,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      "Referer": "https://headless-wordpress-demo.42web.io",
    },
  });

  try {
    const response = await fetch(modifiedRequest);

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from WordPress API", detail: err.message }),
      { status: 500 }
    );
  }
}