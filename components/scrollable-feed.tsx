"use client";

import type { ReactNode } from "react";
import ScrollableFeed from "react-scrollable-feed";

type ScrollableFeedWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function ScrollableFeedWrapper({
  children,
  className,
}: ScrollableFeedWrapperProps) {
  return <ScrollableFeed className={className}>{children}</ScrollableFeed>;
}
