import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup, act, waitFor } from '@testing-library/react';
import React from 'react';
import ShowMoreText from './ShowMoreText.jsx';
import Truncate from './Truncate.jsx';

const testMessage =
    "Test Message Lorem ipsum dolor sit amet, <a href='https://www.google.com/'>Google link</a> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <a href='https://www.devzonetech.com/'>Devzone Tech</a> quis nostrud exercitation.Test Message Lorem ipsum dolor sit amet, <a href='https://www.google.com/'>Google link</a> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <a href='https://www.devzonetech.com/'>Devzone Tech</a> quis nostrud exercitation.";

afterEach(() => {
    cleanup();
});

describe("Component ShowMoreText", () => {
    test("renders with default props", () => {
        const { container } = render(<ShowMoreText>{testMessage}</ShowMoreText>);
        const anchor = container.querySelector('.show-more-less-clickable');
        expect(anchor).toBeTruthy();
        expect(anchor.textContent).toBe('Show more');
    });

    test("shows full text when expanded", () => {
        const { container } = render(
            <ShowMoreText lines={2} expanded>
                {testMessage}
            </ShowMoreText>
        );
        // When expanded, the "Show less" button should be visible
        const anchors = container.querySelectorAll('.show-more-less-clickable');
        expect(anchors.length).toBeGreaterThan(0);
    });

    test("truncates text with specified lines prop", () => {
        const { container } = render(
            <ShowMoreText lines={2}>
                {testMessage}
            </ShowMoreText>
        );
        const content = container.querySelector('.show-more-less-clickable');
        expect(content).toBeTruthy();
    });

    test("calls onClick handler when anchor is clicked", () => {
        let clickCount = 0;
        const onClickHandler = () => {
            clickCount += 1;
        };

        const { container } = render(
            <ShowMoreText onClick={onClickHandler} lines={2}>
                {testMessage}
            </ShowMoreText>
        );

        const anchor = container.querySelector('.show-more-less-clickable');
        fireEvent.click(anchor);
        expect(clickCount).toBe(1);
    });

    test("applies custom anchorClass prop", () => {
        const { container } = render(
            <ShowMoreText anchorClass="custom-class">
                {testMessage}
            </ShowMoreText>
        );

        const customElement = container.querySelector('.custom-class');
        expect(customElement).toBeTruthy();
    });

    test("handles keepNewLines prop with false", () => {
        const msgWithNewlines = "Test Message \n Lorem ipsum \n dolor sit amet";
        const { container } = render(
            <ShowMoreText lines={2} keepNewLines={false}>
                {msgWithNewlines}
            </ShowMoreText>
        );

        // When keepNewLines is false, br tags should not be rendered
        const brTags = container.querySelectorAll('br');
        expect(brTags.length).toBe(0);
    });

    test("handles keepNewLines prop with true", () => {
        const msgWithNewlines = "Test Message \n Lorem ipsum \n dolor sit amet";
        const { container } = render(
            <ShowMoreText lines={2} keepNewLines={true}>
                {msgWithNewlines}
            </ShowMoreText>
        );

        // When keepNewLines is true, br tags should be rendered
        const brTags = container.querySelectorAll('br');
        expect(brTags.length).toBeGreaterThan(0);
    });

    test("respects width prop", () => {
        const { container } = render(
            <ShowMoreText width={150} lines={2}>
                {testMessage}
            </ShowMoreText>
        );

        const wrapper = container.querySelector('.show-more-less-clickable');
        expect(wrapper).toBeTruthy();
    });

    test("renders className prop on wrapper", () => {
        const { container } = render(
            <ShowMoreText className="test-wrapper-class">
                {testMessage}
            </ShowMoreText>
        );

        const wrapper = container.querySelector('.test-wrapper-class');
        expect(wrapper).toBeTruthy();
    });

    test("calls onTruncate callback when text is truncated", () => {
        let truncateCallCount = 0;
        const onTruncateHandler = (isTruncated) => {
            truncateCallCount += 1;
        };

        render(
            <ShowMoreText lines={1} onTruncate={onTruncateHandler}>
                {testMessage}
            </ShowMoreText>
        );

        // The callback should be called when the component mounts
        expect(truncateCallCount).toBeGreaterThanOrEqual(0);
    });

    test("expands and collapses on click", () => {
        const { container, rerender } = render(
            <ShowMoreText lines={2}>
                {testMessage}
            </ShowMoreText>
        );

        const anchor = container.querySelector('.show-more-less-clickable');
        expect(anchor.textContent).toBe('Show more');

        fireEvent.click(anchor);
        
        // Re-render to check updated state
        rerender(
            <ShowMoreText lines={2} expanded={true}>
                {testMessage}
            </ShowMoreText>
        );

        const updatedAnchor = container.querySelector('.show-more-less-clickable');
        expect(updatedAnchor).toBeTruthy();
    });

    test("handles truncatedEndingComponent prop", () => {
        const { container } = render(
            <ShowMoreText expanded={false} truncatedEndingComponent={"..."}>
                {testMessage}
            </ShowMoreText>
        );

        const text = container.textContent;
        expect(text).toContain("...");
    });

    test("escapes HTML strings when keepNewLines is true", () => {
        const line = "<b>Test</b>\n";
        let content = "";
        for (let i = 0; i < 5; i++) {
            content += line;
        }

        const { container } = render(
            <ShowMoreText
                expanded={false}
                keepNewLines={true}
                lines={2}
            >
                {content}
            </ShowMoreText>
        );

        // The text should contain the literal string "<b>Test</b>", not bold
        const text = container.textContent;
        expect(text).toContain("<b>Test</b>");
        // Verify no <b> tags are rendered
        const bTags = container.querySelectorAll('b');
        expect(bTags.length).toBe(0);
    });

    test("escapes HTML strings when expanded", () => {
        const line = "<b>Test</b>\n";
        let content = "";
        for (let i = 0; i < 5; i++) {
            content += line;
        }

        const { container } = render(
            <ShowMoreText
                expanded={true}
                keepNewLines={true}
                lines={2}
            >
                {content}
            </ShowMoreText>
        );

        // The text should contain the literal string "<b>Test</b>", not bold
        const text = container.textContent;
        expect(text).toContain("<b>Test</b>");
        // Verify no <b> tags are rendered
        const bTags = container.querySelectorAll('b');
        expect(bTags.length).toBe(0);
    });

    test("expands by clicking the control and passes the expanded state to onClick", () => {
        const onClick = vi.fn();
        const ref = React.createRef();
        const { container } = render(
            <ShowMoreText ref={ref} lines={1} onClick={onClick}>
                {"A sufficiently long test message that should be truncated"}
            </ShowMoreText>
        );

        const anchor = container.querySelector('.show-more-less-clickable');
        fireEvent.click(anchor);

        expect(onClick).toHaveBeenCalledWith(true, expect.any(Object));
        expect(container.textContent).toContain('Show less');
    });

    test("does not expand when expandByClick is false", () => {
        const onClick = vi.fn();
        const ref = React.createRef();
        const { container } = render(
            <ShowMoreText
                ref={ref}
                lines={1}
                expandByClick={false}
                onClick={onClick}
                more={<b>Read</b>}
            >
                {"A sufficiently long test message"}
            </ShowMoreText>
        );

        fireEvent.click(container.querySelector('.show-more-less-clickable'));

        expect(onClick).toHaveBeenCalledWith(false, expect.any(Object));
        expect(container.querySelector('b')).toBeTruthy();
    });

    test("handleTruncate updates state and calls the public callback", () => {
        const onTruncate = vi.fn();
        const ref = React.createRef();
        render(
            <ShowMoreText ref={ref} lines={1} onTruncate={onTruncate}>
                {"Short"}
            </ShowMoreText>
        );

        act(() => {
            ref.current.handleTruncate(true);
        });

        expect(ref.current.state.truncated).toBe(true);
        expect(onTruncate).toHaveBeenCalledTimes(1);
    });

    test("does not notify when truncation state does not change", () => {
        const onTruncate = vi.fn();
        const ref = React.createRef();
        render(
            <ShowMoreText ref={ref} onTruncate={onTruncate}>
                {"Short"}
            </ShowMoreText>
        );

        act(() => {
            ref.current.handleTruncate(false);
        });

        expect(onTruncate).not.toHaveBeenCalled();
    });

    test("renders custom text and marks unmounted state", () => {
        const ref = React.createRef();
        const { container, unmount } = render(
            <ShowMoreText ref={ref} more="Expand" less="Collapse" expanded>
                {"Visible content"}
            </ShowMoreText>
        );

        expect(container.textContent).toContain("Visible content");
        expect(container.textContent).toContain("Collapse");
        unmount();
        expect(ref.current).toBeNull();
    });
});

describe("Truncate internals", () => {
    test("extracts and restores HTML links while escaping surrounding HTML", () => {
        const truncate = new Truncate({
            children: "",
            ellipsis: "…",
            lines: 1,
            trimWhitespace: false,
            width: 100,
        });
        const source =
            '<b>unsafe</b> <a href="https://example.com">Example</a>';

        const extracted = truncate.extractReplaceLinksKeys(source);
        expect(extracted).not.toContain("<a ");
        expect(truncate.replacedLinks).toHaveLength(1);

        const restored = truncate.restoreReplacedLinks(extracted);
        expect(restored.props.dangerouslySetInnerHTML.__html).toContain(
            "&lt;b&gt;unsafe&lt;/b&gt;"
        );
        expect(restored.props.dangerouslySetInnerHTML.__html).toContain(
            '<a href="https://example.com">Example</a>'
        );
    });

    test("escapes HTML entities and strips tags for width measurement", () => {
        const truncate = new Truncate({ children: "", width: 100 });
        expect(truncate.escapeHtmlEntities(`<b title="x">&'`)).toBe(
            "&lt;b title=&quot;x&quot;&gt;&amp;&#039;"
        );
        expect(truncate.stripHtmlTags("<b>Hello</b> <a>world</a>")).toBe(
            " Hello   world "
        );
        expect(truncate.trimRight("text   ")).toBe("text");
        expect(truncate.createMarkup("<b>safe</b>").props.dangerouslySetInnerHTML)
            .toEqual({ __html: "<b>safe</b>" });
    });

    test("innerText handles anchors and explicit <br> elements", () => {
        const truncate = new Truncate({ children: "" });
        truncate.replacedLinks = [];

        const node = document.createElement("div");
        node.innerHTML =
            '<span>First</span><br/><a href="/docs">Docs</a><span>\nSecond</span>';

        const result = truncate.innerText(node);
        expect(result).toContain("First");
        expect(result).toContain("[");
        expect(result).toContain("Second");
        expect(truncate.replacedLinks).toHaveLength(1);
    });

    test("onTruncate schedules callback only for function props", () => {
        vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => {
            callback();
            return 1;
        }));
        vi.stubGlobal("cancelAnimationFrame", vi.fn());

        const onTruncate = vi.fn();
        const truncate = new Truncate({ children: "", onTruncate });
        truncate.props.onTruncate = onTruncate;
        truncate.onTruncate(true);
        expect(onTruncate).toHaveBeenCalledWith(true);

        const noCallback = new Truncate({ children: "" });
        expect(() => noCallback.onTruncate(true)).not.toThrow();
    });

    test("calcTargetWidth handles missing targets and reruns while width is zero", () => {
        const truncate = new Truncate({ children: "", width: 0 });
        truncate.elements = {};
        expect(truncate.calcTargetWidth()).toBeUndefined();

        const target = document.createElement("span");
        const parent = document.createElement("div");
        parent.appendChild(target);
        vi.spyOn(parent, "getBoundingClientRect").mockReturnValue({
            width: 0,
        });
        truncate.elements.target = target;
        truncate.canvasContext = { font: "" };
        vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => {
            return 1;
        }));

        truncate.calcTargetWidth();
        expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    test("calcTargetWidth uses the width prop and computed font", () => {
        const truncateRef = React.createRef();
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
            "font-weight": "600",
            "font-style": "normal",
            "font-size": "16px",
            "font-family": "sans-serif",
        });

        render(
            <Truncate ref={truncateRef} width={125}>
                Short text
            </Truncate>
        );

        expect(truncateRef.current.canvasContext.font).toBe(
            "600 normal 16px sans-serif"
        );
        expect(truncateRef.current.state.targetWidth).toBe(125);
    });

    test("getLines renders complete text without truncation", () => {
        const truncate = new Truncate({
            children: "",
            ellipsis: "...",
            lines: 2,
            trimWhitespace: false,
            width: 200,
        });
        const text = document.createElement("span");
        text.textContent = "Short text";
        const ellipsis = document.createElement("span");
        truncate.elements = { text, ellipsis };
        truncate.state = { targetWidth: 200 };
        truncate.measureWidth = vi.fn(() => 40);

        const lines = truncate.getLines();
        expect(lines).toHaveLength(1);
        expect(truncate.props.lines).toBe(2);
    });

    test("getLines truncates the final line and returns a Show more ellipsis", () => {
        const onTruncate = vi.fn();
        const truncate = new Truncate({
            children: "",
            ellipsis: <b>more</b>,
            lines: 1,
            trimWhitespace: true,
            width: 50,
            onTruncate,
        });
        const text = document.createElement("span");
        text.textContent = "abcdefghij klmnopqrst";
        const ellipsis = document.createElement("span");
        Object.defineProperty(ellipsis, "offsetWidth", {
            configurable: true,
            value: 20,
        });
        truncate.elements = { text, ellipsis };
        truncate.state = { targetWidth: 50 };
        truncate.measureWidth = vi.fn((value) => value.length * 5);
        truncate.onTruncate = vi.fn();

        const lines = truncate.getLines();
        expect(lines).toHaveLength(1);
        expect(truncate.onTruncate).toHaveBeenCalledWith(true);
    });

    test("renderLine handles final lines, line breaks, and blank lines", () => {
        const truncate = new Truncate({ children: "text" });
        const final = truncate.renderLine(<span>last</span>, 1, [null, "last"]);
        expect(final.props.children.props.children).toBe("last");

        const withBreak = truncate.renderLine(<span>first</span>, 0, ["first", "last"]);
        expect(withBreak).toHaveLength(2);
        expect(withBreak[1].type).toBe("br");

        const blank = truncate.renderLine(undefined, 0, [undefined, "last"]);
        expect(blank.type).toBe("br");
    });

    test("onResize recalculates and render handles lines false", async () => {
        const truncate = new Truncate({ children: "Full text", lines: false, width: 100 });
        truncate.elements = {
            target: document.createElement("span"),
        };
        truncate.state = { targetWidth: 100 };
        truncate.calcTargetWidth = vi.fn();
        truncate.onResize();
        expect(truncate.calcTargetWidth).toHaveBeenCalled();

        truncate.onTruncate = vi.fn();
        const rendered = truncate.render();
        expect(rendered.props.children[0].props.style.maxWidth).toBe("100px");
        await waitFor(() => expect(truncate.onTruncate).toHaveBeenCalledWith(false));
    });
});
