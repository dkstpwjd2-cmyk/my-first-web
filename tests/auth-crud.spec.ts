import { expect, test } from "@playwright/test";

test("행복 경로: 로그인 후 새 포스트를 작성한다", async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  test.skip(
    !email || !password,
    "TEST_EMAIL, TEST_PASSWORD 환경변수가 있어야 로그인 E2E를 실행합니다."
  );

  const title = `Ch13 E2E ${Date.now()}`;
  const content = "Playwright로 작성한 Ch13 검증용 포스트입니다.";

  await page.goto("/login");
  await page.getByLabel("이메일").fill(email!);
  await page.getByLabel("비밀번호").fill(password!);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL(/\/posts$/);

  await page.goto("/posts/new");
  await expect(page).toHaveURL(/\/posts\/new$/);

  await page.getByLabel("제목").fill(title);
  await page.getByLabel("내용").fill(content);
  await page.getByRole("button", { name: "저장하기" }).click();

  await expect(page).toHaveURL(/\/posts\/[^/]+$/);
  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText(content)).toBeVisible();
});

test("거절 경로: 비로그인 사용자의 새 포스트 작성 접근을 로그인으로 보낸다", async ({
  page,
}) => {
  await page.goto("/posts/new");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel("이메일")).toBeVisible();
  await expect(page.getByLabel("비밀번호")).toBeVisible();
});
