<template>
  <div>
    <p>Заполните номинальные данные изделия из задания</p>
    <table class="table-blind">
      <tbody>
        <tr>
          <td>Температура перемещаемого воздуха t<sub>ном</sub> (или температура на входе)</td>
          <td><NumberInput v-model="Tnom" tofixed="1" size="7"
                           :invalid="incorrectTnom"/></td>
          <td>°</td>
          <td>или</td>
          <td><NumberInput v-model="TnomKelvin" tofixed="1" size="7"
                          :invalid="incorrectTnom"/></td>
          <td>K</td>
          <td colspan="3"></td>
        </tr>
        <tr colspan="10">
          <td><Check v-model="doesCoolOrHeat">Изделие нагревает/охлаждает воздух</Check></td>
        </tr>
        <tr>
          <td>Температура воздуха на выходе из изделия t<sub>вых</sub></td>
          <td><NumberInput v-model="Tout" tofixed="1" size="7"
                           :invalid="incorrectTout" :disabled="!doesCoolOrHeat"/></td>
          <td>°</td>
          <td>или</td>
          <td><NumberInput v-model="ToutKelvin" tofixed="1" size="7"
                          :invalid="incorrectTout" :disabled="!doesCoolOrHeat"/></td>
          <td>K</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td>Атмосферное давление P<sub>0ном</sub></td>
          <td><NumberInput v-model="P0nom" tofixed="0" size="7"
                           :invalid="incorrectP0nom" :dashed="!doesCoolOrHeat"/></td>
          <td>Па</td>
          <td>или</td>
          <td><NumberInput v-model="P0nomMMHg" tofixed="2" size="7"
                          :invalid="incorrectP0nom" :dashed="!doesCoolOrHeat"/></td>
          <td>мм.рт.ст</td>
          <td>или</td>
          <td><NumberInput v-model="P0nomAtm" tofixed="3" size="7"
                          :invalid="incorrectP0nom" :dashed="!doesCoolOrHeat"/></td>
          <td>атм</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';
import NumberInput from '../components/NumberInput.vue';
import Check from '../components/Check.vue';

export default {
  components: { NumberInput, Check },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing/nominals', [
      'getDoesCoolOrHeat',
      'getTnom', 'getTnomKelvin', 'incorrectTnom',
      'getTout', 'getToutKelvin', 'incorrectTout',
      'getP0nom', 'getP0nomMMHg', 'getP0nomAtm', 'incorrectP0nom',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectTnom || this.incorrectTout || this.incorrectP0nom
      );
    },
    doesCoolOrHeat: {
      get() { return this.getDoesCoolOrHeat; },
      set(value) { this.setDoesCoolOrHeat(value); },
    },
    Tnom: { get() { return this.getTnom; }, set(value) { this.setTnom(value); } },
    TnomKelvin: { get() { return this.getTnomKelvin; }, set(value) { this.setTnomKelvin(value); } },
    Tout: { get() { return this.getTout; }, set(value) { this.setTout(value); } },
    ToutKelvin: { get() { return this.getToutKelvin; }, set(value) { this.setToutKelvin(value); } },
    P0nom: { get() { return this.getP0nom; }, set(value) { this.setP0nom(value); } },
    P0nomMMHg: { get() { return this.getP0nomMMHg; }, set(value) { this.setP0nomMMHg(value); } },
    P0nomAtm: { get() { return this.getP0nomAtm; }, set(value) { this.setP0nomAtm(value); } },
  },
  methods: {
    ...mapMutations('testing/nominals', [
      'setDoesCoolOrHeat',
      'setTnom', 'setTnomKelvin',
      'setTout', 'setToutKelvin',
      'setP0nom', 'setP0nomMMHg', 'setP0nomAtm',
    ]),
  },
  mounted() {
    this.$emit('stepFilledIncorrectly', this.stepFilledIncorrectly);
  },
};
</script>
