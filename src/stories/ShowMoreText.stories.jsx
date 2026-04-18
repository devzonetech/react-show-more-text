import React from "react";

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

const Template = (args) => (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <ShowMoreText {...args}>
            {longContent}
        </ShowMoreText>
    </div>
);

export const Default = Template.bind({});
Default.args = {
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

