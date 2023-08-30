import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

export const ScreenSize = {
  Small: 1,
  Medium: 2,
  Large: 3,
};

const MAX_SMALL = 600;
const MAX_MEDIUM = 900;

export function useDimensions() {
  let [dimensions, setDimensions] = useState(() => {
    let { width, height } = Dimensions.get("screen");
    return { width, height };
  });
  let { width, height } = dimensions;

  let screenSize;
  if (width < MAX_SMALL) {
    screenSize = ScreenSize.Small;
  } else if (width < MAX_MEDIUM) {
    screenSize = ScreenSize.Medium;
  } else {
    screenSize = ScreenSize.Large;
  }

  useEffect(() => {
    let onChange = ({ screen }) => {
      let { width, height } = screen;
      setDimensions({ width, height });
    };
    let event = Dimensions.addEventListener("change", onChange);
    return () => {
      event.remove();
    };
  }, []);

  return {
    width,
    height,
    screenSize,
    isLandscape: width > height,
  };
}
