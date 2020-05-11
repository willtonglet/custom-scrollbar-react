import React, { useRef, useEffect } from "react";
import styles from "./styles.module.scss";

function ScrollBar({ children }) {
  const scrollRef = useRef("");
  const barRefX = useRef("");
  const trackRefX = useRef("");
  const barRefY = useRef("");
  const trackRefY = useRef("");

  let pendingFrame = null;

  function handleResize() {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      const contentHeight = scrollRef.current.scrollHeight;
      const containerHeight = scrollRef.current.offsetHeight;
      const contentWidth = scrollRef.current.scrollWidth;
      const containerWidth = scrollRef.current.offsetWidth;
      const percentageVisibleY = containerHeight / contentHeight;
      const percentageVisibleX = containerWidth / contentWidth;
      const sliderHeight = percentageVisibleY * containerHeight;
      const sliderWidth = percentageVisibleX * containerWidth;

      const percentageOffsetY =
        scrollRef.current.scrollTop / (contentHeight - containerHeight);
      const percentageOffsetX =
        scrollRef.current.scrollLeft / (contentWidth - containerWidth);

      const sliderOffsetY =
        percentageOffsetY * (containerHeight - sliderHeight);
      const sliderOffsetX = percentageOffsetX * (containerWidth - sliderWidth);

      const hideX = Math.round(percentageVisibleX);

      barRefY.current.style.opacity = percentageVisibleY === 1 ? 0 : 1;
      barRefX.current.style.opacity = hideX === 1 ? 0 : 1;

      trackRefY.current.style.cssText = `
        height: ${sliderHeight}px;
        transform: translateY(${sliderOffsetY}px);
      `;

      trackRefX.current.style.cssText = `
        width: ${sliderWidth}px;
        transform: translateX(${sliderOffsetX}px);
      `;
    });
  }

  function setPosition() {
    requestAnimationFrame(() => {
      const offset = scrollRef.current.scrollTop;
      scrollRef.current.scrollTop = offset + 1;
      scrollRef.current.scrollTop = offset;
    });
  }

  useEffect(() => {
    scrollRef.current.addEventListener("scroll", handleResize);
    scrollRef.current.addEventListener("mouseenter", setPosition);
    window.addEventListener("resize", handleResize);
  });

  return (
    <div className={styles.scrollBar} ref={scrollRef}>
      <div className={styles.barContainerY} ref={barRefY}>
        <div className={styles.bar} ref={trackRefY} />
      </div>
      <div className={styles.barContainerX} ref={barRefX}>
        <div className={styles.bar} ref={trackRefX} />
      </div>

      {children}
    </div>
  );
}

export default ScrollBar;
