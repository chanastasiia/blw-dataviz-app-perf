import classNames from "classnames";
import "./VizTabs.css";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useEffect, useRef } from "react";

export default function VizTabs() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const contentBoxRef = useRef(null);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  // Close outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isFullScreen &&
        contentBoxRef.current &&
        !contentBoxRef.current.contains(event.target)
      ) {
        setIsFullScreen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFullScreen]);

  // Close Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  return (
    <div className="viztabs-wrapper">
      {isFullScreen && <div className="viztabs-backdrop" />}
      <Tabs.Root
        className={classNames("viztabs-root", { "full-screen": isFullScreen })}
        ref={contentBoxRef}
      >
        <Tabs.List className="viztabs-tablist">
          <Tabs.Trigger className="viztabs-trigger" value="imp">
            Importance
          </Tabs.Trigger>
          <Tabs.Trigger className="viztabs-trigger" value="perf">
            Performance
          </Tabs.Trigger>
          <Tabs.Trigger className="viztabs-trigger" value="brightlines">
            Bright Lines
          </Tabs.Trigger>
          <button
            className="viztabs-fullscreen-button"
            type="button"
            onClick={toggleFullScreen}
          >
            ⛶
          </button>
        </Tabs.List>

        <Tabs.Content className="viztabs-content" value="imp"></Tabs.Content>
        <Tabs.Content className="viztabs-content" value="perf"></Tabs.Content>
        <Tabs.Content
          className="viztabs-content"
          value="brightlines"
        ></Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
