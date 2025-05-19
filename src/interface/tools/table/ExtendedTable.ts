import { Table as BaseTable } from "@tiptap/extension-table";

export const ExtendedTable = BaseTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dataTableStyle: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-table-style"),
        renderHTML: (attributes) => {
          if (!attributes.dataTableStyle) {
            return {};
          }
          return {
            "data-table-style": attributes.dataTableStyle,
          };
        },
      },
    };
  },
});
