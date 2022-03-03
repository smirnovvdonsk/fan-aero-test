<template>
  <div>
    <p>
      Заполните номинальные данные изделия из задания.
      Можно не заполнять поля, тогда в протоколе будет оставлено
      место для записи вручную.
    </p>
    <label for="deviceName" class="form-label">
      Название изделия (как оно будет в протоколе):
    </label>
    <textarea class="form-control" id="deviceName" rows="3" v-model="name"></textarea>
    <div class="d-flex flex-row my-2">
      <label for="deviceSerial" class="form-label me-2">Заводской&nbsp;номер:</label>
      <input type="text" class="form-control" id="deviceSerial" v-model="serial">
    </div>
    <div class="d-flex flex-row my-2">
      <label for="devicePlace" class="form-label me-2">Место проведения испытаний:</label>
      <input type="text" class="form-control" id="devicePlace" v-model="place">
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';

export default {
  components: {},
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/nominals', [
      'getName', 'getSerial', 'getPlace',
    ]),
    stepFilledIncorrectly() {
      return (
        // this.incorrectSizeOut
        false
      );
    },

    name: { get() { return this.getName; }, set(value) { this.setName(value); } },
    serial: { get() { return this.getSerial; }, set(value) { this.setSerial(value); } },
    place: { get() { return this.getPlace; }, set(value) { this.setPlace(value); } },
  },
  methods: {
    ...mapMutations('testing/nominals', [
      'setName', 'setSerial', 'setPlace',
    ]),
  },
  mounted() {
    this.$emit('stepFilledIncorrectly', this.stepFilledIncorrectly);
  },
};
</script>
