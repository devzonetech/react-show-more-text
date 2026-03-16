import React from "react";
import { mount } from "enzyme";

/*eslint no-trailing-spaces: 2*/

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

import ShowMoreText from "../lib/ShowMoreText";

/* global expect */

const testMessage =
    "Test Message Lorem ipsum dolor sit amet, <a href='https://www.google.com/'>Google link</a> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <a href='https://www.devzonetech.com/'>Devzone Tech</a> quis nostrud exercitation.Test Message Lorem ipsum dolor sit amet, <a href='https://www.google.com/'>Google link</a> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <a href='https://www.devzonetech.com/'>Devzone Tech</a> quis nostrud exercitation.";

// Track mounted wrappers and clean them up after each test to avoid open handles
const mountTracked = (...args) => {
    const w = mount(...args);
    global.__WRAPPERS = global.__WRAPPERS || [];
    global.__WRAPPERS.push(w);
    return w;
};

afterEach(() => {
    if (global.__WRAPPERS && global.__WRAPPERS.length) {
        global.__WRAPPERS.forEach((w) => {
            try {
                w.unmount();
            } catch (e) {
                // ignore
            }
        });
        global.__WRAPPERS = [];
    }
});

describe("Component ShowMoreText", () => {
    test("check default props", () => {
    const wrapper = mountTracked(<ShowMoreText>{testMessage}</ShowMoreText>);

        expect(wrapper.find("ShowMoreText").get(0).props).toEqual({
            lines: 3,
            more: "Show more",
            less: "Show less",
            children: testMessage,
            anchorClass: "show-more-less-clickable",
            onClick: undefined,
            expandByClick: true,
            expanded: false,
            width: 0,
            keepNewLines: false,
            truncatedEndingComponent: "... ",
            expandByClick: true,
        });
    });

    test("click on Show more", () => {
        const wrapper = mountTracked(
            <ShowMoreText lines={2} keepNewLines={false}>
                {testMessage}
            </ShowMoreText>
        );

        expect(wrapper.find(".show-more-less-clickable").text()).toEqual(
            "Show more"
        );
        wrapper.find(".show-more-less-clickable").simulate("click");
        expect(wrapper.find(".show-more-less-clickable")).toHaveLength(2);
        expect(wrapper.state()).toEqual({ expanded: true, truncated: false });
    });

    test("check default state", () => {
        const wrapper = mountTracked(
            <ShowMoreText lines={2} keepNewLines={false}>
                {testMessage}
            </ShowMoreText>
        );

        const state = wrapper.state();
        expect(state).toEqual({ expanded: false, truncated: false });
    });

    test("check keepNewLines functionality", () => {
        // eslint-disable-next-line
        var msg =
            "Test Message \n Lorem ipsum dolor sit amet,\n consectetur adipiscing elit, \n test new lines.";
        const wrapper = mountTracked(
            <ShowMoreText lines={2} keepNewLines={false}>
                {msg}
            </ShowMoreText>
        );
        expect(wrapper.find("br").length).toEqual(0);

        const wrapper1 = mountTracked(
            // eslint-disable-next-line
            <ShowMoreText lines={2} keepNewLines={true}>
                {msg}
            </ShowMoreText>
        );
        expect(wrapper1.find("br").length).toEqual(3);
    });

    test("test width prop", () => {
        const wrapper = mountTracked(
            <ShowMoreText width={150}>{testMessage}</ShowMoreText>
        );

        expect(wrapper.find("ShowMoreText").get(0).props.width).toEqual(150);
    });

    test("test onClick Show more / expand method", () => {
        let checkValue = 5;
        const onclickMethod = () => {
            checkValue += 10;
        };

        const wrapper = mountTracked(
            <ShowMoreText onClick={onclickMethod} width={150}>
                {testMessage}
            </ShowMoreText>
        );

        wrapper.find(".show-more-less-clickable").at(0).simulate("click");
        expect(checkValue).toEqual(15);
    });

    test("test anchorClass prop", () => {
        const wrapper = mountTracked(
            <ShowMoreText anchorClass="testClass1">{testMessage}</ShowMoreText>
        );

        expect(wrapper.find(".testClass1").length).toEqual(1);
    });

    test("check expanded prop true", () => {
        const wrapper = mountTracked(
            <ShowMoreText lines={2} expanded>
                {testMessage}
            </ShowMoreText>
        );

        const state = wrapper.state();
        expect(state).toEqual({ expanded: true, truncated: false });
    });

    test("check expanded prop false", () => {
        const wrapper = mountTracked(
            <ShowMoreText lines={2} expanded={false}>
                {testMessage}
            </ShowMoreText>
        );

        const state = wrapper.state();
        expect(state).toEqual({ expanded: false, truncated: false });
    });

    test("test truncatedEndingComponent prop", () => {
        const wrapper = mountTracked(
            <ShowMoreText expanded={false} truncatedEndingComponent={"000000"}>
                {testMessage}
            </ShowMoreText>
        );

        expect(wrapper.text().indexOf("000000")).toEqual(1176);
    });
});
