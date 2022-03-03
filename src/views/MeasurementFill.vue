<template>
  <div>
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
    <div>Выполненные измерения:</div>
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Показания барометра p'<sub>б</sub></div>
      <div><NumberInput v-model="barometer" tofixed="1" :invalid="incorrectBarometer"/></div>
      <div>мм.рт.ст.</div>
    </div>
    <div class="d-flex flex-row flex-nowrap justify-content-start align-items-center">
      <div>Показания термометра t<sub>A</sub></div>
      <div><NumberInput v-model="thermometer" tofixed="1" :invalid="incorrectThermometer"/></div>
      <div>°C</div>
    </div>
    <MeasurementTable v-model="deltaP"/>
    <hr>
    <div>
      <h5>Результаты вычислений:</h5>
      <div v-if="!incorrectBarometer">
        Атмосферное давление p'<sub>0</sub> =
        <NumberOutput :value="getBarometerPascal" tofixed="0"/>Па.
      </div>
      <div v-if="!incorrectThermometer">
        Термодинамическая температура воздуха t'<sub>A</sub> =
        <NumberOutput :value="getThermometerKelvin" tofixed="1"/>K.
      </div>
      <div v-if="!incorrectThermometer">
        Термодинамическая температура воздуха на выходе из изделия t'<sub>вых</sub> =
        <NumberOutput :value="getToutKelvin" tofixed="1"/>K.
      </div>
      <table v-if="!incorrectDeltaP" class="printed-table">
        <thead>
          <tr>
            <th v-for="pointIndex in [1,2,3]" :key="pointIndex">Режим №{{pointIndex}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="pointIndex in [1,2,3]" :key="pointIndex">
              <div>
                Статическое давление в мерном сечении
                p<sub>s</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PsArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Динамическое давление в мерном сечении
                p<sub>d</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PdArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Полное давление в мерном сечении
                p<sub>t1</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="Pt1Array[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Плотность среды в мерном сечении
                ρ<sub>m</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="densityArray[pointIndex-1]" tofixed="3"
                    />кг/м<sup>3</sup>.
              </div>
              <div>
                Скорость воздуха в мерном сечении
                v<sub>m</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="VmArray[pointIndex-1]" tofixed="1"
                    />м/с.
              </div>
              <div>
                Производительность в номинальном режиме
                Q&nbsp;=&nbsp;<NumberOutput
                      :value="QArray[pointIndex-1]" tofixed="0"
                    />м<sup>3</sup>/ч.
              </div>
              <div>
                Расхождение полученной и номинальной производительности
                ψ&nbsp;=&nbsp;<NumberOutput
                      :value="psiArray[pointIndex-1]" tofixed="1"
                    />%.
              </div>
              <Warning v-if="meetsPsiArray.includes(false)"
                   :style="{visibility: meetsPsiArray[pointIndex-1] ? 'hidden' : 'visible'}">
                Расхождение
                ψ&nbsp;=&nbsp;<NumberOutput
                      :value="psiArray[pointIndex-1]" tofixed="1"
                    />%. Это больше,
                    чем&nbsp;<NumberOutput
                      :value="getPsi" tofixed="1"
                    />%
                Переделайте режим №{{pointIndex}}
                или измените ψ на предыдущих шагах по согласованию с комиссией.
              </Warning>
              <div>
                Скорость воздуха на выходе
                v<sub>вых</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="VoutArray[pointIndex-1]" tofixed="1"
                    />м/с.
              </div>
              <div>
                Динамическое давление на выходе
                p'<sub>dv</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PdOutArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Полное давление в выходном сечении
                p<sub>t2</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PtOutArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Полное давление в режиме испытаний
                p'<sub>v</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PvAcuteArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Плотность среды на выходе в номинальном режиме
                ρ<sub>вых</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="densityOutArray[pointIndex-1]" tofixed="3"
                    />кг/м<sup>3</sup>.
              </div>
              <div>
                Полное давление в номинальном режиме
                p<sub>v</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PvArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Динамическое давление в номинальном режиме
                p<sub>dv</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PdvArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
              <div>
                Статическое давление в номинальном режиме
                p<sub>sv</sub>&nbsp;=&nbsp;<NumberOutput
                      :value="PsvArray[pointIndex-1]" tofixed="1"
                    />Па.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Chart :chart="chart"/>
  </div>
</template>

<script>
import {
  mapGetters, mapActions, mapMutations,
} from 'vuex';

import MeasurementTable from '../components/MeasurementTable.vue';
import NumberInput from '../components/NumberInput.vue';
import NumberOutput from '../components/NumberOutput.vue';
import Warning from '../components/Warning.vue';
import Chart from '../components/Chart.vue';

export default {
  components: {
    MeasurementTable,
    NumberInput,
    NumberOutput,
    Warning,
    Chart,
  },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing', [
      'getBarometer', 'getThermometer', 'getBarometerPascal',
      'getThermometerKelvin',
      'incorrectBarometer', 'incorrectThermometer',
      'getDeltaP', 'incorrectDeltaP',
      'PsArray', 'PdArray', 'Pt1Array',
      'densityArray', 'VmArray', 'QArray',
      'psiArray', 'meetsPsiArray',
      'VoutArray', 'PdOutArray', 'PtOutArray',
      'PvAcuteArray',
      'densityOutArray',
      'PvArray', 'PdvArray', 'PsvArray',
      'chart',
    ]),
    ...mapGetters('testing/nominals', [
      'getName', 'getSerial', 'getPlace',
      'getToutKelvin',
    ]),
    ...mapGetters('testing/mode', [
      'largeDuct', 'getPsi',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectDeltaP
        || this.incorrectBarometer
        || this.incorrectThermometer
        || this.meetsPsiArray.includes(false)
      );
    },
    name: { get() { return this.getName; }, set(value) { this.setName(value); } },
    serial: { get() { return this.getSerial; }, set(value) { this.setSerial(value); } },
    place: { get() { return this.getPlace; }, set(value) { this.setPlace(value); } },

    barometer: { get() { return this.getBarometer; }, set(value) { this.setBarometer(value); } },
    thermometer: {
      get() { return this.getThermometer; },
      set(value) { this.setThermometer(value); },
    },

    deltaP: { get() { return this.getDeltaP; }, set(value) { this.setDeltaP(value); } },
  },
  methods: {
    ...mapActions('testing', [
      'setDeltaP',
    ]),
    ...mapMutations('testing', [
      'setBarometer', 'setThermometer',
    ]),
    ...mapMutations('testing/nominals', [
      'setName', 'setSerial', 'setPlace',
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
