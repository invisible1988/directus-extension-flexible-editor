import customMessages from "../../i18n/custom-messages";
import { defineTool } from "../../lib/define-tool";
import { HighlightedText } from "./HighlightedText";
import ToolButton from "./ToolButton.vue"; // Updated import to the new ToolButton.vue

export const highlightedTextTool = () =>
  defineTool({
    key: "highlightedText",
    name: customMessages.tools.highlightedText,
    icon: "format_color_fill", // Changed from "ink_highlighter"
    extension: [HighlightedText.configure({})],
    toolbarButton: ToolButton, // Use the new ToolButton
    active: (editor) => editor.isActive("highlightedText"), // Corrected this line
    // The 'active' prop for the ToolButton component will be handled by its internal logic
    // The 'title' for the base ToolButton will be derived from the 'name' + i18n
  });
