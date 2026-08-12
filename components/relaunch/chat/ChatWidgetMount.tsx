"use client";

// Client-Huelle fuer das Chat-Widget: laedt es nur im Browser (ssr:false) und
// blendet es auf dem noindex-Dashboard aus. Wird im Root-Layout gemountet.

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetMount() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/dashboard")) return null;
  return <ChatWidget />;
}
