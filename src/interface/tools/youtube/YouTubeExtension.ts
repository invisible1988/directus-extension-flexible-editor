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
        videoType?: "video" | "short";
      }) => ReturnType;
    };
  }
}

export default Node.create<YouTubeOptions>({
  name: "youtube_embed",

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
      videoType: {
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
    const { videoId, videoType } = HTMLAttributes;

    if (!videoId) {
      return ["div", { "data-youtube-video": "" }, "YouTube video ID missing"];
    }

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-youtube-video": videoId,
        "data-youtube-type": videoType,
        contenteditable: "false",
        style:
          "display: inline-block; position: relative; width: 200px; height: 112px; margin: 8px 16px 8px 0; cursor: pointer; border-radius: 6px; overflow: hidden; background: linear-gradient(135deg, #282828 0%, #181818 100%); vertical-align: top;",
      }),
      [
        // Video info overlay (top-left)
        "div",
        {
          style:
            "position: absolute; top: 8px; left: 8px; color: white; z-index: 2; font-size: 10px;",
        },
        [
          "div",
          {
            style: "font-weight: 600; margin-bottom: 2px;",
          },
          videoType === "short" ? "Short" : "Video",
        ],
        [
          "div",
          {
            style: "opacity: 0.7; font-family: monospace; font-size: 9px;",
          },
          videoId.substring(0, 8) + "...",
        ],
      ],
      [
        // Play button container (centered)
        "div",
        {
          style:
            "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 3;",
        },
        [
          // Simpler, more visible YouTube play button
          "div",
          {
            style:
              "width: 40px; height: 40px; background: #FF0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.4);",
          },
          [
            "div",
            {
              style:
                "width: 0; height: 0; border-left: 12px solid white; border-top: 8px solid transparent; border-bottom: 8px solid transparent; margin-left: 3px;",
            },
          ],
        ],
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
