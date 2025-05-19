import { Mark, mergeAttributes } from "@tiptap/core";

export interface HighlightedTextOptions {
  HTMLAttributes: Record<string, any>;
}

// These styles should ideally be configurable or imported from a shared source
// if they are used in multiple places (e.g., here and in ToolButton.vue)
const KNOWN_HIGHLIGHT_STYLES = ["green", "orange", "red"];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlightedText: {
      /**
       * Set a highlighted text mark
       */
      setHighlightedText: (attributes: {
        highlightStyle: string;
      }) => ReturnType;
      /**
       * Toggle a highlighted text mark
       */
      toggleHighlightedText: (attributes: {
        highlightStyle: string;
      }) => ReturnType;
      /**
       * Unset a highlighted text mark
       */
      unsetHighlightedText: () => ReturnType;
    };
  }
}

export const HighlightedText = Mark.create<HighlightedTextOptions>({
  name: "highlightedText",

  addOptions() {
    return {
      HTMLAttributes: {}, // Default HTML attributes for the mark (e.g., a base class if needed)
    };
  },

  addAttributes() {
    return {
      highlightStyle: {
        default: null,
        // Controls how the attribute is rendered into the HTML
        renderHTML: (attributes) => {
          if (
            !attributes.highlightStyle ||
            !KNOWN_HIGHLIGHT_STYLES.includes(attributes.highlightStyle)
          ) {
            return {};
          }
          // This will be merged with other HTML attributes for the mark's tag
          return { class: attributes.highlightStyle };
        },
        // Controls how the attribute is parsed from an HTML element
        parseHTML: (element) => {
          for (const style of KNOWN_HIGHLIGHT_STYLES) {
            if (element.classList.contains(style)) {
              return style; // Return the style name (e.g., "green")
            }
          }
          return null; // Not a recognized highlight style
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span", // We are looking for any span
        // The `highlightStyle` attribute's `parseHTML` will be called on this `span`.
        // If it returns a style (e.g., "green"), the mark will be applied with that attribute.
        // If it returns null (because no known highlight class was found), this rule won't apply the mark from this span.
        // We can add a getAttrs check here if we want to be more specific about which spans to even attempt to parse as highlights
        // For example, if highlights always had another specific data-attribute or base class not part of the style.
        // For now, relying on the attribute's parseHTML is fine.
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // HTMLAttributes will include the { class: 'stylename' } from highlightStyle.renderHTML,
    // merged with this.options.HTMLAttributes.
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setHighlightedText:
        (attributes) =>
        ({ chain }) => {
          if (!KNOWN_HIGHLIGHT_STYLES.includes(attributes.highlightStyle)) {
            return false;
          }
          return chain()
            .extendMarkRange(this.name)
            .setMark(this.name, attributes)
            .run();
        },
      toggleHighlightedText:
        (attributes) =>
        ({ chain }) => {
          if (!KNOWN_HIGHLIGHT_STYLES.includes(attributes.highlightStyle)) {
            return false;
          }
          return chain()
            .extendMarkRange(this.name)
            .toggleMark(this.name, attributes)
            .run();
        },
      unsetHighlightedText:
        () =>
        ({ chain }) => {
          return chain().extendMarkRange(this.name).unsetMark(this.name).run();
        },
    };
  },
});
