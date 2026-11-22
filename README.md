# React Show More Text

[![npm version](https://badge.fury.io/js/react-show-more-text.svg)](https://www.npmjs.com/package/react-show-more-text)
[![npm downloads](https://img.shields.io/npm/dm/react-show-more-text.svg)](https://www.npmjs.com/package/react-show-more-text)
[![Build status](https://github.com/devzonetech/react-show-more-text/actions/workflows/node.js.yml/badge.svg)](https://github.com/devzonetech/react-show-more-text/actions/workflows/node.js.yml)
[![License](https://img.shields.io/npm/l/react-show-more-text.svg)](https://github.com/devzonetech/react-show-more-text/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/npm/types/react-show-more-text.svg)](https://www.npmjs.com/package/react-show-more-text)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-show-more-text)](https://bundlephobia.com/package/react-show-more-text)

**Keep long content readable without hiding the rest of the story.** `react-show-more-text` is a flexible React component for truncating text to a chosen number of lines and letting readers expand or collapse it on demand.

Use it for article previews, comments, product descriptions, profiles, and anywhere a compact summary should stay just one click away from the full content.

- Works with **React 18 and 19**
- Supports **JavaScript and TypeScript** with built-in declarations
- Handles **plain text, rich React content, and trusted HTML**
- Includes an **accessible, keyboard-operable toggle** with no stylesheet required

[Live demo](https://www.devzonetech.com/demo/react-show-more-text/build/) · [Component stories](https://github.com/devzonetech/react-show-more-text/blob/main/src/stories/ShowMoreText.stories.jsx)

## Features

- **Line-based truncation:** Set how many lines to show, with automatic text measurement and a customizable ending.
- **Responsive recalculation:** Reflows truncation when the container is resized; optionally provide a fixed width for measurement.
- **Flexible content:** Render plain text, React elements, or trusted/sanitized HTML. React child formatting and classes are retained in the collapsed view.
- **Configurable show-more/show-less controls:** Supply your own labels, React nodes, CSS classes, and accessible name.
- **Expansion options:** Start expanded, animate expand/collapse, or disable expansion while still receiving toggle clicks.
- **Callbacks:** Respond to toggle clicks and changes to whether content is truncated.
- **Accessible by default:** Uses a native button with keyboard activation, visible focus styling, `aria-expanded`, and `aria-controls`.
- **Reduced-motion friendly:** The optional height animation respects the user's reduced-motion preference.
- **International text support:** Handles CJK text at character boundaries and can preserve newlines in string content.
- **Safer truncated HTML links:** Restored links are limited to `http`, `https`, `mailto`, and `tel` URLs; new-tab links receive `noopener noreferrer`.

## Installation

```sh
npm install react-show-more-text
```

React 18 or 19 is required as a peer dependency.

## Quick start

```jsx
import ShowMoreText from "react-show-more-text";

export default function ArticlePreview() {
  return (
    <ShowMoreText
      lines={3}
      more="Read more"
      less="Show less"
      className="article-preview"
    >
      A longer article summary goes here. The component measures the content,
      shows the configured number of lines, and adds a button so readers can
      reveal the complete text when they want more detail.
    </ShowMoreText>
  );
}
```

The component needs no stylesheet import. Use `className` on the content wrapper and `anchorClass` on the toggle buttons to apply your own styles.

### React content and links

React elements can be passed as children, so inline formatting and links can be part of a preview:

```jsx
<ShowMoreText lines={3} more="Continue reading" less="Collapse">
  Read the <strong>full story</strong> and visit{" "}
  <a href="https://react.dev/">React</a> for more information.
  Add enough content to exceed the configured line count.
</ShowMoreText>
```

### TypeScript

Type declarations are included. Both the default and named component exports are available:

```tsx
import ShowMoreText, {
  ShowMoreText as NamedShowMoreText,
  type ShowMoreTextProps,
} from "react-show-more-text";

const previewProps: ShowMoreTextProps = {
  lines: 3,
  more: "Show more",
  less: "Show less",
};

<ShowMoreText {...previewProps}>Typed React content</ShowMoreText>;
<NamedShowMoreText lines={2}>Another typed preview</NamedShowMoreText>;
```

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Content to truncate. Strings render as text; React elements can retain their formatting and classes in the collapsed view. Use either `children` or `dangerouslySetInnerHTML`, not both. |
| `dangerouslySetInnerHTML` | `{ __html: string }` | — | HTML content to truncate. Only pass trusted or sanitized HTML. Cannot be combined with `children`. |
| `lines` | `number \| false` | `3` | Maximum visible lines before truncation. `false` or a number less than `1` disables truncation. |
| `more` | `React.ReactNode` | `"Show more"` | Label or React node for the expand button. |
| `less` | `React.ReactNode` | `"Show less"` | Label or React node for the collapse button. |
| `truncatedEndingComponent` | `React.ReactNode` | `"... "` | Content displayed immediately before the expand button. |
| `expanded` | `boolean` | `false` | Whether the component starts expanded. |
| `animate` | `boolean` | `false` | Animate height during expansion and collapse; automatically disabled when reduced motion is preferred. |
| `expandByClick` | `boolean` | `true` | Whether activating the toggle changes the expanded state. When `false`, the click callback still runs. |
| `onClick` | `(isExpanded: boolean, event: React.MouseEvent<HTMLButtonElement>) => void` | — | Called when a toggle is activated, with the current expanded state and click event. |
| `onTruncate` | `() => void` | — | Called when the content's truncation status changes. |
| `width` | `number` | `0` | Optional width in pixels for measuring content. `0` uses the available container width. |
| `keepNewLines` | `boolean` | `false` | Preserve newline characters in string children. This option is for string content. |
| `className` | `string` | — | Class name(s) applied to the outer wrapper. |
| `anchorClass` | `string` | `"show-more-less-clickable"` | Class name(s) applied to the toggle buttons. The prop name is retained for compatibility. |
| `id` | `string` | Generated | ID for the content region referenced by the toggle button. A unique ID is generated when omitted. |
| `aria-label` | `string` | — | Optional accessible name for the toggle button. Its expanded state is exposed separately. |

`ShowMoreTextProps` also enforces that `children` and `dangerouslySetInnerHTML` are not used together in TypeScript.

## Accessibility

The show-more/show-less control is a native `type="button"` element. It can be reached with Tab and activated with Enter or Space. The component exposes its state through `aria-expanded` and connects the button to the content with `aria-controls`. A unique content ID is generated unless you provide one.

Add an `aria-label` when the visible button label needs more context:

```jsx
<ShowMoreText
  id="article-summary"
  aria-label="Toggle article summary"
  lines={3}
  more="Show more"
  less="Show less"
>
  The article summary...
</ShowMoreText>
```

The visible label changes between the values of `more` and `less`. No live region is used.

## Rich content and HTML

When React element children are truncated, their rendered formatting and classes are retained in the collapsed view:

```jsx
<ShowMoreText lines={3}>
  <p>
    <strong>Important</strong>, <em>emphasized</em>, and{" "}
    <span className="mention">@mentioned</span> text can appear together.
    Include additional content to demonstrate truncation.
  </p>
</ShowMoreText>
```

String children are rendered as text, so HTML-like strings are escaped. To render HTML, provide trusted or sanitized markup using `dangerouslySetInnerHTML`:

```jsx
<ShowMoreText
  lines={3}
  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
/>
```

Do not pass `children` at the same time. HTML is rendered with React's `dangerouslySetInnerHTML`; sanitize untrusted input before passing it to the component.

## Demo and development

Explore the [live demo](https://www.devzonetech.com/demo/react-show-more-text/build/) or run the project locally:

```sh
npm install
npm run storybook
```

Run the end-to-end suite in Chromium (install the browser once per environment):

```sh
npx playwright install chromium
npm run test:e2e
```

### Consumer installation tests

The consumer installation suite builds and packs the library, then installs that
`.tgz` artifact into four independent applications: React 18 and React 19, each
tested with JavaScript and strict TypeScript. Each fixture verifies package
imports and peer dependencies, builds a production bundle, and TypeScript
fixtures also run `tsc --noEmit` with declaration checking enabled.

Run all consumer tests locally with the repository's development dependencies
installed:

```sh
npm run test:consumer
```

GitHub Actions also runs each fixture independently on pushes, pull requests,
and manual dispatches.

Useful project scripts:

| Command | Description |
| --- | --- |
| `npm test -- --run` | Run the unit tests once. |
| `npm run test:types` | Check the TypeScript usage tests. |
| `npm run test:consumer` | Pack the library and test installation, imports, and builds in all four consumer fixtures. |
| `npm run test:e2e` | Run the Playwright end-to-end tests in Chromium. |
| `npx playwright install chromium` | Install the browser used by the end-to-end tests. |
| `npm run lint` | Lint the source files. |
| `npm run build` | Build the ESM and CommonJS bundles and copy type declarations. |
| `npm run build-storybook` | Build the static Storybook site. |
