/**
 * LICENSE
 * https://github.com/pablosichert/react-truncate/blob/master/LICENSE.md
 *
 * ISC License
Copyright (c) 2016, One.com

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is
hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// Initial version of react-truncate module (v2.4.0)

import React from "react";
import PropTypes from "prop-types";

const cjkCharacters = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export default class Truncate extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        ellipsis: PropTypes.node,
        lines: PropTypes.oneOfType([
            PropTypes.oneOf([false]),
            PropTypes.number,
        ]),
        trimWhitespace: PropTypes.bool,
        width: PropTypes.number,
        onTruncate: PropTypes.func,
    };

    static defaultProps = {
        children: "",
        ellipsis: "…",
        lines: 1,
        trimWhitespace: false,
        width: 0,
    };

    state = {};

    constructor(...args) {
        super(...args);

        this.elements = {};
        this.replacedLinks = [];
    }

    componentDidMount() {
        const {
            elements: { text },
            calcTargetWidth,
            onResize,
        } = this;

        const canvas = document.createElement("canvas");
        this.canvasContext = canvas.getContext("2d");

        calcTargetWidth(() => {
            // Node not needed in document tree to read its content
            if (text && text.parentNode) {
                text.parentNode.removeChild(text);
            }
        });

        window.addEventListener("resize", onResize);

        const container = this.elements.target.parentNode;
        if (typeof ResizeObserver !== "undefined" && container) {
            this.resizeObserver = new ResizeObserver((entries) => {
                this.calcTargetWidth(undefined, entries[0].contentRect.width);
            });
            this.resizeObserver.observe(container);
        }
    }

    componentDidUpdate(prevProps) {
        // Render was based on outdated refs and needs to be rerun
        if (this.props.children !== prevProps.children) {
            this.forceUpdate();
        }

        // If the width prop has changed, recalculate size of contents
        if (this.props.width !== prevProps.width) {
            this.calcTargetWidth();
        }
    }

    componentWillUnmount() {
        const {
            elements: { ellipsis },
            onResize,
            timeout,
        } = this;

        if (ellipsis.parentNode) {
            ellipsis.parentNode.removeChild(ellipsis);
        }

        window.removeEventListener("resize", onResize);
        this.resizeObserver?.disconnect();

        window.cancelAnimationFrame(timeout);
    }

    extractReplaceLinksKeys = (content) => {
        var _self = this,
            i = 0;
        this.replacedLinks = [];

        content.replace(
            /(<a[\s]+([^>]+)>((?:.(?!<\/a>))*.)<\/a>)/g,
            function () {
                const item = Array.prototype.slice.call(arguments, 1, 4);
                do {
                    item.key =
                        "[" + "@".repeat(item[2].length - 1) + "=" + i++ + "]";
                } while (content.includes(item.key));
                _self.replacedLinks.push(item);

                content = content.replace(item[0], item.key);
            }
        );

        return content;
    };

    restoreReplacedLinks = (content) => {
        const parts = [];
        let offset = 0;

        this.replacedLinks.forEach((item, index) => {
            const linkIndex = content.indexOf(item.key, offset);
            if (linkIndex === -1) {
                return;
            }

            if (linkIndex > offset) {
                parts.push(content.slice(offset, linkIndex));
            }

            const parsedLink = new DOMParser()
                .parseFromString(item[0], "text/html")
                .querySelector("a");
            if (parsedLink) {
                const attributes = {};
                const href = parsedLink.getAttribute("href");
                if (href) {
                    try {
                        const protocol = new URL(href, document.baseURI).protocol;
                        if (["http:", "https:", "mailto:", "tel:"].includes(protocol)) {
                            attributes.href = href;
                        }
                    } catch {
                        // Invalid URLs are rendered as non-clickable link text.
                    }
                }

                ["class", "rel", "target", "title"].forEach((attribute) => {
                    const value = parsedLink.getAttribute(attribute);
                    if (value) {
                        attributes[
                            attribute === "class" ? "className" : attribute
                        ] = value;
                    }
                });
                if (attributes.target === "_blank") {
                    attributes.rel = [
                        ...new Set(
                            `${attributes.rel || ""} noopener noreferrer`
                                .trim()
                                .split(/\s+/)
                        ),
                    ].join(" ");
                }
                parts.push(
                    React.createElement(
                        "a",
                        { ...attributes, key: `link-${index}` },
                        parsedLink.textContent
                    )
                );
            }

            offset = linkIndex + item.key.length;
        });

        if (offset < content.length) {
            parts.push(content.slice(offset));
        }

        if (parts.length === 0) {
            return content;
        }
        return parts.length === 1 ? parts[0] : parts;
    };

    stripHtmlTags = (str) => {
        return str.replace(/<[^>]*>/g, " ");
    }

    // Shim innerText to consistently break lines at <br/> but not at \n
    innerText = (node) => {
        const div = document.createElement("div");
        const contentKey =
            "innerText" in window.HTMLElement.prototype
                ? "innerText"
                : "textContent";

        const content = node.innerHTML.replace(/\r\n|\r|\n/g, " ");
        div.innerHTML = this.extractReplaceLinksKeys(content);

        let text = div[contentKey];

        const test = document.createElement("div");
        test.innerHTML = "foo<br/>bar";

        if (test[contentKey].replace(/\r\n|\r/g, "\n") !== "foo\nbar") {
            div.innerHTML = div.innerHTML.replace(/<br.*?[/]?>/gi, "\n");
            text = div[contentKey];
        }

        return text;
    };

    onResize = () => {
        this.calcTargetWidth();
    };

    onTruncate = (didTruncate) => {
        const { onTruncate } = this.props;

        if (typeof onTruncate === "function") {
            this.timeout = window.requestAnimationFrame(() => {
                onTruncate(didTruncate);
            });
        }
    };

    calcTargetWidth = (callback, observedWidth) => {
        const {
            elements: { target },
            calcTargetWidth,
            canvasContext,
            props: { width },
        } = this;

        // Calculation is no longer relevant, since node has been removed
        if (!target) {
            return;
        }

        const targetWidth =
            width ||
            // Use the content-box width when available, and floor subpixels.
            Math.floor(
                observedWidth ?? target.parentNode.getBoundingClientRect().width
            );

        // Delay calculation until parent node is inserted to the document
        // Mounting order in React is ChildComponent, ParentComponent
        if (!targetWidth) {
            return window.requestAnimationFrame(() =>
                calcTargetWidth(callback)
            );
        }

        const style = window.getComputedStyle(target);

        const font = [
            style["font-weight"],
            style["font-style"],
            style["font-size"],
            style["font-family"],
        ].join(" ");

        canvasContext.font = font;

        this.setState(
            {
                targetWidth,
            },
            callback
        );
    };

    measureWidth = (text) => {
        return this.canvasContext.measureText(this.stripHtmlTags(text)).width;
    };

    ellipsisWidth = (node) => {
        return node.offsetWidth;
    };

    trimRight = (text) => {
        return text.replace(/\s+$/, "");
    };

    getLines = () => {
        const {
            elements,
            props: { children, lines: numLines, ellipsis, trimWhitespace },
            state: { targetWidth },
            innerText,
            measureWidth,
            onTruncate,
            trimRight,
            renderLine,
            restoreReplacedLinks,
        } = this;

        const lines = [];
        const text = innerText(elements.text);
        const textLines = text.split("\n").map((line) => line.split(" "));
        let didTruncate = true;
        const ellipsisWidth = this.ellipsisWidth(this.elements.ellipsis);

        for (let line = 1; line <= numLines; line++) {
            const textWords = textLines[0];

            // Handle newline
            if (textWords.length === 0) {
                lines.push();
                textLines.shift();
                line--;
                continue;
            }

            let resultLine = textWords.join(" ");

            if (measureWidth(resultLine) <= targetWidth) {
                if (textLines.length === 1) {
                    // Line is end of text and fits without truncating
                    didTruncate = false;

                    resultLine = restoreReplacedLinks(resultLine);
                    lines.push(resultLine);

                    break;
                }
            }

            if (line === numLines) {
                // Binary search determining the longest possible line inluding truncate string
                const textRest = textWords.join(" ");

                let lower = 0;
                let upper = textRest.length - 1;

                while (lower <= upper) {
                    const middle = Math.floor((lower + upper) / 2);

                    const testLine = textRest.slice(0, middle + 1);

                    if (measureWidth(testLine) + ellipsisWidth <= targetWidth) {
                        lower = middle + 1;
                    } else {
                        upper = middle - 1;
                    }
                }

                let lastLineText = textRest.slice(0, lower);

                if (trimWhitespace) {
                    lastLineText = trimRight(lastLineText);

                    // Remove blank lines from the end of text
                    while (!lastLineText.length && lines.length) {
                        const prevLine = lines.pop();

                        lastLineText = trimRight(prevLine);
                    }
                }

                if (lastLineText.substr(lastLineText.length - 2) === "][") {
                    lastLineText = lastLineText.substring(
                        0,
                        lastLineText.length - 1
                    );
                }

                lastLineText = lastLineText.replace(/\[@+$/, "");
                lastLineText = restoreReplacedLinks(lastLineText);

                resultLine = (
                    <span>
                        {lastLineText}
                        {ellipsis}
                    </span>
                );
            } else {
                // Binary search determining when the line breaks
                let lower = 0;
                let upper = textWords.length - 1;

                while (lower <= upper) {
                    const middle = Math.floor((lower + upper) / 2);

                    const testLine = textWords.slice(0, middle + 1).join(" ");

                    if (measureWidth(testLine) <= targetWidth) {
                        lower = middle + 1;
                    } else {
                        upper = middle - 1;
                    }
                }

                // The first word of this line is too long to fit it
                if (lower === 0) {
                    const firstWord = textWords[0];
                    const characters = Array.from(firstWord);
                    const containsLink = this.replacedLinks.some(({ key }) =>
                        firstWord.includes(key)
                    );

                    if (cjkCharacters.test(firstWord) && !containsLink) {
                        let characterLower = 0;
                        let characterUpper = characters.length - 1;

                        while (characterLower <= characterUpper) {
                            const middle = Math.floor(
                                (characterLower + characterUpper) / 2
                            );
                            const testLine = characters
                                .slice(0, middle + 1)
                                .join("");

                            if (measureWidth(testLine) <= targetWidth) {
                                characterLower = middle + 1;
                            } else {
                                characterUpper = middle - 1;
                            }
                        }

                        if (characterLower > 0) {
                            textWords[0] = characters
                                .slice(characterLower)
                                .join("");
                            lines.push(
                                characters.slice(0, characterLower).join("")
                            );
                            continue;
                        }
                    }

                    // Jump to processing of last line
                    line = numLines - 1;
                    continue;
                }

                resultLine = textWords.slice(0, lower).join(" ");

                resultLine = restoreReplacedLinks(resultLine);

                textLines[0].splice(0, lower);
            }

            lines.push(resultLine);
        }

        onTruncate(didTruncate);

        if (didTruncate && typeof children !== "string") {
            return (
                <React.Fragment>
                    <span
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: numLines,
                            overflow: "hidden",
                        }}
                    >
                        {children}
                    </span>
                    {ellipsis}
                </React.Fragment>
            );
        }

        if (!didTruncate && typeof children !== "string") {
            return children;
        }

        return lines.map(renderLine);
    };

    renderLine = (line, i, arr) => {
        if (i === arr.length - 1) {
            return <span key={i}>{line}</span>;
        } else {
            const br = <br key={i + "br"} />;

            if (line) {
                return [<span key={i}>{line}</span>, br];
            } else {
                return br;
            }
        }
    };

    render() {
        const {
            elements: { target },
            props: { children, ellipsis, lines, ...spanProps },
            state: { targetWidth },
            getLines,
            onTruncate,
        } = this;

        let text;

        const mounted = !!(target && targetWidth);

        if (typeof window !== "undefined" && mounted) {
            if (lines > 0) {
                text = getLines();
            } else {
                text = children;

                onTruncate(false);
            }
        }

        delete spanProps.onTruncate;
        delete spanProps.trimWhitespace;

        return (
            <span
                {...spanProps}
                ref={(targetEl) => {
                    this.elements.target = targetEl;
                }}
            >
                <span
                    style={{
                        display: "block",
                        maxWidth: spanProps.width > 0 ? `${spanProps.width}px` : "unset",
                    }}
                >
                    {text}
                </span>
                <span
                    ref={(textEl) => {
                        this.elements.text = textEl;
                    }}
                >
                    {children}
                </span>
                <span
                    ref={(ellipsisEl) => {
                        this.elements.ellipsis = ellipsisEl;
                    }}
                    style={this.styles.ellipsis}
                >
                    {ellipsis}
                </span>
            </span>
        );
    }

    styles = {
        ellipsis: {
            position: "fixed",
            visibility: "hidden",
            top: 0,
            left: 0,
        },
    };
}
