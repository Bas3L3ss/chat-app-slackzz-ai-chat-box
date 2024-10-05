"use client";

import { cn } from "@/lib/utils";
import { useColorPrefrences } from "@/providers/color-preferences";

function InfoSection() {
  const { color } = useColorPrefrences();

  let backgroundColor = "bg-primary-light";
  if (color === "green") {
    backgroundColor = "bg-green-900";
  } else if (color === "blue") {
    backgroundColor = "bg-blue-900";
  }

  let secondaryBg = "bg-primary-dark";
  if (color === "green") {
    secondaryBg = "bg-green-700";
  } else if (color === "blue") {
    secondaryBg = "bg-blue-700";
  }

  return (
    <div
      className={cn(
        "fixed text-white left-20 rounded-l-xl md:w-52 lg:w-[350px] h-[calc(100%-63px)] z-20 flex flex-col items-center",
        backgroundColor
      )}
    >
      {/* Channels */}
      {/* DMs */}
      <p>Channels</p>
      <p>DMs</p>
    </div>
  );
}

export default InfoSection;
