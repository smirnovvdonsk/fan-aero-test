<template>
  <!--   <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <div class="card m-1 p-1">
    <router-view />
    <div class="d-flex justify-content-between">
      <button @click="PREVIOUS_STEP">Назад</button>
      <button @click="NEXT_STEP">Далее</button>
      {{currentStepIndex}}
    </div>
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';

export default {
  computed: {
    ...mapGetters(['isTheFirstStep', 'isTheLastStep']),
    ...mapState(['currentStepIndex']),
  },
  methods: {
    ...mapMutations(['NEXT_STEP', 'PREVIOUS_STEP']),
    ...mapActions([]),
  },
};
</script>

<style lang="scss">
@import "./style.scss";
</style>
