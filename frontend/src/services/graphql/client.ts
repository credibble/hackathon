export const GRAPH_URL =
  "https://thegraph.test2.btcs.network/subgraphs/name/credibble";

interface GraphResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphRequest<T>(
  query: string,
  variables?: Record<string, string | number | boolean | object>
): Promise<T> {
  if (variables && Object.keys(variables?.["where"] || {}).length === 0) {
    delete variables["where"];
  }

  const res = await fetch(GRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`);
  }

  const json = (await res.json()) as GraphResponse<T>;
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data as T;
}
