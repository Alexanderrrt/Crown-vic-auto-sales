import { expect, test } from "@playwright/test";

test("public shopper paths render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find the right hybrid or ev/i })).toBeVisible();

  await page.goto("/inventory");
  await expect(page.getByRole("heading", { name: /browse the current lot/i })).toBeVisible();
  await expect(page.getByPlaceholder(/search make/i)).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: /talk with a real sales team/i })).toBeVisible();
});

test("vehicle detail page has conversion actions", async ({ page }) => {
  await page.goto("/inventory/2024-toyota-corolla-hybrid");
  await expect(page.getByRole("heading", { name: /2024 toyota corolla hybrid/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /ask about payments/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /book a test drive/i })).toBeVisible();
});

test("chat endpoint returns a dealership answer", async ({ request }) => {
  const response = await request.post("/api/chat", {
    data: {
      visitorId: "playwright",
      messages: [{ role: "user", content: "What hours are you open?" }],
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.message).toContain("10:00 AM");
});
