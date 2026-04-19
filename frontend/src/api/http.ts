const buildJsonOptions = (method: 'POST' | 'PUT' | 'PATCH', body: unknown) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const postJson = async <TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> => {
  const response = await fetch(path, buildJsonOptions('POST', body));

  if (!response.ok) {
    throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
};

export { postJson };