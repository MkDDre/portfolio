const buildHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const getJson = async <TResponse>(
  path: string,
  token?: string,
): Promise<TResponse> => {
  const response = await fetch(path, {
    method: 'GET',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
};

const postJson = async <TResponse, TBody>(
  path: string,
  body: TBody,
  token?: string,
): Promise<TResponse> => {
  const response = await fetch(path, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
};

const patchJson = async <TResponse, TBody>(
  path: string,
  body?: TBody,
  token?: string,
): Promise<TResponse> => {
  const response = await fetch(path, {
    method: 'PATCH',
    headers: buildHeaders(token),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
};

export { getJson, postJson, patchJson };