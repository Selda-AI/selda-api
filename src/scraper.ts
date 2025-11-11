import axios from "axios";

export async function scrapeWebsite(url: string): Promise<string> {
  const { data } = await axios.get(url, { timeout: 10000 });
  return data;
}

