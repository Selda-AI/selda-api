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
  testimonials: string[];
  industriesServed: string[];
  geographies: string[];
  languagesDetected: string[];
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

  const testimonials = dedupePreserveOrder(
    $("[class*=testimonial], [id*=testimonial], blockquote")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter((text) => text.length > 25)
  ).slice(0, 5);

  const industriesServedSet = new Set<string>();
  $("h1, h2, h3, h4, strong").each((_, el) => {
    const heading = cleanText($(el).text());
    if (!heading || !/industr(y|ies)/i.test(heading)) {
      return;
    }
    const list = $(el).nextAll("ul, ol").first();
    if (list.length) {
      list.find("li").each((__, li) => {
        const value = cleanText($(li).text());
        if (value) industriesServedSet.add(value);
      });
    } else {
      const paragraph = $(el).nextAll("p").first();
      const value = cleanText(paragraph.text());
      if (value) industriesServedSet.add(value);
    }
  });
  const industriesServed = dedupePreserveOrder(Array.from(industriesServedSet)).slice(0, 10);

  const GEO_KEYWORDS = [
    "global",
    "worldwide",
    "international",
    "north america",
    "south america",
    "europe",
    "emea",
    "asia",
    "apac",
    "latam",
    "middle east",
    "africa",
    "australia",
    "canada",
    "united states",
    "usa",
    "united kingdom",
    "uk",
    "germany",
    "france",
    "spain",
    "italy",
    "sweden",
    "finland",
    "norway",
    "denmark",
    "netherlands",
    "india",
    "singapore",
    "japan",
    "brazil",
  ];

  const lowerFullText = fullText.toLowerCase();
  const geographies = GEO_KEYWORDS.filter((term) => lowerFullText.includes(term)).map((term) => {
    if (term.length <= 3) {
      return term.toUpperCase();
    }
    return term
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  });

  const KNOWN_LANGUAGES = [
    "english",
    "spanish",
    "french",
    "german",
    "italian",
    "portuguese",
    "dutch",
    "swedish",
    "finnish",
    "norwegian",
    "danish",
    "polish",
    "czech",
    "hungarian",
    "estonian",
    "latvian",
    "lithuanian",
    "russian",
    "arabic",
    "hindi",
    "thai",
    "chinese",
    "japanese",
    "korean",
  ];

  const languagesDetectedSet = new Set<string>();
  const htmlLang = cleanText($("html").attr("lang"));
  if (htmlLang) {
    languagesDetectedSet.add(htmlLang.toLowerCase());
  }
  KNOWN_LANGUAGES.forEach((language) => {
    const regex = new RegExp(`\\b${language}\\b`, "i");
    if (regex.test(fullText)) {
      languagesDetectedSet.add(language);
    }
  });
  const languagesDetected = Array.from(languagesDetectedSet).map((lang) =>
    lang.length <= 3 ? lang.toUpperCase() : lang.charAt(0).toUpperCase() + lang.slice(1)
  );

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
    testimonials,
    industriesServed,
    geographies: dedupePreserveOrder(geographies),
    languagesDetected,
    rawHtml,
  };
}

