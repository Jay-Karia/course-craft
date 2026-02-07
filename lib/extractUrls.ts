// lib/extractUrls.ts

type ExtractedUrl = {
  url: string;
  title: string;
  description: string;
  text: string;
  status?: number;
  contentType?: string;
  error?: string;
};

type ExtractedUrlBundle = {
  combinedText: string;
  items: ExtractedUrl[];
};

const normalizeText = (value: string) =>
  value.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

const stripTags = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

const extractTitle = (html: string) => {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) {
    return normalizeText(stripTags(titleMatch[1]));
  }

  // Fallback to og:title
  const ogTitleMatch = html.match(
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  return normalizeText(ogTitleMatch?.[1] ?? "");
};

const extractMetaDescription = (html: string) => {
  // Try standard meta description
  let match = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );

  if (!match) {
    // Try og:description
    match = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    );
  }

  return normalizeText(stripTags(match?.[1] ?? ""));
};

const extractH1 = (html: string) => {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return normalizeText(stripTags(match?.[1] ?? ""));
};

const extractMainContent = (html: string): string => {
  // Try to extract main content area
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return stripTags(mainMatch[1]);
  }

  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    return stripTags(articleMatch[1]);
  }

  // Fallback to body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return stripTags(bodyMatch[1]);
  }

  return stripTags(html);
};

const isValidUrl = (value: string) => {
  if (!value || typeof value !== 'string') return false;

  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const buildFallbackUrl = (url: string) => {
  const cleanUrl = url.replace(/^https?:\/\//, "");
  return `https://r.jina.ai/${cleanUrl}`;
};

export async function extractUrls(urls: string[]): Promise<ExtractedUrlBundle> {
  // Validate and clean URLs
  const validUrls = (urls ?? [])
    .filter((url) => url && typeof url === 'string')
    .map(url => url.trim())
    .filter((url) => isValidUrl(url));

  if (validUrls.length === 0) {
    return { combinedText: "", items: [] };
  }

  const results = await Promise.all(
    validUrls.map(async (url) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // Increased to 10s

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; KinetixBot/1.0)",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });

        const contentType = response.headers.get("content-type") ?? "";

        if (!response.ok) {
          // Try Jina AI fallback for better content extraction
          try {
            const fallback = await fetch(buildFallbackUrl(url), {
              signal: controller.signal,
              headers: {
                "User-Agent": "KinetixBot/1.0",
                Accept: "text/plain",
              },
            });

            if (fallback.ok) {
              const raw = normalizeText(await fallback.text()).slice(0, 3000);
              const lines = raw.split("\n").filter(line => line.trim());
              const firstLine = lines[0] ?? "";

              return {
                url,
                title: firstLine.slice(0, 150),
                description: lines[1]?.slice(0, 200) ?? "",
                text: raw,
                status: response.status,
                contentType: fallback.headers.get("content-type") ?? undefined,
              };
            }
          } catch (fallbackError) {
            console.error(`Fallback failed for ${url}:`, fallbackError);
          }

          return {
            url,
            title: "",
            description: "",
            text: "",
            status: response.status,
            contentType,
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const raw = await response.text();

        let title = "";
        let description = "";
        let combinedText = "";

        if (contentType.includes("text/html") || contentType.includes("application/xhtml")) {
          title = extractTitle(raw);
          description = extractMetaDescription(raw);
          const h1 = extractH1(raw);
          const mainContent = extractMainContent(raw);
          const text = normalizeText(mainContent).slice(0, 3000);

          // Combine with priority: title, h1, description, main content
          const parts = [
            title,
            h1 && h1 !== title ? h1 : "",
            description,
            text
          ].filter(Boolean);

          combinedText = normalizeText(parts.join("\n\n"));
        } else if (contentType.includes("text/plain")) {
          const snippet = normalizeText(raw).slice(0, 3000);
          combinedText = snippet;
          title = snippet.split("\n")[0]?.slice(0, 150) ?? "";
        } else {
          // For other content types, try to extract what we can
          const snippet = normalizeText(stripTags(raw)).slice(0, 3000);
          combinedText = snippet;
        }

        return {
          url,
          title: title || url,
          description,
          text: combinedText,
          status: response.status,
          contentType: contentType || undefined,
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error.name === 'AbortError'
          ? 'Request timeout'
          : error.message || 'Failed to fetch';

        console.error(`Error fetching ${url}:`, errorMessage);

        return {
          url,
          title: "",
          description: "",
          text: "",
          error: errorMessage,
        };
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  // Filter out failed results and combine text
  const successfulResults = results.filter(item => item.text && !item.error);

  const combinedText = normalizeText(
    successfulResults
      .map((item) => {
        // Include URL as context
        return `Source: ${item.url}\n${item.title ? `Title: ${item.title}\n` : ""}${item.text}`;
      })
      .join("\n\n---\n\n"),
  );

  return {
    combinedText,
    items: results,
  };
}
