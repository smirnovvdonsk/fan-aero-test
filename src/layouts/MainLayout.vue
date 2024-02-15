<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="headerColorClasses" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center">
          <q-icon name="img:/favicon.svg" class="q-mr-xs" />
          <div>Fan Aero Test</div>
        </q-toolbar-title>

        <q-btn flat dense round :icon="darkThemeButtonIcon" @click="darkThemeButtonOnClick">
          <q-tooltip> {{ darkThemeButtonTooltip }} </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Этапы испытания </q-item-label>
        <StageLink v-for="link in stagesLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer :class="headerColorClasses" elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import StageLink, { StageLinkProps } from 'components/StageLink.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const headerColorClasses = computed<string>(() => `\
  bg-${$q.dark.isActive ? 'blue-grey-10' : 'blue-grey-2'} \
  text-${$q.dark.isActive ? 'white' : 'black'} \
  `);

const darkThemeButtonIcon = computed<string>(() => ($q.dark.isActive ? 'light_mode' : 'dark_mode'));
const darkThemeButtonTooltip = computed<string>(() => ($q.dark.isActive ? 'Светлая тема' : 'Тёмная тема'));

function darkThemeButtonOnClick(): void { $q.dark.toggle(); }

const stagesLinks: StageLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const leftDrawerOpen = ref<boolean>(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
