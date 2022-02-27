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
    <div style="color:red">Не забыть про соответствие расходов пси</div>
    <hr>
    <div v-if="!stepFilledIncorrectly">
      <h5>Результаты вычислений:</h5>
      <div>
        Атмосферное давление p'<sub>0</sub> =
        <NumberOutput :value="getBarometerPascal" tofixed="0"/>Па.
      </div>
      <div>
        Термодинамическая температура воздуха t'<sub>A</sub> =
        <NumberOutput :value="getThermometerKelvin" tofixed="1"/>K.
      </div>
      <div>
        Термодинамическая температура воздуха на выходе из изделия t'<sub>вых</sub> =
        <NumberOutput :value="getToutKelvin" tofixed="1"/>K.
      </div>
      <table>
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
                      :value="VmArray[pointIndex-1]" tofixed="3"
                    />м/с.
              </div>
              <div>
                Производительность в номинальном режиме
                Q&nbsp;=&nbsp;<NumberOutput
                      :value="QArray[pointIndex-1]" tofixed="3"
                    />м<sup>3</sup>/ч.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapActions, mapMutations,
} from 'vuex';

import MeasurementTable from '../components/MeasurementTable.vue';
import NumberInput from '../components/NumberInput.vue';
import NumberOutput from '../components/NumberOutput.vue';

export default {
  components: {
    MeasurementTable,
    NumberInput,
    NumberOutput,
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
    ]),
    ...mapGetters('testing/nominals', [
      'getName', 'getSerial', 'getPlace',
      'getToutKelvin',
    ]),
    ...mapGetters('testing/mode', [
      'largeDuct',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectDeltaP
        || this.incorrectBarometer
        || this.incorrectThermometer
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
