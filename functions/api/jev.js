const TYPESAFE_ENDPOINT = 'https://api.typesafe.ai/v1/systemone';
const MAX_BODY_BYTES = 256 * 1024;

function json(body, status = 200, requestId = null) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  };
  if (requestId) headers['x-typesafe-request-id'] = requestId;
  return new Response(JSON.stringify(body), { status, headers });
}

export async function onRequestPost(context) {
  const authorization = context.request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer apikey_')) {
    return json({ error: '请填写有效的 TypeSafe API Key。' }, 401);
  }

  const declaredSize = Number(context.request.headers.get('content-length') || 0);
  if (declaredSize > MAX_BODY_BYTES) {
    return json({ error: '请求体过大。' }, 413);
  }

  let payload;
  try {
    const raw = await context.request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ error: '请求体过大。' }, 413);
    }
    payload = JSON.parse(raw);
  } catch {
    return json({ error: '请求体必须是合法 JSON。' }, 400);
  }

  if (payload?.model !== 'jev-latest' || !payload?.state || !payload?.questions || typeof payload.questions !== 'object') {
    return json({ error: '只允许调用 jev-latest，且必须提供 state 与 questions。' }, 400);
  }

  try {
    const upstream = await fetch(TYPESAFE_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await upstream.text();
    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        ...(upstream.headers.get('x-typesafe-request-id')
          ? { 'x-typesafe-request-id': upstream.headers.get('x-typesafe-request-id') }
          : {}),
      },
    });
  } catch {
    return json({ error: '无法连接 TypeSafe API。' }, 502);
  }
}

export function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return json({ error: 'Method not allowed' }, 405);
}
