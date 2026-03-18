import client from "@/tina/__generated__/client";

function nonNullable<T>(val: T): val is NonNullable<T> {
  return val != null;
}

export async function getInsights() {
  const result = await client.queries.insightConnection({
    sort: "publishedDate",
    last: 50,
  });
  return (
    result.data.insightConnection.edges
      ?.map((e) => e?.node)
      .filter(nonNullable)
      .reverse() ?? []
  );
}

export async function getInsight(slug: string) {
  const result = await client.queries.insight({
    relativePath: `${slug}.mdx`,
  });
  return result.data.insight;
}

export async function getServices() {
  const result = await client.queries.serviceConnection({
    sort: "order",
    first: 50,
  });
  return (
    result.data.serviceConnection.edges
      ?.map((e) => e?.node)
      .filter(nonNullable) ?? []
  );
}

export async function getTeamMembers() {
  const result = await client.queries.teamMemberConnection({
    sort: "order",
    first: 50,
  });
  return (
    result.data.teamMemberConnection.edges
      ?.map((e) => e?.node)
      .filter(nonNullable) ?? []
  );
}

export async function getEvents() {
  const result = await client.queries.eventConnection({
    sort: "date",
    first: 50,
  });
  return (
    result.data.eventConnection.edges
      ?.map((e) => e?.node)
      .filter(nonNullable) ?? []
  );
}
