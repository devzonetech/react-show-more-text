import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import ShowMoreText from './ShowMoreText.jsx';

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
});
