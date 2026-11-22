import React, { Component } from "react";
import PropTypes from "prop-types";
import Truncate from "./Truncate";

class ShowMoreTextComponent extends Component {
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
        dangerouslySetInnerHTML: PropTypes.shape({
            __html: PropTypes.any,
        }),
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

    handleToggleFocus = (event) => {
        event.currentTarget.style.outline = "2px solid currentColor";
        event.currentTarget.style.outlineOffset = "2px";
    };

    handleToggleBlur = (event) => {
        event.currentTarget.style.outline = "";
        event.currentTarget.style.outlineOffset = "";
    };

    render() {
        const {
            children,
            dangerouslySetInnerHTML,
            more,
            less,
            lines,
            anchorClass,
            className,
            id,
            "aria-label": ariaLabel,
            width,
            keepNewLines,
            truncatedEndingComponent,
            onTruncate,
            animate,
        } = this.props;

        if (dangerouslySetInnerHTML != null && children != null) {
            throw new Error(
                "ShowMoreText cannot receive both children and dangerouslySetInnerHTML."
            );
        }

        const { expanded, truncated } = this.state;
        const content =
            dangerouslySetInnerHTML != null ? (
                <span dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
            ) : (
                children
            );
        const toggleClassName = `show-more-less-button ${anchorClass}`;
        const toggleStyle = {
            appearance: "none",
            background: "none",
            border: 0,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
            padding: 0,
        };

        return (
            <div className={className}>
                <div
                    id={id}
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
                                <button
                                    type="button"
                                    className={toggleClassName}
                                    aria-expanded={expanded}
                                    aria-controls={id}
                                    aria-label={ariaLabel}
                                    style={toggleStyle}
                                    onClick={this.toggleLines}
                                    onFocus={this.handleToggleFocus}
                                    onBlur={this.handleToggleBlur}
                                >
                                    {more}
                                </button>
                            </span>
                        }
                        onTruncate={(truncated) =>
                            this.handleTruncate(truncated, onTruncate)
                        }
                        ref={(ref) => (this.truncateRef = ref)}
                    >
                        {keepNewLines && typeof content === "string"
                            ? content.split("\n").map((line, i, arr) => {
                                  line = <span key={i}>{line}</span>;

                                  if (i === arr.length - 1) {
                                      return line;
                                  } else {
                                      return [line, <br key={i + "br"} />];
                                  }
                              })
                            : content}
                        {!truncated && expanded && (
                            <span>
                                {" "}
                                <button
                                    type="button"
                                    className={toggleClassName}
                                    aria-expanded={expanded}
                                    aria-controls={id}
                                    aria-label={ariaLabel}
                                    style={toggleStyle}
                                    onClick={this.toggleLines}
                                    onFocus={this.handleToggleFocus}
                                    onBlur={this.handleToggleBlur}
                                >
                                    {less}
                                </button>
                            </span>
                        )}
                    </Truncate>
                </div>
            </div>
        );
    }
}

ShowMoreTextComponent.propTypes = {
    ...ShowMoreTextComponent.propTypes,
    id: PropTypes.string,
    "aria-label": PropTypes.string,
};

const ShowMoreText = React.forwardRef(function ShowMoreText(props, ref) {
    const generatedId = React.useId();

    return (
        <ShowMoreTextComponent
            {...props}
            id={props.id || generatedId}
            ref={ref}
        />
    );
});

ShowMoreText.propTypes = ShowMoreTextComponent.propTypes;

export default ShowMoreText;
