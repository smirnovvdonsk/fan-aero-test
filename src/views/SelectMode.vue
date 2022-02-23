<template>
  <div>
    <p>
      Подберём измерительный воздуховод и частоту вращения
    </p>
    <!-- Диаметр воздуховода -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Диаметр измерительного воздуховода D<sub>ив</sub></div>
      <div><NumberInput v-model="diameter" tofixed="0" :invalid="incorrectDiameter"/></div>
      <div>мм</div>
    </div>
    <Warning v-if="warningOutsideSpeedRange && speedRealRange.min < Infinity">
      Придётся измерять скорости потока в диапазоне
      от <NumberOutput :value="speedRealRange.min" tofixed="1"/>м/с
      до <NumberOutput :value="speedRealRange.max" tofixed="1"/>м/с,
      тогда как прибор измеряет
      от <NumberOutput :value="getSpeedMin" tofixed="1"/>м/с
      до <NumberOutput :value="getSpeedMax" tofixed="1"/>м/с
    </Warning>
    <Warning v-if="warningOverPressure">
      Давление при испытаниях
      (<NumberOutput :value="realPressure" tofixed="0"/>Па)
      выше, чем выдерживает воздуховод/заслонка
      (<NumberOutput :value="getMaxPressure" tofixed="0"/>Па)
    </Warning>
    <hr>
    <!-- Частота вращения -->
    <Check v-model="speedChange">
      Испытания будут проводиться при частоте вращения, отличной от номинала
    </Check>
    <div v-if="speedChange"
          class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Испытательная частота вращения f<sub>исп</sub></div>
      <div>
        <NumberInput v-model="F" tofixed="0" :disabled="!speedChange" :invalid="incorrectF"/>
      </div>
      <div>мин<sup>-1</sup></div>
    </div>
    <div v-if="speedChange && realN < Infinity"
          class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Испытательная мощность составит N<sub>исп</sub> =</div>
      <div>
        <NumberOutput :value="realN" tofixed="2"/> кВт
      </div>
    </div>
    <Warning v-if="warningNoNominalPowerAndFreq">
      На предыдущих шагах
      не задана номинальная мощность и частота вращения в рабочей точке.
    </Warning>
    <Warning v-if="warningPowerOverEngine">
      Мощность при испытаниях превышает ту, на которую
      способен двигатель, применяемый при испытаниях.
    </Warning>
    <Warning v-if="warningOverClocking">
      Испытания будут проводиться на частоте вращения выше,
      чем номинальная для используемого двигателя.
      Физически это возможно, но для этого
      частотному преобразователю (ЧП) придётся подать напряжение
      выше номинала. Изоляция двигателя может не выдержать это напряжение.
      Кроме того, если это напряжение окажется выше сетевого, то большинство
      ЧП не способны выдать напряжение выше сетевого.
    </Warning>
    <hr>
    <DuctDwg :d="diameter"/>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';

import NumberInput from '../components/NumberInput.vue';
import NumberOutput from '../components/NumberOutput.vue';
import Check from '../components/Check.vue';
import Warning from '../components/Warning.vue';
import DuctDwg from '../components/DuctDwg.vue';

export default {
  components: {
    NumberInput,
    NumberOutput,
    Check,
    Warning,
    DuctDwg,
  },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/mode', [
      'getDiameter', 'incorrectDiameter',
      'getSpeedChange', 'Fnom', 'realF', 'incorrectF',
      'getSpeedMin', 'getSpeedMax',
      'speedRealRange',
      'warningOutsideSpeedRange',
      'realN',
      'warningNoNominalPowerAndFreq',
      'warningPowerOverEngine',
      'warningOverClocking',
      'warningOverPressure',
      'realPressure', 'getMaxPressure',
    ]),
    ...mapGetters('testing/nominals', [
      'getQnom',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectSpeedRange
        || this.warningOutsideSpeedRange
        || this.incorrectDiameter
        || this.incorrectF
        || this.warningPowerOverEngine
        || this.warningNoNominalPowerAndFreq
        || this.warningOverPressure
        // || this.warningOverClocking
      );
    },
    diameter: { get() { return this.getDiameter; }, set(value) { this.setDiameter(value); } },
    speedChange: {
      get() { return this.getSpeedChange; },
      set(value) { this.setSpeedChange(value); },
    },
    F: { get() { return this.realF; }, set(value) { this.setF(value); } },
  },
  methods: {
    ...mapMutations('testing/mode', [
      'setDiameter',
      'setSpeedChange', 'setF',
    ]),
    ...mapMutations('testing/nominals', []),
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
