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
              @blur="onBlur"
              @keydown="onKeyDown(pointIndex, pressureType, rowIndex, $event)"
              @keyup="onKeyUp"
              @keydown.down.prevent="moveUpDown(`${pointIndex}:${pressureType}`, rowIndex, 'down')"
              @keydown.up.prevent="moveUpDown(`${pointIndex}:${pressureType}`, rowIndex, 'up')"
              :ref="`${pointIndex}:${pressureType}`"
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
  data() {
    return {
      keysPressed: new Set(),
    };
  },
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
    onBlur() {
      this.keysPressed.clear();
      this.onChange();
    },
    onChange() {
      this.$emit('update:modelValue', this.value);
    },
    onKeyDown(pointIndex, pressureType, rowIndex, event) {
      this.keysPressed.add(event.code);
      const KEYS_TO_FILL = ['ControlLeft', 'ShiftLeft', 'KeyF'];
      if (
        KEYS_TO_FILL.every((code) => this.keysPressed.has(code))
      ) {
        const newValue = this.value[`point${pointIndex}`][`deltaP${pressureType}Array`][rowIndex];
        this.value[`point${pointIndex}`][`deltaP${pressureType}Array`].fill(newValue);
        this.onChange();
      }
    },
    onKeyUp(event) {
      this.keysPressed.delete(event.code);
    },
    moveUpDown(colRef, rowIndex, action) {
      const arr = this.$refs[colRef];
      let newIndex;
      if (action === 'up') {
        newIndex = rowIndex - 1;
      }
      if (action === 'down') {
        newIndex = rowIndex + 1;
      }
      const weCan = (newIndex + 1 <= arr.length && newIndex >= 0 && newIndex !== undefined);
      if (weCan) {
        const elem = arr[newIndex].$el;
        elem.focus();
        elem.select();
      }
    },
  },
  components: { NumberOutput, NumberInput },
};
</script>

<style scoped lang="scss">
.printed-table {
  text-align: center;
  td {
    input {
      // border: none;
      text-align: center;
    }
  }
}
</style>
