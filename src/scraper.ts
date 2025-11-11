import axios from "axios";
import * as cheerio from "cheerio";
import {
  cleanText,
  collapseWhitespaceAndTruncate,
  extractTopKeywords,
  normalizeUrl,
  toAbsoluteUrl,
  dedupePreserveOrder,
} from "./utils";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ScrapedWebsite {
  url: string;
  fetchedAt: string;
  status: number;
  title: string;
  description: string;
  language: string | null;
  headings: string[];
  textExcerpt: string;
  keywords: string[];
  metaKeywords: string[];
  socialLinks: SocialLink[];
  contactPages: string[];
  rawHtml: string;
}

export async function scrapeWebsite(inputUrl: string): Promise<ScrapedWebsite> {
  const url = normalizeUrl(inputUrl);

  let response;
  try {
    response = await axios.get<string>(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "SeldaBot/1.0 (+https://github.com/Selda-AI/selda-api; contact: open-source@selda.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      throw new Error(
        `Failed to fetch ${url} (status ${status || "unknown"}): ${error.message}`
      );
    }
    throw error;
  }

  const rawHtml = response.data ?? "";
  const $ = cheerio.load(rawHtml);

  const title = cleanText($("title").first().text());
  const description = cleanText($('meta[name="description"]').attr("content"));
  const metaKeywords: string[] = cleanText(
    $('meta[name="keywords"]').attr("content")
  )
    .split(",")
    .map((word) => cleanText(word))
    .filter(Boolean);

  const headings = $("h1, h2, h3")
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean);

  const paragraphBlocks = $("p, li")
    .map((_, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean);

  const attributeText = $("[alt],[aria-label],[title]")
    .map((_, el) => {
      const attr =
        $(el).attr("alt") ?? $(el).attr("aria-label") ?? $(el).attr("title");
      return cleanText(attr);
    })
    .get()
    .filter(Boolean);

  const fullText = collapseWhitespaceAndTruncate(
    [title, description, headings.join(" "), paragraphBlocks.join(" "), attributeText.join(" ")]
      .filter(Boolean)
      .join(" ")
  );

  const socialPatterns: Array<{ platform: string; pattern: RegExp }> = [
    { platform: "LinkedIn", pattern: /linkedin\.com/i },
    { platform: "X (Twitter)", pattern: /twitter\.com|x\.com/i },
    { platform: "Facebook", pattern: /facebook\.com/i },
    { platform: "Instagram", pattern: /instagram\.com/i },
    { platform: "YouTube", pattern: /youtube\.com|youtu\.be/i },
    { platform: "TikTok", pattern: /tiktok\.com/i },
    { platform: "Medium", pattern: /medium\.com/i },
    { platform: "GitHub", pattern: /github\.com/i },
    { platform: "Glassdoor", pattern: /glassdoor\.com/i },
    { platform: "Crunchbase", pattern: /crunchbase\.com/i },
  ];

  const socialLinksMap = new Map<string, string>();
  const contactPagesSet = new Set<string>();

  $("a[href]").each((_, element) => {
    const hrefRaw = $(element).attr("href");
    const absoluteHref = toAbsoluteUrl(url, hrefRaw);
    if (!absoluteHref) {
      return;
    }

    for (const { platform, pattern } of socialPatterns) {
      if (pattern.test(absoluteHref)) {
        if (!socialLinksMap.has(platform)) {
          socialLinksMap.set(platform, absoluteHref);
        }
        return;
      }
    }

    const lowerHref = absoluteHref.toLowerCase();
    const anchorText = cleanText($(element).text()).toLowerCase();
    const isContactLink =
      /contact|support|book|demo|talk|sales|team|about|request/i.test(anchorText) ||
      /contact|support|book|demo|talk|sales|request|meet/.test(lowerHref);

    if (isContactLink) {
      contactPagesSet.add(absoluteHref);
    }
  });

  const keywords = Array.from(
    new Set([...metaKeywords, ...extractTopKeywords(fullText, 20)])
  ).slice(0, 20);

  return {
    url,
    fetchedAt: new Date().toISOString(),
    status: response.status,
    title,
    description,
    language: cleanText($("html").attr("lang")) || null,
    headings,
    textExcerpt: fullText,
    keywords,
    metaKeywords,
    socialLinks: Array.from(socialLinksMap.entries()).map(([platform, link]) => ({
      platform,
      url: link,
    })),
    contactPages: dedupePreserveOrder(contactPagesSet),
    rawHtml,
  };
}

