<template>
  <div>
    <div class="d-print-none">
      <p>Всё готово к измерениям.</p>
      <p>Распечатайте этот лист средствами браузера, например клавишами
        <kbd>Ctrl</kbd>&nbsp;+&nbsp;<kbd>P</kbd> (или <kbd>⌘</kbd>&nbsp;+&nbsp;<kbd>P</kbd> на Mac).
      </p>
      <p>
        При распечатке вся ненужная информация будет сокрыта,
        поэтому распечатка лучше, чем скриншот.
      </p>
      <p>
        При распечатке подберите масштаб и поля так,
        чтобы всё поместилось на один лист, но при этом заполнило его.
      </p>
      <p>
        Распечатанный лист будет черновиком. По возвращении Вы всё из него перепишите в программу.
      </p>
    </div>
    <hr class="d-print-none">
    <h6 class="text-center fw-bold">Задание на аэродинамические измерения</h6>
    <div class="d-flex flex-row">
      <div>Изделие&nbsp;</div>
      <div v-if="getName">{{getName}}</div>
      <HandField v-if="!getName" class="flex-fill"/>
    </div>
    <div class="d-flex flex-row flex-nowrap">
      <HandField v-if="!getName" class="flex-fill"/>
      <div v-if="!getName">&nbsp;</div>
      <div>Зав.&nbsp;№&nbsp;</div>
      <div v-if="getSerial">{{getSerial}}</div>
      <HandField v-if="!getSerial" width="9em"/>
    </div>
    <div>
      Внутренний диаметр воздуховода в мерном сечении D<sub>ив</sub> =
      <NumberOutput :value="getDiameter" tofixed="0"/>мм
    </div>
    <div class="d-flex flex-wrap">
      <div>Показания&nbsp;</div>
      <div>
        барометра p'<sub>б</sub> , мм.рт.ст.
        <HandField width="6em"/>,&nbsp;
      </div>
      <div>
        термометра t<sub>A</sub> , °C
        <HandField width="6em"/>
      </div>
    </div>
    <div v-if="getSpeedChange || getNeedNEngine">
      Запустить на частоту вращения колеса
      <NumberOutput :value="realF" tofixed="0"/>мин<sup>-1</sup>
    </div>
    <div v-else>
      Запустить на номинальную частоту вращения колеса.
    </div>
    <p>
      Регулируя заслонку, произвести измерения в трёх режимах.
      В рамках одного режима положение заслонки не менять.
      При этом рекомендуется регулировать заслонку так,
      чтобы в среднем измеряемое динамическое давление или скорость потока были:
      <ul>
        <li>
          в режиме №1: ∆p<sub>di</sub> в пределах от
          <NumberOutput :value="wantedStaticPressures[0][0]" tofixed="1"/>до
          <NumberOutput :value="wantedStaticPressures[0][1]" tofixed="1"/>Па
          или v<sub>m</sub> в пределах от
          <NumberOutput :value="wantedSpeeds[0][0]" tofixed="1"/>до
          <NumberOutput :value="wantedSpeeds[0][1]" tofixed="1"/>м/с;
        </li>
        <li>
          в режиме №2: ∆p<sub>di</sub> в пределах от
          <NumberOutput :value="wantedStaticPressures[1][0]" tofixed="1"/>до
          <NumberOutput :value="wantedStaticPressures[1][1]" tofixed="1"/>Па
          или v<sub>m</sub> в пределах от
          <NumberOutput :value="wantedSpeeds[1][0]" tofixed="1"/>до
          <NumberOutput :value="wantedSpeeds[1][1]" tofixed="1"/>м/с;
        </li>
        <li>
          в режиме №3: ∆p<sub>di</sub> в пределах от
          <NumberOutput :value="wantedStaticPressures[2][0]" tofixed="1"/>до
          <NumberOutput :value="wantedStaticPressures[2][1]" tofixed="1"/>Па
          или v<sub>m</sub> в пределах от
          <NumberOutput :value="wantedSpeeds[2][0]" tofixed="1"/>до
          <NumberOutput :value="wantedSpeeds[2][1]" tofixed="1"/>м/с.
        </li>
      </ul>
      Допускается нарушать очерёдность режимов.
    </p>
    <MeasurementTable v-model="getDeltaP" blank print/>
    <div class="d-flex flex-row flex-wrap justify-content-center">
      <DuctDwg :d="getDiameter" class="m-0 p-0"/>
      <PointsDwg :d="getDiameter" class="m-0 p-0"/>
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';

import HandField from '../components/HandField.vue';
import NumberOutput from '../components/NumberOutput.vue';
import DuctDwg from '../components/DuctDwg.vue';
import PointsDwg from '../components/PointsDwg.vue';
import MeasurementTable from '../components/MeasurementTable.vue';

export default {
  components: {
    HandField,
    NumberOutput,
    DuctDwg,
    PointsDwg,
    MeasurementTable,
  },
  emits: ['stepFilledIncorrectly'],
  watch: {
    stepFilledIncorrectly(newValue) {
      this.$emit('stepFilledIncorrectly', newValue);
    },
  },
  computed: {
    ...mapGetters('testing', [
      'getDeltaP',
    ]),
    ...mapGetters('testing/mode', [
      'getDiameter',
      'largeDuct',
      'wantedStaticPressures', 'wantedSpeeds',
      'getSpeedChange', 'getNeedNEngine',
      'realF',
    ]),
    ...mapGetters('testing/nominals', [
      'getName', 'getSerial',
    ]),
    stepFilledIncorrectly() {
      return (
        false
      );
    },
  },
  methods: {
    ...mapMutations('testing/mode', []),
    ...mapMutations('testing/nominals', []),
  },
  mounted() {
    this.$emit('stepFilledIncorrectly', this.stepFilledIncorrectly);
  },
};

</script>
