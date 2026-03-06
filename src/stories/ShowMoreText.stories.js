import React from "react";

import ShowMoreText from "../../lib/ShowMoreText";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "Example/ShowMoreText",
    component: ShowMoreText,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => (
    <ShowMoreText {...args}>
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
            target="_blank"
            rel="noopener noreferrer"
        >
            www.google.bg
        </a>{" "}
        ut labore et dolore magna amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation
    </ShowMoreText>
);

export const Example = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Example.args = {
    lines: 3,
    more: "Show more",
    less: "Show less",
    className: "content-css",
    anchorClass: "show-more-less-clickable",
    onClick: () => {
        console.log("Executed on click");
    },
    expanded: false,
    width: 280,
    truncatedEndingComponent: "... ",
};
