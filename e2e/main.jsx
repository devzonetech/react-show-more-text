import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ShowMoreText from "../src/ShowMoreText.jsx";

const longText =
    "Readable previews help people decide whether to continue. " +
    "This paragraph contains enough content to exercise line measurement, " +
    "truncation, and expansion in a real browser. ".repeat(8) +
    "FULL_CONTENT_END";

const htmlContent =
    "<p><strong>Trusted HTML heading</strong> with links: " +
    '<a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a>, ' +
    '<a href="mailto:hello@example.com">email</a>, ' +
    "and additional text.</p>" +
    `<p>${"More trusted HTML content for measuring and truncation. ".repeat(8)}</p>`;

function Playground() {
    const [clickState, setClickState] = useState("not clicked");
    const [truncateCount, setTruncateCount] = useState(0);
    const [containerWidth, setContainerWidth] = useState(700);

    return (
        <main>
            <section aria-label="Basic truncation">
                <ShowMoreText
                    id="basic-content"
                    aria-label="Toggle article preview"
                    className="custom-wrapper"
                    anchorClass="custom-toggle"
                    lines={2}
                    more="Read more"
                    less="Read less"
                    truncatedEndingComponent=" [continue] "
                    onClick={(isExpanded) =>
                        setClickState(String(isExpanded))
                    }
                    onTruncate={() =>
                        setTruncateCount((count) => count + 1)
                    }
                >
                    {longText}
                </ShowMoreText>
                <output data-testid="click-state">{clickState}</output>
                <output data-testid="truncate-count">{truncateCount}</output>
            </section>

            <section aria-label="Initially expanded">
                <ShowMoreText id="expanded-content" lines={1} expanded>
                    {longText}
                </ShowMoreText>
            </section>

            <section aria-label="Truncation disabled">
                <ShowMoreText lines={false}>{longText}</ShowMoreText>
                <ShowMoreText lines={0}>{longText}</ShowMoreText>
            </section>

            <section aria-label="Rich React content">
                <ShowMoreText lines={1} width={220}>
                    <span>
                        <strong>Bold introduction</strong>{" "}
                        <em>emphasized text</em>{" "}
                        <span className="mention">@mention</span>{" "}
                        {longText}
                    </span>
                </ShowMoreText>
            </section>

            <section aria-label="Trusted HTML">
                <ShowMoreText
                    id="html-content"
                    lines={3}
                    width={500}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </section>

            <section aria-label="Newline preservation">
                <ShowMoreText lines={2} keepNewLines>
                    {"First preserved line\nSecond preserved line\nThird line"}
                </ShowMoreText>
            </section>

            <section aria-label="Expansion disabled">
                <ShowMoreText
                    lines={1}
                    expandByClick={false}
                    onClick={(isExpanded) =>
                        setClickState(`disabled:${isExpanded}`)
                    }
                >
                    {longText}
                </ShowMoreText>
            </section>

            <section aria-label="Responsive width">
                <button
                    type="button"
                    onClick={() =>
                        setContainerWidth((width) =>
                            width === 700 ? 140 : 700
                        )
                    }
                >
                    Resize preview
                </button>
                <div
                    data-testid="responsive-container"
                    style={{ width: `${containerWidth}px` }}
                >
                    <ShowMoreText lines={1}>
                        This short sentence fits at a wide width but needs to
                        be truncated when the preview becomes narrow.
                    </ShowMoreText>
                </div>
            </section>

            <section aria-label="Fixed measurement width">
                <div style={{ width: "500px" }}>
                    <ShowMoreText lines={1} width={120}>
                        {longText}
                    </ShowMoreText>
                </div>
            </section>

            <section aria-label="CJK text">
                <div style={{ width: "120px" }}>
                    <ShowMoreText lines={2}>
                        {"日本語の文章を文字単位で折り返して表示します。".repeat(8)}
                    </ShowMoreText>
                </div>
            </section>

            <section aria-label="Interactive child">
                <ShowMoreText lines={5} width={600}>
                    Click the interactive child:
                    <button
                        type="button"
                        onClick={(event) => {
                            event.currentTarget.textContent = "Child clicked";
                        }}
                    >
                        Click child
                    </button>
                </ShowMoreText>
            </section>

            <section aria-label="Animated expansion">
                <ShowMoreText lines={1} animate>
                    {longText}
                </ShowMoreText>
            </section>

            <section aria-label="Unique generated IDs">
                <ShowMoreText lines={1}>{longText}</ShowMoreText>
                <ShowMoreText lines={1}>{longText}</ShowMoreText>
            </section>
        </main>
    );
}

createRoot(document.getElementById("root")).render(<Playground />);
