export async function POST(request: Request): Promise<Response> {
  const apiUrl = process.env.API_URL
  const apiToken = process.env.API_TOKEN
  if (apiUrl === undefined || apiToken === undefined) {
    return Response.json(
      {
        errors: [
          { message: 'Missing API_URL / API_TOKEN — set them in the Vercel project environment.' },
        ],
      },
      { status: 500 },
    )
  }
  if (new URL(apiUrl).protocol !== 'https:') {
    return Response.json(
      {
        errors: [
          {
            message: 'API_URL must use https — the Bearer token must never travel over plaintext.',
          },
        ],
      },
      { status: 500 },
    )
  }
  const upstream = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiToken}`,
    },
    body: await request.text(),
  })
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  })
}
