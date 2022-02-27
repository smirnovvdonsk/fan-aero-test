<template>
  <table class="printed-table">
    <thead>
      <tr>
        <th rowspan="3">Точка<br />мерного<br />сечения</th>
        <th colspan="6">Результаты замеров, Па</th>
      </tr>
      <tr>
        <th colspan="2">Режим №1</th>
        <th colspan="2">Режим №2</th>
        <th colspan="2">Режим №3</th>
      </tr>
      <tr>
        <template v-for="(item,index) in Array(3)" :key="index">
          <th>∆p<sub>si</sub></th><th>∆p<sub>di</sub></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(undefined, rowIndex) in value.point1.deltaPsiArray"
        :key="rowIndex"
      >
        <td>{{ rowIndex + 1 }}</td>
        <template v-for="(pointIndex) in [1,2,3]" :key="pointIndex">
          <td v-for="(pressureType) in ['si','di']" :key="pressureType">
            <NumberOutput v-if="!blank && print"
              :value="value[`point${pointIndex}`][`deltaP${pressureType}Array`][rowIndex]"
              tofixed="1"
              :dashed="value[`point${pointIndex}`][`incorrectdeltaP${pressureType}Items`][rowIndex]"
            />
            <NumberInput v-if="!blank && !print" size="4"
              tofixed="1"
            :invalid="value[`point${pointIndex}`][`incorrectdeltaP${pressureType}Items`][rowIndex]"
              v-model="value[`point${pointIndex}`][`deltaP${pressureType}Array`][rowIndex]"
              v-on:update:modelValue="onChange"
              @blur="onChange"
            />
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import NumberOutput from './NumberOutput.vue';
import NumberInput from './NumberInput.vue';

export default {
  props: {
    modelValue: Object,
    blank: {
      type: Boolean,
      default: false,
    },
    print: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    onChange() {
      this.$emit('update:modelValue', this.value);
    },
  },
  components: { NumberOutput, NumberInput },
};
</script>

<style scoped lang="scss">
.printed-table {
  border: 2px solid black;
  width: 100%;
  text-align: center;
  th {
    font-weight: normal;
    border: 2px solid black;
  }
  td {
    border: 1px solid black;
    border-left: 2px solid black;
    border-right: 2px solid black;
    input {
      // border: none;
      text-align: center;
    }
  }
}
@media print {
  .printed-table{
    break-inside: avoid;
  }
}
</style>
