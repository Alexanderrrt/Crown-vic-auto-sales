import fs from "node:fs/promises";
import path from "node:path";

const targetDir = path.resolve("supabase-media");
await fs.mkdir(targetDir, { recursive: true });

const urls = [
  "https://www.crownvicauto.com/",
  "https://www.crownvicauto.com/about",
  "https://www.crownvicauto.com/cars-for-sale",
  "https://www.crownvicauto.com/contact",
];

const imageUrls = new Set();

for (const url of urls) {
  const html = await fetch(url).then((res) => res.text());
  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const match of matches) {
    if (match.startsWith("http")) imageUrls.add(match);
    else imageUrls.add(new URL(match, url).href);
  }
}

let index = 0;
for (const imageUrl of imageUrls) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) continue;
    const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";
    const filePath = path.join(targetDir, `media-${String(index + 1).padStart(2, "0")}${ext}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    index += 1;
    console.log(`Saved ${filePath}`);
  } catch {
    // Skip unreadable media and continue.
  }
}

console.log(`Imported ${index} media assets.`);
