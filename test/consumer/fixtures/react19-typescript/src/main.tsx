import React from "react";
import { createRoot } from "react-dom/client";
import ShowMoreText, {
  ShowMoreText as NamedShowMoreText,
  type ShowMoreTextLines,
  type ShowMoreTextProps,
} from "react-show-more-text";

const lines: ShowMoreTextLines = 2;
const previewProps: ShowMoreTextProps = {
  lines,
  more: "Read more",
  less: "Show less",
  children: "Default typed component export",
  onClick: (isExpanded, event) => {
    event.currentTarget.disabled = isExpanded;
  },
};

function App() {
  return (
    <main>
      <ShowMoreText {...previewProps} />
      <NamedShowMoreText lines={false}>Named typed component export</NamedShowMoreText>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
