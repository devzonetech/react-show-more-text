import React, { memo, useState } from "react";

import ShowMoreText from "../ShowMoreText";

export default {
    title: "Components/ShowMoreText",
    component: ShowMoreText,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        lines: {
            control: { type: "number", min: 1, max: 10 },
        },
        more: {
            control: "text",
        },
        less: {
            control: "text",
        },
        expanded: {
            control: "boolean",
        },
    },
};

const longContent = (
    <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </>
);

const japaneseContent =
    "ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。ダミーテキストです。";

const Template = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            {longContent}
        </ShowMoreText>
    </div>
);

const InteractiveButton = memo(function InteractiveButton({
    label,
    clickedLabel,
}) {
    const [clicked, setClicked] = useState(false);

    return (
        <button type="button" onClick={() => setClicked((value) => !value)}>
            {clicked ? clickedLabel : label}
        </button>
    );
});

export const Default = Template.bind({});
Default.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const JapaneseText = (args) => (
    <div style={{ maxWidth: "450px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>{japaneseContent}</ShowMoreText>
    </div>
);
JapaneseText.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const ResizableContainerWidth = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <p>Drag the right edge to resize the container and watch the text reflow.</p>
        <div
            style={{
                width: "396px",
                minWidth: "200px",
                maxWidth: "100%",
                overflow: "auto",
                resize: "horizontal",
                outline: "1px dashed currentColor",
            }}
        >
            <ShowMoreText {...args}>{longContent}</ShowMoreText>
        </div>
    </div>
);
ResizableContainerWidth.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const RichEditorStyles = (args) => (
    <div style={{ maxWidth: "450px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            <span>
                <strong>Bold text</strong>{" "}
                <em>italic text</em>{" "}
                <u>underlined text</u>, and a{" "}
                <span
                    style={{
                        color: "var(--storybook-rich-mention, #0969da)",
                        fontWeight: "600",
                    }}
                >
                    @mention
                </span>
                . This rich editor content keeps its formatting while truncated.
                Additional text is included so the three-line limit is exercised.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
            </span>
        </ShowMoreText>
    </div>
);
RichEditorStyles.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const TruncatedAt2Lines = Template.bind({});
TruncatedAt2Lines.args = {
    lines: 2,
    more: "Expand",
    less: "Collapse",
    expanded: false,
};

export const InitiallyExpanded = Template.bind({});
InitiallyExpanded.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: true,
};

export const CustomButtonText = Template.bind({});
CustomButtonText.args = {
    lines: 3,
    more: "Read Full Article",
    less: "Show Less",
    expanded: false,
};

export const WithLinks = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            Learn more at{" "}
            <a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">
                MDN
            </a>
            {" "}and{" "}
            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                React
            </a>
            . Check out documentation for comprehensive learning resources available for all skill levels.
            These platforms provide excellent content and community support for developers.
        </ShowMoreText>
    </div>
);
WithLinks.args = {
    lines: 2,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const WithInteractiveComponents = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            This content includes interactive React components:{" "}
            <InteractiveButton label="Click to confirm" clickedLabel="Confirmed" />{" "}
            and{" "}
            <InteractiveButton label="Click to save" clickedLabel="Saved" />.
            Their click handlers continue to work when the content fits within
            the configured lines. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </ShowMoreText>
    </div>
);
WithInteractiveComponents.args = {
    lines: 5,
    width: 600,
    more: "Show more",
    less: "Show less",
    expanded: false,
};

export const NonClickable = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            This is a read-only version of the component without expand/collapse functionality.
        </ShowMoreText>
    </div>
);
NonClickable.args = {
    lines: 1,
    more: "",
    less: "",
    expanded: true,
};

export const WithClickableClass = Template.bind({});
WithClickableClass.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    expanded: false,
    anchorClass: "show-more-less-clickable",
};
