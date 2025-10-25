
export async function searchRfps(keyword: string, limit = 10) {
  const apiKey = import.meta.env.VITE_SAM_GOV_API_KEY;
  if (!apiKey) {
    throw new Error('SAM.gov API key is not set');
  }

  const params = new URLSearchParams({
    q: keyword,
    limit: String(limit),
    api_key: apiKey,
  });

  try {
    const response = await fetch(
      `https://api.sam.gov/prod/opportunities/v2/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`SAM.gov request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unknown error while searching RFPs');
  }
}
