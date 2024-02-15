<template>
  <q-item clickable tag="a" :target="newTab ? '_blank' : undefined" :href="link" :disable="disabled">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface StageLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  disabled?: boolean;
  newTab?: boolean
}
withDefaults(defineProps<StageLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
