import type * as React from "react";

export type ShowMoreTextLines = number | false;

export interface ShowMoreTextBaseProps {
    lines?: ShowMoreTextLines;
    more?: React.ReactNode;
    less?: React.ReactNode;
    className?: string;
    id?: string;
    "aria-label"?: string;
    anchorClass?: string;
    onClick?: (
        isExpanded: boolean,
        event: React.MouseEvent<HTMLButtonElement>,
    ) => void;
    expanded?: boolean;
    animate?: boolean;
    expandByClick?: boolean;
    width?: number;
    keepNewLines?: boolean;
    truncatedEndingComponent?: React.ReactNode;
    onTruncate?: () => void;
}

export type ShowMoreTextProps =
    | (ShowMoreTextBaseProps & {
          children?: React.ReactNode;
          dangerouslySetInnerHTML?: never;
      })
    | (ShowMoreTextBaseProps & {
          children?: never;
          dangerouslySetInnerHTML: { __html: string };
      });

export interface ShowMoreTextComponent
    extends React.ForwardRefExoticComponent<ShowMoreTextProps> {}

declare const ShowMoreText: ShowMoreTextComponent;

export { ShowMoreText };
export default ShowMoreText;
