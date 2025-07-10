// YouTube embedding tool for TipTap editor

import { defineTool } from "../../lib";
import customMessages from "../../i18n/custom-messages";
import YouTubeButton from "./YouTubeButton.vue";
import YouTubeExtension from "./YouTubeExtension.js";
import type { Editor } from "@tiptap/core";

export default defineTool({
  key: "youtube",
  name: customMessages.tools.youtube,
  icon: "smart_display",
  extension: [YouTubeExtension],
  toolbarButton: YouTubeButton,
  disabled: (editor: Editor) =>
    !editor.can().chain().focus().insertContent("").run(),
  disabledInSingleLineMode: true,
  active: (editor: Editor) => editor.isActive("youtube"),
});
