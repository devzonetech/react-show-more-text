# React Show More Text 1.7.3

[![NPM version](https://badge.fury.io/js/react-show-more-text.svg)](https://npmjs.org/package/react-show-more-text)
[![npm downloads](https://img.shields.io/npm/dm/react-show-more-text.svg)](https://www.npmjs.com/package/react-show-more-text)
[![Build status](https://github.com/devzonetech/react-show-more-text/actions/workflows/node.js.yml/badge.svg)](https://github.com/devzonetech/react-show-more-text/actions/workflows/node.js.yml)
[![License](https://img.shields.io/npm/l/react-show-more-text.svg)](https://github.com/devzonetech/react-show-more-text/blob/main/LICENSE)
<!-- [![TypeScript](https://img.shields.io/npm/types/react-show-more-text.svg)](https://www.npmjs.com/package/react-show-more-text) -->
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-show-more-text)](https://bundlephobia.com/package/react-show-more-text)



The text surrounded by the component will be truncated. Anything surrounded by the component could be evaluated as text. The component react-show-more-text/ShowMoreText is fork of react-show-more/ShowMore, applied improvements, added onClick event, works with React React 18.x.x, Next.Js 13.3.x and upper.

## Demo

[https://www.devzonetech.com/demo/react-show-more-text/build/](https://www.devzonetech.com/demo/react-show-more-text/build/)

## Install

```
$ npm install react-show-more-text
```

## Usage

```js
import ShowMoreText from "react-show-more-text";

// ...

class Foo extends Component {
    executeOnClick(isExpanded) {
        console.log(isExpanded);
    }

    render() {
        return (
            <ShowMoreText
                /* Default options */
                lines={3}
                more="Show more"
                less="Show less"
                className="content-css"
                anchorClass="show-more-less-clickable"
                aria-label="Toggle article excerpt"
                onClick={this.executeOnClick}
                expanded={false}
                animate={true}
                width={280}
                truncatedEndingComponent={"... "}
            >
                Lorem ipsum dolor sit amet, consectetur{" "}
                <a
                    href="https://www.yahoo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    yahoo.com
                </a>{" "}
                adipiscing elit, sed do eiusmod tempor incididunt
                <a
                    href="https://www.google.bg/"
                    title="Google"
                    rel="nofollow"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    www.google.bg
                </a> ut labore et dolore magna amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            </ShowMoreText>
        );
    }
}
```

## API

| Prop                     | Type                     | Default     | Description                                                                                                                                                   | Example                                                                                                                       |
| ------------------------ | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| lines                    | integer, boolean {false} | 3           | Specifies how many lines of text should be preserved until it gets truncated. `false` and any integer < 1 will result in the text not getting clipped at all. | (`false`, `-1`, `0`), `1`, ...                                                                                                |
| children                 | string, React node       |             | The content to be truncated. String children are rendered as text (HTML is escaped). When React element children fit within the configured lines, their event handlers are preserved. Truncated links only retain `http`, `https`, `mailto`, and `tel` URLs. | `'Some text'`, `<p>Some paragraph <a/>with other text-based inline elements<a></p>`, `<span>Some</span><span>siblings</span>` |
| dangerouslySetInnerHTML  | object                   |             | Renders trusted or sanitized HTML as the content to be truncated. Cannot be used together with `children`. | `dangerouslySetInnerHTML={{ __html: sanitizedHtml }}` |
| more                     | string, React node       | 'Show more' | The text to display in the button to show more.                                                                                                               | `'Show more'`, `<span>Show more</span>`                                                                                       |
| less                     | string, React node       | 'Show less' | The text to display in the button to show less.                                                                                                               | `'Show less'`, `<span>Show less</span>`                                                                                       |
| className                | string                   | ''          | Class name(s) to add on component content wrapper div.                                                                                                        | `'wrapper-class'`, `'wrapper-class-1 wrapper-class-2'`                                                                        |
| id                       | string                   | Generated   | ID for the text content element controlled by the toggle button. A unique ID is generated when omitted.                                                       | `'article-summary'`                                                                                                           |
| aria-label               | string                   |             | Optional accessible name for the toggle button. Its expanded state is conveyed separately through `aria-expanded`.                                            | `'Toggle article summary'`                                                                                                    |
| anchorClass              | string                   | 'show-more-less-clickable'          | Class name(s) applied to the toggle buttons (prop retained for compatibility).                                                                                | `'my-toggle-class'`, `'class-1 class-2'`                                                                                     |
| onClick                  | Function                 |             | Function executed on click on 'Show more' or 'Show less'                                                                                                      | `onClick={this.executeOnClick}`                                                                                               |
| expanded                 | boolean                  | 'false'     | Control the text to be shown as expanded                                                                                                                      | `expanded={true}`                                                                                                             |
| animate                  | boolean                  | 'false'     | Animate the height when expanding or collapsing. Respects the user's reduced-motion preference.                                                                | `animate={true}`                                                                                                              |
| expandByClick            | boolean                  | 'true'      | Toggle expansion when the button is activated.                                                                                                               | `expandByClick={false}`                                                                                                       |
| width                    | number                   | `0`         | If not `0`, the calculation of the content will be based on this number.                                                                                      |                                                                                                                               |
| keepNewLines             | boolean                  | 'false'     | Controls the new lines in text to be kept or not. When set to true, only strings can be passed in as children, and not html nodes.                            | `keepNewLines={true}`                                                                                                         |
| truncatedEndingComponent | string                   | '...'       | Control the text to be shown at the end of short text                                                                                                         | `truncatedEndingComponent={'... '}`                                                                                           |
| onTruncate               | Function                 | undefined   | Function executed on click on Truncate                                                                                                                        | `onTruncate={() => {alert('Turncated!')}}`                                                                                    |

### Accessibility

The Show More / Show Less control is a native `type="button"` element, so it
supports standard keyboard activation with **Enter** and **Space** and can be
reached using Tab. The button styling, including its visible keyboard focus indicator, is applied
by the component itself. No additional stylesheet import is needed.

Each instance generates a stable, unique ID for its content. The toggle button
references it with `aria-controls` and exposes its current state with
`aria-expanded`. Set `id` to provide your own content ID, and optionally pass an
`aria-label` if the visible “Show more” / “Show less” text needs additional
context:

```jsx
<ShowMoreText
  id="article-summary"
  aria-label="Toggle article summary"
  lines={3}
>
  The article summary content...
</ShowMoreText>
```

The component updates `aria-expanded` when toggled. Its visible label also
switches between “Show more” and “Show less”; no live region is used, avoiding
redundant announcements.

### Rich React content

When `children` contains React elements, formatting and classes on inline elements are
preserved in the collapsed view. This supports editor output containing elements such
as `<strong>`, `<em>`, `<u>`, mentions, links, and elements with `className` or `style`.

```jsx
<ShowMoreText lines={3}>
  <p>
    <strong>Bold text</strong>{" "}
    <em>Italic text</em>{" "}
    <u>Underlined text</u>, and{" "}
    <span className="mention">@Jane</span>.
  </p>
</ShowMoreText>
```

String children remain plain text and HTML-like strings are escaped for security.

To render HTML, pass it through `dangerouslySetInnerHTML`. Only use trusted or
sanitized HTML, and do not pass `children` at the same time:

```jsx
<ShowMoreText
  lines={3}
  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
/>
```

## Developing

Install development dependencies

```
$ npm install
```

### Build & Compilation

Build the library (ESM and CJS bundles with Vite)

```
$ npm run build
```

Watch for changes and rebuild automatically

```
$ npm run build:watch
```

Start development server (Vite)

```
$ npm run dev
```

Clean the dist folder

```
$ npm run clean
```

### Testing & Quality

Run tests

```
$ npm test
```

Run tests in watch mode

```
$ npm test:watch
```

Run code linter

```
$ npm run lint
```

### Storybook

Interactive component documentation and sandbox

```
$ npm run storybook
```

Build static Storybook site

```
$ npm run build-storybook
```
