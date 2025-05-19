import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import type { Editor } from "@tiptap/core";
import { defineTool } from "../../lib";
import customMessages from "../../i18n/custom-messages";
import ToolButton from "./ToolButton.vue";
import { ExtendedTable } from "./ExtendedTable"; // Import ExtendedTable

export default defineTool({
  key: "table",
  name: customMessages.tools.table,
  icon: "table",
  extension: [
    ExtendedTable, // Use ExtendedTable
    TableHeader,
    TableRow,
    TableCell,
  ],
  toolbarButton: ToolButton,
  action: (editor: Editor) => editor.chain().focus().insertTable().run(),
  disabled: (editor: Editor) =>
    !editor.can().chain().focus().insertTable().run(),
  disabledInSingleLineMode: true,
  active: (editor: Editor) => editor.isActive("table"),
});
