<template>
  <ToolButton v-bind="props" :action="() => (showDialog = true)" />

  <v-dialog v-model="showDialog">
    <DialogYouTube
      v-if="showDialog"
      :get="get"
      @set="set"
      @unset="unset"
      @close-dialog="showDialog = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolButton from "../../components/ToolButton.vue";
import DialogYouTube from "./DialogYouTube.vue";
import type { CustomToolButtonProps } from "../../types";

const props = defineProps<CustomToolButtonProps>();

const { showDialog, get, set, unset } = useDialog();

function useDialog() {
  type YouTubeAttributes = { videoId: string; videoType?: "video" | "short" };

  const showDialog = ref(false);

  const get = () => props.editor.getAttributes("youtube_embed");
  const set = (attrs: YouTubeAttributes) => {
    // Check if we're currently inside a YouTube node
    if (props.editor.isActive("youtube_embed")) {
      // Update existing node
      props.editor
        .chain()
        .focus()
        .updateAttributes("youtube_embed", attrs)
        .run();
    } else {
      // Insert new node
      props.editor
        .chain()
        .focus()
        .insertContent({
          type: "youtube_embed",
          attrs,
        })
        .run();
    }
  };
  const unset = () => {
    // For YouTube, we don't have an unset - just close dialog
    showDialog.value = false;
  };

  return { showDialog, get, set, unset };
}
</script>
