# React Show More Text 1.7.2

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Build status][travis-image]][travis-url]

The text surrounded by the component will be truncated. Anything surrounded by the component could be evaluated as text. The component react-show-more-text/ShowMoreText is fork of react-show-more/ShowMore, applied improvements, added onClick event, works with React 16.x.x, React 18.x.x, Next.Js 13.3.x and upper.

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
                onClick={this.executeOnClick}
                expanded={false}
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
| children                 | string, React node       |             | The text to be truncated. Anything that can be evaluated as text.                                                                                             | `'Some text'`, `<p>Some paragraph <a/>with other text-based inline elements<a></p>`, `<span>Some</span><span>siblings</span>` |
| more                     | string, React node       | 'Show more' | The text to display in the anchor element to show more.                                                                                                       | `'Show more'`, `<span>Show more</span>`                                                                                       |
| less                     | string, React node       | 'Show less' | The text to display in the anchor element to show less.                                                                                                       | `'Show less'`, `<span>Show less</span>`                                                                                       |
| className                | string                   | ''          | Class name(s) to add on component content wrapper div.                                                                                                        | `'wrapper-class'`, `'wrapper-class-1 wrapper-class-2'`                                                                        |
| anchorClass              | string                   | 'show-more-less-clickable'          | Class name(s) to add to the anchor elements. Should be the name of a css class defined globally by you.                                                                                                                  | `'my-anchor-class'`, `'class-1 class-2'`                                                                                      |
| onClick                  | Function                 |             | Function executed on click on 'Show more' or 'Show less'                                                                                                      | `onClick={this.executeOnClick}`                                                                                               |
| expanded                 | boolean                  | 'false'     | Control the text to be shown as expanded                                                                                                                      | `expanded={true}`                                                                                                             |
| expandByClick            | boolean                  | 'true'      | Cancel the default anchor click expand behavior                                                                                                               | `expandByClick={false}`                                                                                                       |
| width                    | number                   | `0`         | If not `0`, the calculation of the content will be based on this number.                                                                                      |                                                                                                                               |
| keepNewLines             | boolean                  | 'false'     | Controls the new lines in text to be kept or not. When set to true, only strings can be passed in as children, and not html nodes.                            | `keepNewLines={true}`                                                                                                         |
| truncatedEndingComponent | string                   | '...'       | Control the text to be shown at the end of short text                                                                                                         | `truncatedEndingComponent={'... '}`                                                                                           |
| onTruncate               | Function                 | undefined   | Function executed on click on Truncate                                                                                                                        | `onTruncate={() => {alert('Turncated!')}}`                                                                                    |

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

[npm-url]: https://npmjs.org/package/react-show-more-text
[downloads-image]: http://img.shields.io/npm/dm/react-show-more-text.svg
[npm-image]: https://badge.fury.io/js/react-show-more-text.svg
[travis-url]: https://app.travis-ci.com/github/devzonetech/react-show-more-text
[travis-image]: https://travis-ci.com/devzonetech/react-show-more-text.svg?branch=master