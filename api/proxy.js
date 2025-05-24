export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = url.pathname.replace('/api/', 'https://the-gioi-den.up.railway.app/');

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        host: new URL(targetUrl).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type'),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 