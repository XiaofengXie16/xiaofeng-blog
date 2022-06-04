import React from "react";
import { drawSegment } from "./draw";

const ColorSegment = () => {
  React.useLayoutEffect(() => drawSegment());
  return <canvas className={"absolute top-0 w-full h-full"} />;
};

export default ColorSegment;
