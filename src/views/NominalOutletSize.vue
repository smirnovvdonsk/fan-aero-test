<template>
  <div>
    <p>Заполните номинальные данные изделия из задания</p>
    <hr>
    <div class="form-check">
      <input class="form-check-input" type="radio"
              name="OutForm" id="OutFormSquare"
              :value="true" v-model="squareOut"
      />
      <label class="form-check-label" for="OutFormSquare">
        Прямоугольный выходной патрубок
      </label>
      <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
        <div>Ширина B:</div>
        <div><NumberInput v-model="sizeOutB" tofixed="0" size="7"
                           :invalid="squareOut && incorrectSizeOut" :dashed="!squareOut"/>
        </div>
        <div>мм</div>
      </div>
      <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
        <div>Высота H:</div>
        <div><NumberInput v-model="sizeOutH" tofixed="0" size="7"
                           :invalid="squareOut && incorrectSizeOut" :dashed="!squareOut"/>
        </div>
        <div>мм</div>
      </div>
      <hr>
      <input class="form-check-input" type="radio"
              name="OutForm" id="OutFormRound"
              :value="false" v-model="squareOut"
      />
      <label class="form-check-label" for="OutFormRound">
        Круглый выходной патрубок
      </label>
      <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
        <div>Диаметр D:</div>
        <div><NumberInput v-model="sizeOutD" tofixed="0" size="7"
                           :invalid="!squareOut && incorrectSizeOut" :dashed="squareOut"/>
        </div>
        <div>мм</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';
import NumberInput from '../components/NumberInput.vue';

export default {
  components: { NumberInput },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/nominals', [
      'getSquareOut',
      'getSizeOutD', 'getSizeOutB', 'getSizeOutH', 'incorrectSizeOut',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectSizeOut
      );
    },
    squareOut: {
      get() { return this.getSquareOut; },
      set(value) { this.setSquareOut(value); },
    },
    sizeOutD: { get() { return this.getSizeOutD; }, set(value) { this.setSizeOutD(value); } },
    sizeOutB: { get() { return this.getSizeOutB; }, set(value) { this.setSizeOutB(value); } },
    sizeOutH: { get() { return this.getSizeOutH; }, set(value) { this.setSizeOutH(value); } },
  },
  methods: {
    ...mapMutations('testing/nominals', [
      'setSquareOut',
      'setSizeOutD', 'setSizeOutB', 'setSizeOutH',
    ]),
  },
  mounted() {
    this.$emit('stepFilledIncorrectly', this.stepFilledIncorrectly);
  },
};
</script>

<style scoped lang="scss">
.d-flex > div {
  margin: 0.2em;
}
</style>
