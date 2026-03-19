"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
 */ // Initial version of react-truncate module (v2.4.0)
class Truncate extends _react.default.Component {
  constructor() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    super(...args);
    _defineProperty(this, "state", {});
    _defineProperty(this, "extractReplaceLinksKeys", content => {
      var _self = this,
        i = 0;
      this.replacedLinks = [];
      content.replace(/(<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>)/g, function () {
        const item = Array.prototype.slice.call(arguments, 1, 4);
        item.key = "[" + "@".repeat(item[2].length - 1) + "=" + i++ + "]";
        _self.replacedLinks.push(item);
        content = content.replace(item[0], item.key);
      });
      return content;
    });
    _defineProperty(this, "restoreReplacedLinks", content => {
      // This method restores the <a> tags that were extracted earlier
      // We need to be careful to:
      // 1. Keep actual <a> tags unescaped (they should render as HTML)
      // 2. Escape all other HTML-like content to prevent rendering of non-link HTML tags

      // Build a map of placeholders and their corresponding link HTML
      const linkMap = {};
      this.replacedLinks.forEach(item => {
        linkMap[item.key] = item[0];
      });

      // Escape all HTML entities first
      let escapedContent = this.escapeHtmlEntities(content);

      // Now replace the escaped placeholders with the unescaped link HTML
      this.replacedLinks.forEach(item => {
        const escapedKey = this.escapeHtmlEntities(item.key);
        escapedContent = escapedContent.replace(escapedKey, item[0]);
      });
      return this.createMarkup(escapedContent);
    });
    _defineProperty(this, "stripHtmlTags", str => {
      return str.replace(/<[^>]*>/g, " ");
    });
    _defineProperty(this, "escapeHtmlEntities", text => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, char => map[char]);
    });
    // Shim innerText to consistently break lines at <br/> but not at \n
    _defineProperty(this, "innerText", node => {
      const div = document.createElement("div");
      const contentKey = "innerText" in window.HTMLElement.prototype ? "innerText" : "textContent";
      const content = node.innerHTML.replace(/\r\n|\r|\n/g, " ");
      div.innerHTML = this.extractReplaceLinksKeys(content);
      let text = div[contentKey];
      const test = document.createElement("div");
      test.innerHTML = "foo<br/>bar";
      if (test[contentKey].replace(/\r\n|\r/g, "\n") !== "foo\nbar") {
        div.innerHTML = div.innerHTML.replace(/<br.*?[\/]?>/gi, "\n");
        text = div[contentKey];
      }
      return text;
    });
    _defineProperty(this, "onResize", () => {
      this.calcTargetWidth();
    });
    _defineProperty(this, "onTruncate", didTruncate => {
      const {
        onTruncate
      } = this.props;
      if (typeof onTruncate === "function") {
        this.timeout = window.requestAnimationFrame(() => {
          onTruncate(didTruncate);
        });
      }
    });
    _defineProperty(this, "calcTargetWidth", callback => {
      const {
        elements: {
          target
        },
        calcTargetWidth,
        canvasContext,
        props: {
          width
        }
      } = this;

      // Calculation is no longer relevant, since node has been removed
      if (!target) {
        return;
      }
      const targetWidth = width ||
      // Floor the result to deal with browser subpixel precision
      Math.floor(target.parentNode.getBoundingClientRect().width);

      // Delay calculation until parent node is inserted to the document
      // Mounting order in React is ChildComponent, ParentComponent
      if (!targetWidth) {
        return window.requestAnimationFrame(() => calcTargetWidth(callback));
      }
      const style = window.getComputedStyle(target);
      const font = [style["font-weight"], style["font-style"], style["font-size"], style["font-family"]].join(" ");
      canvasContext.font = font;
      this.setState({
        targetWidth
      }, callback);
    });
    _defineProperty(this, "measureWidth", text => {
      return this.canvasContext.measureText(this.stripHtmlTags(text)).width;
    });
    _defineProperty(this, "ellipsisWidth", node => {
      return node.offsetWidth;
    });
    _defineProperty(this, "trimRight", text => {
      return text.replace(/\s+$/, "");
    });
    _defineProperty(this, "createMarkup", str => {
      return /*#__PURE__*/_react.default.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: str
        }
      });
    });
    _defineProperty(this, "getLines", () => {
      const {
        elements,
        props: {
          lines: numLines,
          ellipsis,
          trimWhitespace
        },
        state: {
          targetWidth
        },
        innerText,
        measureWidth,
        onTruncate,
        trimRight,
        renderLine,
        restoreReplacedLinks
      } = this;
      const lines = [];
      const text = innerText(elements.text);
      const textLines = text.split("\n").map(line => line.split(" "));
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
            lastLineText = lastLineText.substring(0, lastLineText.length - 1);
          }
          lastLineText = lastLineText.replace(/\[@+$/, "");
          lastLineText = restoreReplacedLinks(lastLineText);
          resultLine = /*#__PURE__*/_react.default.createElement("span", null, lastLineText, ellipsis);
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
      return lines.map(renderLine);
    });
    _defineProperty(this, "renderLine", (line, i, arr) => {
      if (i === arr.length - 1) {
        return /*#__PURE__*/_react.default.createElement("span", {
          key: i
        }, line);
      } else {
        const br = /*#__PURE__*/_react.default.createElement("br", {
          key: i + "br"
        });
        if (line) {
          return [/*#__PURE__*/_react.default.createElement("span", {
            key: i
          }, line), br];
        } else {
          return br;
        }
      }
    });
    _defineProperty(this, "styles", {
      ellipsis: {
        position: "fixed",
        visibility: "hidden",
        top: 0,
        left: 0
      }
    });
    this.elements = {};
    this.replacedLinks = [];
  }
  componentDidMount() {
    const {
      elements: {
        text
      },
      calcTargetWidth,
      onResize
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
      elements: {
        ellipsis
      },
      onResize,
      timeout
    } = this;
    if (ellipsis.parentNode) {
      ellipsis.parentNode.removeChild(ellipsis);
    }
    window.removeEventListener("resize", onResize);
    window.cancelAnimationFrame(timeout);
  }
  render() {
    const {
      elements: {
        target
      },
      props: {
        children,
        ellipsis,
        lines,
        ...spanProps
      },
      state: {
        targetWidth
      },
      getLines,
      onTruncate
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
    return /*#__PURE__*/_react.default.createElement("span", _extends({}, spanProps, {
      ref: targetEl => {
        this.elements.target = targetEl;
      }
    }), /*#__PURE__*/_react.default.createElement("span", {
      style: {
        display: "block",
        maxWidth: spanProps.width > 0 ? `${spanProps.width}px` : "unset"
      }
    }, text), /*#__PURE__*/_react.default.createElement("span", {
      ref: textEl => {
        this.elements.text = textEl;
      }
    }, children), /*#__PURE__*/_react.default.createElement("span", {
      ref: ellipsisEl => {
        this.elements.ellipsis = ellipsisEl;
      },
      style: this.styles.ellipsis
    }, ellipsis));
  }
}
exports.default = Truncate;
_defineProperty(Truncate, "propTypes", {
  children: _propTypes.default.node,
  ellipsis: _propTypes.default.node,
  lines: _propTypes.default.oneOfType([_propTypes.default.oneOf([false]), _propTypes.default.number]),
  trimWhitespace: _propTypes.default.bool,
  width: _propTypes.default.number,
  onTruncate: _propTypes.default.func
});
_defineProperty(Truncate, "defaultProps", {
  children: "",
  ellipsis: "…",
  lines: 1,
  trimWhitespace: false,
  width: 0
});