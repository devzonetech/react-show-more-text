import { expect, test } from "@playwright/test";

const basicSection = (page) =>
    page.getByRole("region", { name: "Basic truncation" });

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("truncates to the configured lines and toggles accessibly with callbacks", async ({
    page,
}) => {
    const section = basicSection(page);
    const button = section.getByRole("button", {
        name: "Toggle article preview",
    });

    await expect(button).toHaveText("Read more");
    await expect(button).toHaveAttribute("type", "button");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveAttribute("aria-controls", "basic-content");
    await expect(section.locator(".custom-wrapper")).toBeVisible();
    await expect(button).toHaveClass(/custom-toggle/);
    await expect(section).toContainText("[continue]");
    await expect(
        section.getByText("FULL_CONTENT_END", { exact: true })
    ).toBeHidden();
    const truncateCount = section.getByTestId("truncate-count");
    await expect
        .poll(async () => Number(await truncateCount.textContent()))
        .toBeGreaterThan(0);
    const initialTruncateCount = Number(await truncateCount.textContent());

    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");

    const collapseButton = section.getByRole("button", {
        name: "Toggle article preview",
    });
    await expect(collapseButton).toHaveText("Read less");
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await expect(section.getByText("FULL_CONTENT_END")).toBeVisible();
    await expect(section.getByTestId("click-state")).toHaveText("true");
    await expect
        .poll(async () => Number(await truncateCount.textContent()))
        .toBeGreaterThan(initialTruncateCount);

    await collapseButton.focus();
    await page.keyboard.press("Space");
    await expect(
        section.getByRole("button", { name: "Toggle article preview" })
    ).toHaveAttribute("aria-expanded", "false");
    await expect(section.getByTestId("click-state")).toHaveText("false");
});

test("starts expanded and supports truncation-disabled line values", async ({
    page,
}) => {
    const expanded = page.getByRole("region", { name: "Initially expanded" });

    await expect(
        expanded.getByRole("button", { name: "Show less" })
    ).toHaveAttribute("aria-expanded", "true");
    await expect(expanded.getByText("FULL_CONTENT_END")).toBeVisible();

    const disabled = page.getByRole("region", { name: "Truncation disabled" });
    await expect(disabled).toContainText("FULL_CONTENT_END");
    await expect(disabled.getByRole("button")).toHaveCount(0);
});

test("preserves rich React markup and child interactions", async ({ page }) => {
    const rich = page.getByRole("region", { name: "Rich React content" });
    await expect(rich.locator("strong")).toHaveText("Bold introduction");
    await expect(rich.locator("em")).toHaveText("emphasized text");
    await expect(rich.locator(".mention")).toHaveText("@mention");
    await expect(rich.getByRole("button", { name: "Show more" })).toBeVisible();

    const interactive = page.getByRole("region", {
        name: "Interactive child",
    });
    await interactive.getByRole("button", { name: "Click child" }).click();
    await expect(
        interactive.getByRole("button", { name: "Child clicked" })
    ).toBeVisible();
});

test("renders trusted HTML and retains link attributes", async ({
    page,
}) => {
    const section = page.getByRole("region", { name: "Trusted HTML" });

    await expect(section.locator("strong")).toHaveText("Trusted HTML heading");
    await expect(section.getByRole("link", { name: "React" })).toHaveAttribute(
        "href",
        "https://react.dev/"
    );
    await expect(section.getByRole("link", { name: "React" })).toHaveAttribute(
        "target",
        "_blank"
    );
    await expect(section.getByRole("link", { name: "React" })).toHaveAttribute(
        "rel",
        "noopener noreferrer"
    );
    await expect(section.getByRole("link", { name: "email" })).toHaveAttribute(
        "href",
        "mailto:hello@example.com"
    );
    await section.getByRole("button", { name: "Show more" }).click();
    await expect(section.locator("p").last()).toContainText(
        "More trusted HTML content"
    );
});

test("preserves explicit newlines in string content", async ({ page }) => {
    const section = page.getByRole("region", {
        name: "Newline preservation",
    });

    await expect(section.locator("br")).toHaveCount(2);
    await expect(section).toContainText("First preserved line");
});

test("calls the click callback without expanding when expansion is disabled", async ({
    page,
}) => {
    const section = page.getByRole("region", { name: "Expansion disabled" });
    const button = section.getByRole("button", { name: "Show more" });

    await button.click();
    await expect(section.getByRole("button", { name: "Show more" })).toHaveAttribute(
        "aria-expanded",
        "false"
    );
    await expect(page.getByTestId("click-state")).toHaveText("disabled:false");
});

test("recalculates truncation when the container is resized", async ({
    page,
}) => {
    const section = page.getByRole("region", { name: "Responsive width" });
    const preview = section.locator(".show-more-text-content");

    await expect(section.getByRole("button", { name: "Show more" })).toHaveCount(
        0
    );
    await section.getByRole("button", { name: "Resize preview" }).click();
    await expect(section.getByTestId("responsive-container")).toHaveCSS(
        "width",
        "140px"
    );
    await expect(section.getByRole("button", { name: "Show more" })).toBeVisible();
    await expect(preview).toBeVisible();
});

test("uses a supplied measurement width and wraps CJK text by character", async ({
    page,
}) => {
    const fixedWidth = page.getByRole("region", {
        name: "Fixed measurement width",
    });
    await expect(
        fixedWidth.getByRole("button", { name: "Show more" })
    ).toBeVisible();

    const cjk = page.getByRole("region", { name: "CJK text" });
    await expect(cjk.getByRole("button", { name: "Show more" })).toBeVisible();
});

test("animates expansion unless reduced motion is requested", async ({
    page,
}) => {
    const section = page.getByRole("region", { name: "Animated expansion" });
    const content = section.locator(".show-more-text-content");
    const button = section.getByRole("button", { name: "Show more" });

    await expect(content).toHaveCSS("transition-duration", "0.3s");
    await button.click();
    await expect(section.getByRole("button", { name: "Show less" })).toHaveAttribute(
        "aria-expanded",
        "true"
    );

    await expect
        .poll(() => content.evaluate((element) => element.style.height))
        .toBe("auto");

    const reducedMotionPage = await page.context().newPage();
    await reducedMotionPage.emulateMedia({ reducedMotion: "reduce" });
    await reducedMotionPage.goto("/");
    const reducedMotionSection = reducedMotionPage.getByRole("region", {
        name: "Animated expansion",
    });
    const reducedMotionContent = reducedMotionSection.locator(
        ".show-more-text-content"
    );
    await reducedMotionSection.getByRole("button", { name: "Show more" }).click();
    await expect(
        reducedMotionSection.getByRole("button", { name: "Show less" })
    ).toHaveAttribute(
        "aria-expanded",
        "true"
    );
    await expect
        .poll(() =>
            reducedMotionContent.evaluate((element) => element.style.height)
        )
        .toBe("");
});

test("generates unique IDs for independent content regions", async ({ page }) => {
    const section = page.getByRole("region", { name: "Unique generated IDs" });
    const controls = await section
        .locator("button:visible")
        .evaluateAll((buttons) =>
            buttons.map((button) => button.getAttribute("aria-controls"))
        );

    expect(controls).toHaveLength(2);
    expect(new Set(controls).size).toBe(2);
    for (const id of controls) {
        await expect(section.locator(`[id="${id}"]`)).toHaveCount(1);
    }
});
