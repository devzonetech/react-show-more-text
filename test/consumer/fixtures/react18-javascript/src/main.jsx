import React from "react";
import { createRoot } from "react-dom/client";
import ShowMoreText, {
  ShowMoreText as NamedShowMoreText,
} from "react-show-more-text";

function App() {
  return (
    <main>
      <ShowMoreText lines={2} more="Read more" less="Show less">
        A consumer application imports and uses the default component export.
      </ShowMoreText>
      <NamedShowMoreText lines={false}>Named component export</NamedShowMoreText>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
