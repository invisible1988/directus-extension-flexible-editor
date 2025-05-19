<template>
  <v-menu show-arrow placement="bottom-start">
    <template #activator="{ toggle }">
      <ToolButton :title :icon :active :disabled :action="toggle" />
    </template>
    <v-list>
      <v-list-item clickable @click="action" :disabled="disabled">
        <v-list-item-content>
          <v-text-overflow :text="t('table.insert')" />
        </v-list-item-content>
      </v-list-item>

      <!-- New Menu Item for Set Class -->
      <v-list-item
        clickable
        @click="openSetClassDialog"
        :disabled="!editor.isActive('table')"
      >
        <v-list-item-content>
          <v-text-overflow :text="t('table.set_class_menu_item')" />
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().mergeOrSplit().run() &&
          !editor.can().chain().focus().toggleHeaderCell().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_cells')" />
        </template>

        <v-list-item
          clickable
          @click="editor.chain().focus().mergeOrSplit().run()"
          :disabled="!editor.can().chain().focus().mergeOrSplit().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.merge_or_split_cells')" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          clickable
          @click="editor.chain().focus().toggleHeaderCell().run()"
          :disabled="!editor.can().chain().focus().toggleHeaderCell().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.toggle_header')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().addColumnBefore().run() &&
          !editor.can().chain().focus().addColumnAfter().run() &&
          !editor.can().chain().focus().deleteColumn().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_columns')" />
        </template>

        <v-list-item
          clickable
          @click="editor.chain().focus().addColumnBefore().run()"
          :disabled="!editor.can().chain().focus().addColumnBefore().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_column_before')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          @click="editor.chain().focus().addColumnAfter().run()"
          :disabled="!editor.can().chain().focus().addColumnAfter().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_column_after')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          @click="editor.chain().focus().deleteColumn().run()"
          :disabled="!editor.can().chain().focus().deleteColumn().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.delete_column')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().addRowBefore().run() &&
          !editor.can().chain().focus().addRowAfter().run() &&
          !editor.can().chain().focus().deleteRow().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_rows')" />
        </template>

        <v-list-item
          clickable
          @click="editor.chain().focus().addRowBefore().run()"
          :disabled="!editor.can().chain().focus().addRowBefore().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_row_before')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          @click="editor.chain().focus().addRowAfter().run()"
          :disabled="!editor.can().chain().focus().addRowAfter().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_row_after')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          @click="editor.chain().focus().deleteRow().run()"
          :disabled="!editor.can().chain().focus().deleteRow().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.delete_row')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-menu>

  <!-- New Dialog for Set Class -->
  <v-dialog v-model="showSetClassDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ t("table.dialog_set_style_title") }}</span>
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedTableClassInDialog"
          :items="tableClassOptions"
          item-title="text"
          item-value="value"
          :label="t('table.dialog_select_style_label')"
          outlined
          clearable
          hide-details
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-button secondary @click="cancelSetClassDialog">
          {{ t("table.dialog_cancel") }}
        </v-button>
        <v-button @click="applySelectedTableClass">
          {{ t("table.dialog_apply") }}
        </v-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"; // Import ref and computed
import ToolButton from "../../components/ToolButton.vue";
import { useI18n } from "vue-i18n";
import { useI18nFallback } from "../../composables/use-i18n-fallback";
import type { CustomToolButtonProps } from "../../types";
import type { Editor } from "@tiptap/core"; // Import Editor type

const props = defineProps<CustomToolButtonProps>();

const { t } = useI18nFallback(useI18n());

// Dialog state and options
const showSetClassDialog = ref(false);
const selectedTableClassInDialog = ref<string | null>(null);

interface TableClassOptionItem {
  text: string;
  value: string | null;
}

const tableClassOptions = computed<TableClassOptionItem[]>(() => [
  { text: t("table.class_option_default"), value: null },
  { text: t("table.class_option_columns_2"), value: "columns-2" },
]);

const openSetClassDialog = () => {
  const currentStyle = editor.value.getAttributes("table").dataTableStyle; // Read dataTableStyle
  selectedTableClassInDialog.value = currentStyle || null;
  showSetClassDialog.value = true;
};

const applySelectedTableClass = () => {
  editor.value
    .chain()
    .focus()
    .updateAttributes("table", {
      dataTableStyle: selectedTableClassInDialog.value,
    }) // Set dataTableStyle
    .run();
  showSetClassDialog.value = false;
};

const cancelSetClassDialog = () => {
  showSetClassDialog.value = false;
};

// Ensure editor prop is available for the dialog logic
const editor = computed(() => props.editor as Editor);
</script>
