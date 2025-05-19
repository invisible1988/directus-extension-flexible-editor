<template>
  <v-menu show-arrow placement="bottom-start" :close-on-content-click="true">
    <template #activator="{ toggle }">
      <BaseToolButton
        :icon="props.icon"
        :title="buttonTitle"
        :active="props.active"
        :disabled="props.disabled"
        :action="toggle"
      />
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="style in highlightStyles"
        :key="style.value"
        @click="applyHighlight(style.value)"
        :active="
          editor.isActive('highlightedText', { highlightStyle: style.value })
        "
        clickable
      >
        <template #prepend>
          <v-icon :name="style.icon"></v-icon>
        </template>
        <v-list-item-title>{{ style.name }}</v-list-item-title>
      </v-list-item>

      <v-divider v-if="isAnyHighlightActive"></v-divider>

      <v-list-item
        @click="removeHighlight"
        v-if="isAnyHighlightActive"
        clickable
      >
        <template #prepend>
          <v-icon name="format_clear"></v-icon>
        </template>
        <v-list-item-title>{{
          t("highlighted_text.remove_highlight")
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Editor } from "@tiptap/core";
import BaseToolButton from "../../components/ToolButton.vue";
import { useI18n } from "vue-i18n";
import { useI18nFallback } from "../../composables/use-i18n-fallback";
import type { CustomToolButtonProps } from "../../types";

const props = defineProps<
  CustomToolButtonProps & {
    editor: Editor;
    icon: string;
    title: string;
    active: boolean;
    disabled: boolean;
  }
>();

const { t } = useI18nFallback(useI18n());

const buttonTitle = computed(
  () => props.title || t("highlighted_text.toolbar_button_title")
);

const highlightStyles = [
  {
    name: t("highlighted_text.green"),
    value: "green",
  },
  {
    name: t("highlighted_text.orange"),
    value: "orange",
  },
  { name: t("highlighted_text.red"), value: "red" },
];

const applyHighlight = (styleValue: string) => {
  props.editor
    .chain()
    .focus()
    .toggleHighlightedText({ highlightStyle: styleValue })
    .run();
  // Menu should close due to :close-on-content-click="true"
};

const removeHighlight = () => {
  props.editor.chain().focus().unsetHighlightedText().run();
  // Menu should close due to :close-on-content-click="true"
};

const isAnyHighlightActive = computed(() => {
  return props.editor.isActive("highlightedText");
});
</script>
