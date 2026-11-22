import * as React from "react";
import ShowMoreText, {
    ShowMoreText as NamedShowMoreText,
    type ShowMoreTextProps,
} from "./dist/index";

const props: ShowMoreTextProps = {
    lines: 3,
    more: "Read more",
    less: <strong>Read less</strong>,
    expanded: false,
    animate: true,
    width: 320,
    keepNewLines: false,
    truncatedEndingComponent: "... ",
    onClick: (isExpanded, event) => {
        void isExpanded;
        void event.currentTarget;
    },
    onTruncate: () => undefined,
};

export const RichExample = () => (
    <ShowMoreText {...props} className="summary" aria-label="Toggle summary">
        <span>Typed React content</span>
    </ShowMoreText>
);

export const HtmlExample = () => (
    <NamedShowMoreText
        lines={false}
        dangerouslySetInnerHTML={{ __html: "<strong>Safe HTML</strong>" }}
    />
);
