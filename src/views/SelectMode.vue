<template>
  <div>
    <DuctDwg v-if="!incorrectDiameter" :d="diameter"
            class="d-none d-xl-block float-end m-2 p-2 border rounded"
    />
    <p>
      Подберём измерительный воздуховод и частоту вращения
    </p>
    <!-- Диаметр воздуховода -->
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Диаметр измерительного воздуховода D<sub>ив</sub></div>
      <div><NumberInput v-model="diameter" tofixed="0" :invalid="incorrectDiameter"/></div>
      <div>мм</div>
    </div>
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
    <hr>
    <div>
      <h5>Итоги подбора параметров испытаний:</h5>
      <DuctDwg v-if="!incorrectDiameter" :d="diameter"
            class="d-xl-none m-2 p-2 border rounded"
      />
      <ol>
        <li>
          <component :is="warningOverPressure ? 'Warning' : 'div'">
            Давление в испытательном воздуховоде будет примерно
            <NumberOutput :value="realPressure" tofixed="0"/>Па.
            Воздуховод выдерживает
            <NumberOutput :value="getMaxPressure" tofixed="0"/>Па.
          </component>
          <div class="progress bg-secondary w-100">
            <div class="progress-bar" :class="{'bg-danger':warningOverPressure}"
                  :style="{width: `${Math.max(realPressure/getMaxPressure,0.1) * 100}%`}"
            >Давление
            </div>
          </div>
        </li>
        <li>
          <component :is="warningOutsideSpeedRange ? 'Warning' : 'div'">
            Скорость потока
            от <NumberOutput :value="speedRealRange.min" tofixed="1"/>до
            <NumberOutput :value="speedRealRange.max" tofixed="1"/>м/с.
            Прибор позволяет
            от <NumberOutput :value="getSpeedMin" tofixed="1"/>до
            <NumberOutput :value="getSpeedMax" tofixed="1"/>м/с.
          </component>
          <div class="progress bg-secondary w-100">
            <div class="progress-bar bg-secondary"
                :style="{width: `${(
                  (speedRealRange.min>getSpeedMin)
                  ? (speedRealRange.min-getSpeedMin)/(getSpeedMax-getSpeedMin)
                  : 0
                  )*100}%`}">
            </div>
            <div class="progress-bar" :class="{'bg-danger':warningOutsideSpeedRange}"
                :style="{width: `${Math.max(speedRealRange.max-speedRealRange.min,0.1)
                /(getSpeedMax-getSpeedMin)*100}%`}">Скорость
            </div>
          </div>
        </li>
        <li v-if="!warningNoNominalPowerAndFreq">
          Испытания будут проводиться
          <span v-if="getSpeedChange || getNeedNEngine">
            на частоте вращения
            <NumberOutput :value="realF" tofixed="0"/>мин<sup>-1</sup>.
          </span>
          <span v-else>
            на номинальной частоте вращения, значение которой не важно.
          </span>
          <span v-if="getSpeedChange || getNeedNEngine">
            При этом фактическая мощность составит
            <NumberOutput :value="realN" tofixed="2"/>кВт.
            Электрическая сеть выдаёт максимум
            <NumberOutput :value="getMaxN" tofixed="2"/>кВт.
          </span>
          <Warning v-if="warningOverClocking">
            Испытания будут проводиться на частоте вращения выше,
            чем номинальная для используемого двигателя.
            Физически это возможно, но для этого
            частотному преобразователю (ЧП) придётся подать напряжение
            выше номинала. Изоляция двигателя может не выдержать это напряжение.
            Кроме того, если это напряжение окажется выше сетевого, то большинство
            ЧП не способны выдать напряжение выше сетевого.
          </Warning>
          <Warning v-if="warningPowerOverNetwork">
            Фактическая мощность при испытаниях выше,
            чем способна выдать электрическая сеть.
          </Warning>
        </li>
        <li>
          Будет использоваться
          {{getNeedNEngine ? 'нештатный' : 'штатный'}}
          двигатель,
          <span v-if="getNeedNEngine || getSpeedChange">
            {{getNeedNEngine
            ?'с номинальной мощностью':'рассчитанный на мощность в номинальной рабочей точке'}}
            <NumberOutput
               :value="getNeedNEngine ? getNEngine: getNnom"
               tofixed="2"
            />кВт
            при номинальной частоте вращения
            <NumberOutput
               :value="getNeedNEngine ? getFnomEngine : getFnom"
              tofixed="0"
            />мин<sup>-1</sup>.
          </span>
          <span v-else>
            номинальная мощность и частота вращения которого не важны.
          </span>
          <span v-if="getNeedNEngine || getSpeedChange">
            Этот двигатель на испытательной частоте
            <NumberOutput
               :value="realF"
              tofixed="0"
            />мин<sup>-1</sup>
            способен выдать мощность
            <NumberOutput
               :value="getNEngine / getFnomEngine * realF"
               tofixed="2"
            />кВт.
          </span>
          <Warning v-if="warningPowerOverEngine">
            Мощность при испытаниях превышает ту, на которую
            способен двигатель, применяемый при испытаниях.
          </Warning>
          <Warning v-if="warningNoNominalPowerAndFreq">
            На предыдущих шагах
            не задана номинальная мощность и частота вращения в рабочей точке.
          </Warning>
        </li>
      </ol>
    </div>
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
      'getNeedNEngine', 'getNEngine', 'getFnomEngine',
      'getMaxN', 'realN',
      'warningNoNominalPowerAndFreq',
      'warningPowerOverNetwork',
      'warningPowerOverEngine',
      'warningOverClocking',
      'warningOverPressure',
      'realPressure', 'getMaxPressure',
    ]),
    ...mapGetters('testing/nominals', [
      'getQnom', 'getFnom', 'getNnom',
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
        || this.warningPowerOverNetwork
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
