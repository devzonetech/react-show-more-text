import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Truncate from "./Truncate";

class ShowMoreText extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            truncated: false,
        };
    }

    static defaultProps = {
        lines: 3,
        more: "Show more",
        less: "Show less",
        anchorClass: "show-more-less-clickable",
        onClick: undefined,
        expanded: false,
        width: 0,
        keepNewLines: false,
        truncatedEndingComponent: "... ",
        expandByClick: true,
        onTruncate: undefined,
        animate: false,
    };

    static propTypes = {
        children: PropTypes.node,
        lines: PropTypes.number,
        more: PropTypes.node,
        less: PropTypes.node,
        anchorClass: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func,
        expanded: PropTypes.bool,
        width: PropTypes.number,
        keepNewLines: PropTypes.bool,
        truncatedEndingComponent: PropTypes.node,
        expandByClick: PropTypes.bool,
        onTruncate: PropTypes.func,
        animate: PropTypes.bool,
    };

    componentDidMount() {
        this._isMounted = true;

        var _self = this;
        if (this._isMounted) {
            this.setState({
                expanded: _self.props.expanded,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    handleTruncate = (truncated, onTruncate = this.props.onTruncate) => {
        if (this._isMounted && truncated !== this.state.truncated) {
            this.setState({
                truncated,
            });
            if (truncated) {
                this.truncateRef.onResize();
            }
            onTruncate && onTruncate();
        }
    };

    toggleLines = (event) => {
        event.preventDefault();
        var _self = this;

        if (!_self.props.expandByClick) {
            if (_self.props.onClick) {
                _self.props.onClick(_self.state.expanded, event);
            }

            return;
        }

        if (this._isMounted) {
            const content = this.contentRef;
            const shouldAnimate =
                this.props.animate &&
                typeof window !== "undefined" &&
                !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

            if (shouldAnimate && content) {
                if (this.animationFrame) {
                    window.cancelAnimationFrame(this.animationFrame);
                }
                content.style.height = `${content.getBoundingClientRect().height}px`;
                content.style.overflow = "hidden";
                content.getBoundingClientRect();
            }

            this.setState(
                {
                    expanded: !this.state.expanded,
                },
                () => {
                    if (shouldAnimate && content) {
                        this.animationFrame = window.requestAnimationFrame(() => {
                            content.style.height = `${content.scrollHeight}px`;
                            this.animationFrame = null;
                        });
                    }
                    if (_self.props.onClick) {
                        _self.props.onClick(_self.state.expanded, event);
                    }
                }
            );
        }
    };

    render() {
        const {
            children,
            more,
            less,
            lines,
            anchorClass,
            className,
            width,
            keepNewLines,
            truncatedEndingComponent,
            onTruncate,
            animate,
        } = this.props;

        const { expanded, truncated } = this.state;

        return (
            <div className={className}>
                <div
                    className="show-more-text-content"
                    ref={(ref) => (this.contentRef = ref)}
                    style={animate ? { transition: "height 300ms ease" } : undefined}
                    onTransitionEnd={(event) => {
                        if (
                            animate &&
                            event.target === event.currentTarget &&
                            event.propertyName === "height"
                        ) {
                            event.currentTarget.style.height = "auto";
                            event.currentTarget.style.overflow = "";
                        }
                    }}
                >
                    <Truncate
                        width={width}
                        lines={!expanded && lines}
                        ellipsis={
                            <span>
                                {truncatedEndingComponent}
                                <span
                                    className={anchorClass}
                                    onClick={this.toggleLines}
                                >
                                    {more}
                                </span>
                            </span>
                        }
                        onTruncate={(truncated) =>
                            this.handleTruncate(truncated, onTruncate)
                        }
                        ref={(ref) => (this.truncateRef = ref)}
                    >
                        {keepNewLines && typeof children === "string"
                            ? children.split("\n").map((line, i, arr) => {
                                  line = <span key={i}>{line}</span>;

                                  if (i === arr.length - 1) {
                                      return line;
                                  } else {
                                      return [line, <br key={i + "br"} />];
                                  }
                              })
                            : children}
                        {!truncated && expanded && (
                            <span>
                                {" "}
                                <span
                                    className={anchorClass}
                                    onClick={this.toggleLines}
                                >
                                    {less}
                                </span>
                            </span>
                        )}
                    </Truncate>
                </div>
            </div>
        );
    }
}

export default ShowMoreText;
