<template>
  <v-card class="card">
    <v-card-title class="card-title">YouTube Embed</v-card-title>
    <v-card-text>
      <div class="grid">
        <div class="field">
          <div class="type-label">YouTube Video ID</div>
          <v-input v-model="youtubeId" placeholder="dQw4w9WgXcQ" />
        </div>

        <div class="field">
          <div class="type-label">Video Type</div>
          <v-select v-model="videoType" :items="videoTypeOptions" />
        </div>

        <v-notice type="info">
          Enter only the YouTube video ID (11 characters)
        </v-notice>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-button secondary @click="$emit('close-dialog')">Cancel</v-button>
      <v-button @click="insertVideo" :disabled="!isValidYouTubeId(youtubeId)">
        Insert
      </v-button>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  get: () => { videoId?: string; videoType?: "video" | "short" };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "close-dialog": [];
  set: [{ videoId: string; videoType: "video" | "short" }];
  unset: [];
}>();

const youtubeId = ref("");
const videoType = ref<"video" | "short">("video");

const videoTypeOptions = [
  { text: "Normal Video", value: "video" },
  { text: "YouTube Short", value: "short" },
];

// Load existing values when dialog component mounts
onMounted(() => {
  const attrs = props.get();
  if (attrs.videoId) {
    youtubeId.value = attrs.videoId;
    videoType.value = attrs.videoType || "video";
  }
});

// Validate YouTube ID format
function isValidYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id.trim());
}

function insertVideo() {
  const videoId = youtubeId.value.trim();

  if (isValidYouTubeId(videoId)) {
    emit("set", {
      videoId: videoId,
      videoType: videoType.value,
    });
    emit("close-dialog");
  }
}
</script>

<style scoped>
.card {
  --v-card-max-width: 500px;
}

.grid {
  display: grid;
  gap: 24px;
}

.field {
  display: grid;
  gap: 8px;
}

.type-label {
  color: var(--theme--form--field--label--foreground);
  font-weight: 600;
  text-transform: none;
}
</style>
