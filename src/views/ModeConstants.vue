<template>
  <div>
    <p>
      Введите общие параметры испытатаний
    </p>
    <!-- Ширина получаемой характеристики -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Максимальная ширина получаемой характеристики ψ = </div>
      <div>±</div>
      <div><NumberInput v-model="psi" tofixed="0" :invalid="incorrectPsi"/></div>
      <div>% (от Q<sub>ном</sub> =</div>
      <div><NumberOutput :value="getQnom" tofixed="0"/></div>
      <div>м<sup>3</sup>/ч)</div>
    </div>
    <!-- Диапазон скоростей прибора -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Прибор измеряет скорость потока</div>
      <div>от</div>
      <div><NumberInput v-model="speedMin" tofixed="1" :invalid="incorrectSpeedRange"/></div>
      <div>до</div>
      <div><NumberInput v-model="speedMax" tofixed="1" :invalid="incorrectSpeedRange"/></div>
      <div>м/с</div>
    </div>
    <!-- Макс. давление в воздуховоде -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Измерительный воздуховод и заслонка выдерживают давление не более</div>
      <div><NumberInput v-model="maxPressure" tofixed="0" :invalid="incorrectMaxPressure"/></div>
      <div>Па</div>
    </div>
    <!-- Макс. мощность питания -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Предел мощности питания двигателя (ограничение питающей сети при испытаниях)</div>
      <div><NumberInput v-model="maxN" tofixed="2" :invalid="incorrectMaxN"/></div>
      <div>кВт</div>
    </div>
    <!-- Номинальная мощность испытательного двигателя -->
    <Check v-model="needNEngine">
      Будет использоваться нештатный двигатель
    </Check>
    <div v-if="needNEngine"
         class="d-flex flex-row flex-nowrap justify-content-start align-items-center"
    >
      <div>Номинальная мощность испытательного двигателя</div>
      <div><NumberInput v-model="NEngine" tofixed="2" :invalid="incorrectNEngine"/></div>
      <div>кВт</div>
      <div>при частоте вращения</div>
      <div><NumberInput v-model="FnomEngine" tofixed="2" :invalid="incorrectFnomEngine"/></div>
      <div>мин<sup>-1</sup></div>
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

export default {
  components: {
    NumberInput,
    NumberOutput,
    Check,
    Warning,
  },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/mode', [
      'getPsi', 'incorrectPsi',
      'getSpeedMin', 'getSpeedMax', 'incorrectSpeedRange',
      'getMaxPressure', 'incorrectMaxPressure',
      'getMaxN', 'incorrectMaxN',
      'getNEngine', 'getNeedNEngine', 'incorrectNEngine',
      'getFnomEngine', 'incorrectFnomEngine',
      'warningNoNominalPowerAndFreq',
      'warningPowerOverEngine',
      'warningOverClocking',
    ]),
    ...mapGetters('testing/nominals', [
      'getQnom',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectSpeedRange
        || this.incorrectMaxPressure || this.incorrectPsi || this.incorrectMaxN
        || this.incorrectNEngine || this.incorrectFnomEngine
        || this.warningNoNominalPowerAndFreq
        // || this.warningOverClocking
      );
    },
    psi: { get() { return this.getPsi; }, set(value) { this.setPsi(value); } },
    speedMin: { get() { return this.getSpeedMin; }, set(value) { this.setSpeedMin(value); } },
    speedMax: { get() { return this.getSpeedMax; }, set(value) { this.setSpeedMax(value); } },
    maxPressure: {
      get() { return this.getMaxPressure; },
      set(value) { this.setMaxPressure(value); },
    },
    maxN: { get() { return this.getMaxN; }, set(value) { this.setMaxN(value); } },
    NEngine: { get() { return this.getNEngine; }, set(value) { this.setNEngine(value); } },
    needNEngine: {
      get() { return this.getNeedNEngine; },
      set(value) { this.setNeedNEngine(value); },
    },
    FnomEngine: { get() { return this.getFnomEngine; }, set(value) { this.setFnomEngine(value); } },
  },
  methods: {
    ...mapMutations('testing/mode', [
      'setPsi',
      'setSpeedMin', 'setSpeedMax',
      'setMaxPressure',
      'setMaxN',
      'setNEngine', 'setNeedNEngine',
      'setFnomEngine',
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
