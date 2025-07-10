<template>
  <ToolButton
    :title
    :icon
    :display
    :shortcut
    :active
    :disabled
    :action="() => (showDialog = true)"
  />

  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <span class="text-h6">YouTube Embed</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="youtubeId"
          label="YouTube Video ID or URL"
          placeholder="dQw4w9WgXcQ or full YouTube URL"
          outlined
          dense
          class="mb-4"
        />

        <v-radio-group v-model="videoType" row>
          <v-radio label="Normal Video" value="video" />
          <v-radio label="YouTube Short" value="short" />
        </v-radio-group>

        <div class="text-caption text--secondary">
          You can paste a full YouTube URL or just the video ID
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showDialog = false"> Cancel </v-btn>
        <v-btn
          color="primary"
          @click="insertVideo"
          :disabled="!youtubeId.trim()"
        >
          Insert
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolButton from "../../components/ToolButton.vue";
import type { CustomToolButtonProps } from "../../types";

const props = defineProps<CustomToolButtonProps>();

// Destructure props for easier access
const { title, icon, display, shortcut, active, disabled, editor } = props;

const showDialog = ref(false);
const youtubeId = ref("");
const videoType = ref<"video" | "short">("video");

// Extract YouTube ID from various URL formats
function extractYouTubeId(input: string): string {
  const trimmed = input.trim();

  // If it's already just an ID (11 characters, alphanumeric with dashes/underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return trimmed;
}

function openDialog() {
  showDialog.value = true;
  youtubeId.value = "";
  videoType.value = "video";
}

function insertVideo() {
  const extractedId = extractYouTubeId(youtubeId.value);

  if (extractedId) {
    // Use insertContent to insert the YouTube node
    props.editor
      .chain()
      .focus()
      .insertContent({
        type: "youtube",
        attrs: {
          videoId: extractedId,
          type: videoType.value,
        },
      })
      .run();
  }

  showDialog.value = false;
}
</script>
