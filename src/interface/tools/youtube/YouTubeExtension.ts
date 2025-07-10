import { Node, mergeAttributes } from "@tiptap/core";

export interface YouTubeOptions {
  allowFullscreen: boolean;
  controls: boolean;
  nocookie: boolean;
  origin: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      /**
       * Add a YouTube video
       */
      setYouTubeVideo: (options: {
        videoId: string;
        type?: "video" | "short";
      }) => ReturnType;
    };
  }
}

export default Node.create<YouTubeOptions>({
  name: "youtube",

  addOptions() {
    return {
      allowFullscreen: true,
      controls: true,
      nocookie: false,
      origin: "",
    };
  },

  group: "block",

  atom: true,

  addAttributes() {
    return {
      videoId: {
        default: null,
      },
      type: {
        default: "video",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { videoId, type } = HTMLAttributes;

    if (!videoId) {
      return ["div", { "data-youtube-video": "" }, "YouTube video ID missing"];
    }

    const baseUrl = this.options.nocookie
      ? "https://www.youtube-nocookie.com/embed/"
      : "https://www.youtube.com/embed/";

    const url =
      type === "short" ? `${baseUrl}${videoId}?si=0` : `${baseUrl}${videoId}`;

    const queryParams = new URLSearchParams();

    if (this.options.controls) {
      queryParams.set("controls", "1");
    }

    if (this.options.origin) {
      queryParams.set("origin", this.options.origin);
    }

    const finalUrl = `${url}&${queryParams.toString()}`;

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-youtube-video": videoId,
        "data-youtube-type": type,
        contenteditable: "false",
        style:
          "position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;",
      }),
      [
        "iframe",
        {
          src: finalUrl,
          allowfullscreen: this.options.allowFullscreen ? "true" : "false",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          style:
            "position: absolute; top: 0; left: 0; width: 100%; height: 100%;",
          frameborder: "0",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYouTubeVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
