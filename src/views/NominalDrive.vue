<template>
  <div>
    <p>Заполните номинальные данные изделия из задания</p>
    <table class="table-blind">
      <tbody>
        <tr colspan="7">
          <td>
            <Check v-model="speedChange">
              Испытания будут проводиться при частоте вращения, отличной от номинала
            </Check>
          </td>
        </tr>
        <tr>
          <td>Номинальная мощность N<sub>ном</sub></td>
          <td><NumberInput v-model="Nnom" tofixed="2" size="7"
                           :invalid="incorrectNnom" :dashed="!speedChange && !needNEngine"/></td>
          <td>кВт</td>
          <td>или</td>
          <td><NumberInput v-model="NnomWatt" tofixed="0" size="7"
                           :invalid="incorrectNnom" :dashed="!speedChange && !needNEngine"/></td>
          <td>Вт</td>
        </tr>
        <tr>
          <td>Номинальная частота вращения f<sub>ном</sub></td>
          <td><NumberInput v-model="Fnom" tofixed="0" size="7"
                           :invalid="incorrectFnom" :dashed="!speedChange && !needNEngine"/></td>
          <td>мин<sup>-1</sup></td>
          <td>или</td>
          <td><NumberInput v-model="FnomHz" tofixed="2" size="7"
                           :invalid="incorrectFnom" :dashed="!speedChange && !needNEngine"/></td>
          <td>Гц</td>
        </tr>
      </tbody>
    </table>
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
import Check from '../components/Check.vue';
import Warning from '../components/Warning.vue';

export default {
  components: { NumberInput, Check, Warning },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/nominals', [
      'getSpeedChange',
      'getNnom', 'getNnomWatt', 'incorrectNnom',
      'getFnom', 'getFnomHz', 'incorrectFnom',
    ]),
    ...mapGetters('testing/mode', [
      'getSpeedChange',
      'getNEngine', 'getNeedNEngine', 'incorrectNEngine',
      'getFnomEngine', 'incorrectFnomEngine',
      'warningPowerOverEngine',
      'warningOverClocking',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectNnom || this.incorrectFnom
        || this.incorrectNEngine || this.incorrectFnomEngine
        // || this.warningOverClocking
      );
    },
    speedChange: {
      get() { return this.getSpeedChange; },
      set(value) { this.setSpeedChange(value); },
    },
    Nnom: { get() { return this.getNnom; }, set(value) { this.setNnom(value); } },
    NnomWatt: { get() { return this.getNnomWatt; }, set(value) { this.setNnomWatt(value); } },
    Fnom: { get() { return this.getFnom; }, set(value) { this.setFnom(value); } },
    FnomHz: { get() { return this.getFnomHz; }, set(value) { this.setFnomHz(value); } },
    NEngine: { get() { return this.getNEngine; }, set(value) { this.setNEngine(value); } },
    needNEngine: {
      get() { return this.getNeedNEngine; },
      set(value) { this.setNeedNEngine(value); },
    },
    FnomEngine: { get() { return this.getFnomEngine; }, set(value) { this.setFnomEngine(value); } },
  },
  methods: {
    ...mapMutations('testing/nominals', [
      'setNnom', 'setNnomWatt',
      'setFnom', 'setFnomHz',
    ]),
    ...mapMutations('testing/mode', [
      'setSpeedChange',
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
