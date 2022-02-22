<template>
  <div>
    <p>Заполните номинальные данные изделия из задания</p>
    <hr>
    <!-- Производительность -->
    <table class="table-blind">
      <tbody>
        <tr colspan="7">
          <td><Check checked disabled>Изделие создаёт воздушный поток</Check></td>
        </tr>
        <tr>
          <td>Производительность Q<sub>ном</sub> (расход, подача)</td>
          <td><NumberInput v-model="Qnom" tofixed="0" size="7"
                           :invalid="incorrectQnom"/></td>
          <td>м<sup>3</sup>/ч</td>
          <td>или</td>
          <td><NumberInput v-model="QnomPerSecond" tofixed="2" size="7"
                          :invalid="incorrectQnom"/></td>
          <td>м<sup>3</sup>/с</td>
        </tr>
        <tr>
          <td><Check v-model="needQ">с отклонением</Check></td>
          <td>
            <select v-show="needQ" class="form-select py-0" v-model="QType">
              <option
                  v-for="(value) in CRITERIA_TYPES" :key="value" :value="value"
              >
                {{value}}
              </option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td v-show="needQ">
            <NumberInput v-if="needQPercent" v-model="QPercent" tofixed="1" size="7"
                          :invalid="incorrectQPercent"
            />
            <NumberOutput v-else :value="Qnom" tofixed="0"/>
          </td>
          <td v-show="needQ" v-html="needQPercent ? '%' : 'м<sup>3</sup>/ч'"></td>
        </tr>
      </tbody>
    </table>
    <hr>
    <!-- Полное давление -->
    <table class="table-blind">
      <tbody>
        <tr colspan="7">
          <td><Check v-model="needPVnom">Есть требование по полному давлению</Check></td>
        </tr>
        <tr>
          <td>Полное давление p<sub>Vном</sub> (полный свободный напор)</td>
          <td><NumberInput v-model="PVnom" tofixed="0" size="7"
                           :invalid="incorrectPVnom" :dashed="!needPVnom"/></td>
          <td colspan="3">Па</td>
        </tr>
        <tr v-if="needPVnom">
          <td><Check v-model="needPV">с отклонением</Check></td>
          <td>
            <select v-show="needPV" class="form-select py-0" v-model="PVType">
              <option
                  v-for="(value) in CRITERIA_TYPES" :key="value" :value="value"
              >
                {{value}}
              </option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td v-if="needPV">
            <NumberInput v-if="needPVPercent" v-model="PVPercent" tofixed="1" size="7"
                          :invalid="incorrectPVPercent"
            />
            <NumberOutput v-else :value="PVnom" tofixed="0"/>
          </td>
          <td v-show="needPV" v-html="needPVPercent ? '%' : 'Па'"></td>
        </tr>
      </tbody>
    </table>
    <hr>
    <!-- Статическое давление -->
    <table class="table-blind">
      <tbody>
        <tr colspan="7">
          <td><Check v-model="needPSnom">Есть требование по статическому давлению</Check></td>
        </tr>
        <tr>
          <td>Статическое давление p<sub>Sном</sub> (статический свободный напор)</td>
          <td><NumberInput v-model="PSnom" tofixed="0" size="7"
                           :invalid="incorrectPSnom" :dashed="!needPSnom"/></td>
          <td colspan="3">Па</td>
        </tr>
        <tr v-if="needPSnom">
          <td><Check v-model="needPS">с отклонением</Check></td>
          <td>
            <select v-show="needPS" class="form-select py-0" v-model="PSType">
              <option
                  v-for="(value) in CRITERIA_TYPES" :key="value" :value="value"
              >
                {{value}}
              </option>
            </select>
          </td>
          <td></td>
          <td></td>
          <td v-if="needPS">
            <NumberInput v-if="needPSPercent" v-model="PSPercent" tofixed="1" size="7"
                          :invalid="incorrectPSPercent"
            />
            <NumberOutput v-else :value="PSnom" tofixed="0"/>
          </td>
          <td v-show="needPS" v-html="needPSPercent ? '%' : 'Па'"></td>
        </tr>
      </tbody>
    </table>
    <Warning v-if="warningNoPressuresNeeded">
      К изделию вообще нет требований по давлению.
    </Warning>
    <Warning v-if="warningPressureStaticMoreThanFull">
      Статическое давление больше динамического.
    </Warning>
    <Warning v-if="warningNoStaticForCoolOrHeat">
      На предыдущих шагах было указано, что изделие охлаждает/нагревает воздух.
      В таком случае необходимо здесь указать статическое давление.
    </Warning>
  </div>
</template>

<script>
import {
  mapState, mapGetters, mapMutations,
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
    ...mapGetters('testing/nominals', [
      'getQnom', 'getQnomPerSecond', 'incorrectQnom',
      'getPVnom', 'incorrectPVnom', 'getNeedPVnom',
      'getPSnom', 'incorrectPSnom', 'getNeedPSnom',
      'warningPressureStaticMoreThanFull', 'warningNoPressuresNeeded', 'warningNoStaticForCoolOrHeat',
    ]),
    ...mapGetters('testing/criteria', [
      'CRITERIA_TYPES',
      'getNeedQ', 'getQType', 'getQPercent', 'incorrectQPercent', 'needQPercent',
      'getNeedPV', 'getPVType', 'getPVPercent', 'incorrectPVPercent', 'needPVPercent',
      'getNeedPS', 'getPSType', 'getPSPercent', 'incorrectPSPercent', 'needPSPercent',
    ]),
    stepFilledIncorrectly() {
      return (
        this.incorrectQnom || this.incorrectPVnom || this.incorrectPSnom
        || this.warningNoPressuresNeeded || this.warningPressureStaticMoreThanFull
        || this.incorrectQPercent || this.incorrectPVPercent || this.incorrectPSPercent
      );
    },
    ...mapState([]),
    Qnom: { get() { return this.getQnom; }, set(value) { this.setQnom(value); } },
    QnomPerSecond: {
      get() {
        return this.getQnomPerSecond;
      },
      set(value) {
        this.setQnomPerSecond(value);
      },
    },
    needQ: { get() { return this.getNeedQ; }, set(value) { this.setNeedQ(value); } },
    QType: { get() { return this.getQType; }, set(value) { this.setQType(value); } },
    QPercent: { get() { return this.getQPercent; }, set(value) { this.setQPercent(value); } },

    PVnom: { get() { return this.getPVnom; }, set(value) { this.setPVnom(value); } },
    needPVnom: { get() { return this.getNeedPVnom; }, set(value) { this.setNeedPVnom(value); } },
    needPV: { get() { return this.getNeedPV; }, set(value) { this.setNeedPV(value); } },
    PVType: { get() { return this.getPVType; }, set(value) { this.setPVType(value); } },
    PVPercent: { get() { return this.getPVPercent; }, set(value) { this.setPVPercent(value); } },

    PSnom: { get() { return this.getPSnom; }, set(value) { this.setPSnom(value); } },
    needPSnom: { get() { return this.getNeedPSnom; }, set(value) { this.setNeedPSnom(value); } },
    needPS: { get() { return this.getNeedPS; }, set(value) { this.setNeedPS(value); } },
    PSType: { get() { return this.getPSType; }, set(value) { this.setPSType(value); } },
    PSPercent: { get() { return this.getPSPercent; }, set(value) { this.setPSPercent(value); } },
  },
  methods: {
    ...mapMutations('testing/nominals', [
      'setQnom', 'setQnomPerSecond',
      'setPVnom', 'setNeedPVnom',
      'setPSnom', 'setNeedPSnom',
    ]),
    ...mapMutations('testing/criteria', [
      'setNeedQ', 'setQType', 'setQPercent',
      'setNeedPV', 'setPVType', 'setPVPercent',
      'setNeedPS', 'setPSType', 'setPSPercent',
    ]),
  },
  mounted() {
    this.$emit('stepFilledIncorrectly', this.stepFilledIncorrectly);
  },
};
</script>

<style scoped lang="scss">
</style>
