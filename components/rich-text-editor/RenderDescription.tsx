"use client";

import { useMemo } from "react";
import { generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

interface RenderDescriptionProps {
  json: JSONContent;
}

const RenderDescription = ({ json }: RenderDescriptionProps) => {
  const description = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);

  return <div className="prose dark:prose-invert prose-li:marker:text-primary">{parse(description)}</div>;
};

export default RenderDescription;
