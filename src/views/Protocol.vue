<template>
  <div>
    <div class="d-print-none">
      <p>Готов протокол испытаний.</p>
      <p>Распечатайте этот протокол средствами браузера, например клавишами
        <kbd>Ctrl</kbd>&nbsp;+&nbsp;<kbd>P</kbd> (или <kbd>⌘</kbd>&nbsp;+&nbsp;<kbd>P</kbd> на Mac).
      </p>
      <p>
        При распечатке вся ненужная информация будет сокрыта.
      </p>
      <p>
        При распечатке подберите масштаб и поля.
      </p>
      <p>
        Распечатанный протокол можно подписать и использовать как официальный документ.
      </p>
      <p>
        Распечатанный протокол не утверждает, было ли испытание успешным или нет.
        Руководствуйтесь критериями оценки, описанными в протоколе.
      </p>
    </div>
    <hr class="d-print-none">
    <h6 class="text-center fw-bold">ПРОТОКОЛ</h6>
    <h6 class="text-center fw-bold">проверки аэродинамических параметров изделия</h6>
    <h6 class="text-center fw-bold">№<HandField width="20em"/></h6>
    <div class="d-flex flex-row">
      <div>Испытанное изделие&nbsp;</div>
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
    <div class="d-flex flex-row">
      <div>Место&nbsp;проведения&nbsp;испытаний&nbsp;</div>
      <div v-if="getPlace">{{getPlace}}</div>
      <HandField v-if="!getPlace" class="flex-fill"/>
    </div>
    <div class="d-flex flex-row">
      <div>Время&nbsp;проведения&nbsp;испытаний&nbsp;с</div>
      <HandField class="flex-fill"/>
      <div>по</div>
      <HandField class="flex-fill"/>
    </div>
    <div class="d-flex flex-column flex-nowrap">
      <div>Требуемые или номинальные параметры изделия:</div>
      <table class="printed-table">
        <thead>
          <th colspan="2">Наименование параметра</th>
          <th>Обозначение</th>
          <th>Единица измерения</th>
          <th>Значение</th>
        </thead>
        <tbody>
          <tr>
            <td colspan="2">Производительность (требуемая или номинальная)</td>
            <td class="text-center">Q<sub>ном</sub></td>
            <td class="text-center">м<sup>3</sup>/ч</td>
            <td class="text-center">
              <NumberOutput :value="getQnom" tofixed="0"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Полное давление (требуемое или номинальное)</td>
            <td class="text-center">p<sub>Vном</sub></td>
            <td class="text-center">Па</td>
            <td class="text-center">
              <NumberOutput :value="getPVnom" tofixed="0" :dashed="!getNeedPVnom"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Статическое давление (требуемое или номинальное)</td>
            <td class="text-center">p<sub>Sном</sub></td>
            <td class="text-center">Па</td>
            <td class="text-center">
              <NumberOutput :value="getPSnom" tofixed="0" :dashed="!getNeedPSnom"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Частота вращения рабочего колеса (номинальная)</td>
            <td class="text-center">f<sub>ном</sub></td>
            <td class="text-center">мин<sup>-1</sup></td>
            <td class="text-center">
              <NumberOutput :value="getFnom" tofixed="0"
                            :dashed="!(getSpeedChange || getNeedNEngine)"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Частота вращения рабочего колеса при испытаниях</td>
            <td class="text-center">f<sub>исп</sub></td>
            <td class="text-center">мин<sup>-1</sup></td>
            <td class="text-center">
              <NumberOutput :value="realF" tofixed="0"
                            :dashed="!(getSpeedChange || getNeedNEngine)"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Мощность (номинальная)</td>
            <td class="text-center">N<sub>ном</sub></td>
            <td class="text-center">кВт</td>
            <td class="text-center">
              <NumberOutput :value="getNnom" tofixed="2"
                            :dashed="!(getSpeedChange || getNeedNEngine)"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Температура перемещаемого воздуха (требуемая или номинальная)</td>
            <td class="text-center">t<sub>ном</sub></td>
            <td class="text-center">°C</td>
            <td class="text-center">
              <NumberOutput :value="getTnom" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              Температура воздуха на выходе из изделия (требуемая или номинальная)
            </td>
            <td class="text-center">t<sub>вых</sub></td>
            <td class="text-center">°C</td>
            <td class="text-center">
              <NumberOutput :value="getTout" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td colspan="2">Атмосферное давление (номинальное)</td>
            <td class="text-center">p<sub>0ном</sub></td>
            <td class="text-center">Па</td>
            <td class="text-center">
              <NumberOutput :value="getP0nom" tofixed="0"/>
            </td>
          </tr>
          <tr>
            <td rowspan="3">Размеры выходного патрубка</td>
            <td class="text-center">ширина</td>
            <td class="text-center">B</td>
            <td class="text-center">мм</td>
            <td class="text-center">
              <NumberOutput :value="getSizeOutB" tofixed="0"
                            :dashed="!getSquareOut"/>
            </td>
          </tr>
          <tr>
            <td class="text-center">высота</td>
            <td class="text-center">H</td>
            <td class="text-center">мм</td>
            <td class="text-center">
              <NumberOutput :value="getSizeOutH" tofixed="0"
                            :dashed="!getSquareOut"/>
            </td>
          </tr>
          <tr>
            <td class="text-center">диаметр</td>
            <td class="text-center">D</td>
            <td class="text-center">мм</td>
            <td class="text-center">
              <NumberOutput :value="getSizeOutD" tofixed="0"
                            :dashed="getSquareOut"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      Внутренний диаметр воздуховода в мерном сечении D<sub>ив</sub> =
      <NumberOutput :value="getDiameter" tofixed="0"/>мм.
    </div>
    <div class="d-flex flex-wrap">
      <div>Показания&nbsp;</div>
      <div>
        барометра p'<sub>б</sub> =
        <NumberOutput :value="getBarometer" tofixed="1"/>мм.рт.ст.,&nbsp;
      </div>
      <div>
        термометра t<sub>A</sub> =
        <NumberOutput :value="getThermometer" tofixed="1"/>°C.
      </div>
    </div>
    <div>
      Атмосферное давление p'<sub>0</sub> =
      <NumberOutput :value="getBarometerPascal" tofixed="0"/>Па.
    </div>
    <div class="d-flex flex-column flex-nowrap">
      <div>Показания дифференциальных манометров:</div>
      <MeasurementTable v-model="getDeltaP" print/>
    </div>
    <div class="d-flex flex-column flex-nowrap">
      <div>Расположение точек мерного сечения со стороны входа воздуха:</div>
      <div class="text-center m-0 p-0"><PointsDwg :d="getDiameter"/></div>
    </div>
    <div class="d-flex flex-column flex-nowrap">
      <div>Результаты промежуточных вычислений при испытаниях:</div>
      <table class="printed-table">
        <thead>
          <tr>
            <th rowspan="2">Параметр</th>
            <th colspan="3">Значение</th>
          </tr>
          <tr>
            <th>Режим №1</th>
            <th>Режим №2</th>
            <th>Режим №3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Динамическое давление в мерном сечении p<sub>d</sub>, Па</td>
            <td class="text-center" v-for="(Pd, i) in PdArray" :key="i">
              <NumberOutput :value="Pd" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Статическое давление в мерном сечении p<sub>s</sub>, Па</td>
            <td class="text-center" v-for="(Ps, i) in PsArray" :key="i">
              <NumberOutput :value="Ps" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Полное давление в мерном сечении p<sub>t1</sub>, Па</td>
            <td class="text-center" v-for="(Pt1, i) in Pt1Array" :key="i">
              <NumberOutput :value="Pt1" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Плотность среды в мерном сечении ρ<sub>m</sub>, кг/м<sup>3</sup></td>
            <td class="text-center" v-for="(density, i) in densityArray" :key="i">
              <NumberOutput :value="density" tofixed="3"/>
            </td>
          </tr>
          <tr>
            <td>
              Средняя скорость движения воздуха в мерном сечении v<sub>m</sub>, м/с
            </td>
            <td class="text-center" v-for="(Vm, i) in VmArray" :key="i">
              <NumberOutput :value="Vm" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>
              Средняя скорость воздуха в выходном сечении изделия v<sub>вых</sub>, м/с
            </td>
            <td class="text-center" v-for="(Vout, i) in VoutArray" :key="i">
              <NumberOutput :value="Vout" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Динамическое давление на выходе из изделия p'<sub>dv</sub>, Па</td>
            <td class="text-center" v-for="(PdOut, i) in PdOutArray" :key="i">
              <NumberOutput :value="PdOut" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Полное давление в выходном сечении изделия p<sub>t2</sub>, Па</td>
            <td class="text-center" v-for="(PtOut, i) in PtOutArray" :key="i">
              <NumberOutput :value="PtOut" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Полное давление изделия p'<sub>v</sub>, Па</td>
            <td class="text-center" v-for="(PvAcute, i) in PvAcuteArray" :key="i">
              <NumberOutput :value="PvAcute" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>
              Плотность воздуха на выходе из изделия в номинальном режиме
              ρ<sub>вых</sub>, кг/м<sup>3</sup>
            </td>
            <td class="text-center" v-for="(densityOut, i) in densityOutArray" :key="i">
              <NumberOutput :value="densityOut" tofixed="3"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex flex-column flex-nowrap">
      <div>Аэродинамическая характеристика изделия в номинальном режиме:</div>
      <table class="printed-table">
        <thead>
          <tr>
            <th rowspan="2">Параметр</th>
            <th colspan="3">Значение</th>
          </tr>
          <tr>
            <th>Режим №1</th>
            <th>Режим №2</th>
            <th>Режим №3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Производительность Q, м<sup>3</sup>/ч</td>
            <td class="text-center" v-for="(Q, i) in QArray" :key="i">
              <NumberOutput :value="Q" tofixed="0"/>
            </td>
          </tr>
          <tr>
            <td>Полное давление p<sub>v</sub>, Па</td>
            <td class="text-center" v-for="(Pv, i) in PvArray" :key="i">
              <NumberOutput :value="Pv" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Динамическое давление p<sub>dv</sub>, Па</td>
            <td class="text-center" v-for="(Pdv, i) in PdvArray" :key="i">
              <NumberOutput :value="Pdv" tofixed="1"/>
            </td>
          </tr>
          <tr>
            <td>Статическое давление p<sub>sv</sub>, Па</td>
            <td class="text-center" v-for="(Psv, i) in PsvArray" :key="i">
              <NumberOutput :value="Psv" tofixed="1"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Chart :chart="chart"/>
    <div class="d-flex flex-column flex-nowrap">
      <h6 class="text-center fw-bold">ЗАКЛЮЧЕНИЕ</h6>
      <div>
        По результатам испытаний изделия определено,
        что на полученной аэродинамической характеристике изделия существует
        по крайней мере одна точка, в которой:
        <ul>
          <li v-if="getNeedQ">
            производительность
            {{needQPercent?'отличается от номинальной':'не менее номинальной'}}
            <NumberOutput :value="getQnom" tofixed="0"/>м<sup>3</sup>/ч
            {{needQPercent?'не более, чем на':''}}
            <NumberOutput v-if="needQPercent" :value="getQPercent" tofixed="1">%</NumberOutput>
            {{(getQType==='+')?'в бо́льшую сторону':''}}
          </li>
          <li v-if="getNeedPV">
            полное давление
            {{needPVPercent?'отличается от номинального':'не менее номинального'}}
            <NumberOutput :value="getPVnom" tofixed="1"/>Па
            {{needPVPercent?'не более, чем на':''}}
            <NumberOutput v-if="needPVPercent" :value="getPVPercent" tofixed="1">%</NumberOutput>
            {{(getPVType==='+')?'в бо́льшую сторону':''}}
          </li>
          <li v-if="getNeedPS">
            статическое давление
            {{needPSPercent?'отличается от номинального':'не менее номинального'}}
            <NumberOutput :value="getPSnom" tofixed="1"/>Па
            {{needPSPercent?'не более, чем на':''}}
            <NumberOutput v-if="needPSPercent" :value="getPSPercent" tofixed="1">%</NumberOutput>
            {{(getPSType==='+')?'в бо́льшую сторону':''}}
          </li>
        </ul>
      </div>
      <div class="d-flex flex-row">
        <div>Испытанное изделие&nbsp;</div>
        <div v-if="getName">{{getName}}</div>
        <HandField v-if="!getName" class="flex-fill"/>
      </div>
      <div class="d-flex flex-row flex-nowrap">
        <HandField v-if="!getName" class="flex-fill"/>
        <div v-if="!getName">&nbsp;</div>
        <div>зав.&nbsp;№&nbsp;</div>
        <div v-if="getSerial">{{getSerial}}</div>
        <HandField v-if="!getSerial" width="9em"/>
      </div>
      <div>
        соответствует требованиям задания и годно для использования по назначению (эксплуатации).
      </div>
      <div class="d-flex flex-row flex-nowrap">
        <HandField class="flex-fill mx-3">(Ф. И. О., должность)</HandField>
        <HandField width="20em" class="mx-3">Подпись</HandField>
        «<HandField width="4em">&nbsp;</HandField>»
        <HandField width="15em">&nbsp;</HandField>
        20
        <HandField width="4em">&nbsp;</HandField>
        г.
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations,
} from 'vuex';

import HandField from '../components/HandField.vue';
import NumberOutput from '../components/NumberOutput.vue';
import PointsDwg from '../components/PointsDwg.vue';
import MeasurementTable from '../components/MeasurementTable.vue';
import Chart from '../components/Chart.vue';

export default {
  components: {
    HandField,
    NumberOutput,
    PointsDwg,
    MeasurementTable,
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
      'getDeltaP', 'getBarometer', 'getBarometerPascal', 'getThermometer',
      'PdArray', 'PsArray', 'Pt1Array', 'densityArray', 'VmArray', 'VoutArray',
      'PdOutArray', 'PtOutArray', 'PvAcuteArray', 'densityOutArray',
      'QArray', 'PvArray', 'PdvArray', 'PsvArray',
      'chart',
    ]),
    ...mapGetters('testing/mode', [
      'getDiameter',
      'largeDuct',
      'wantedStaticPressures', 'wantedSpeeds',
      'getSpeedChange', 'getNeedNEngine',
      'realF',
    ]),
    ...mapGetters('testing/nominals', [
      'getName', 'getSerial', 'getPlace',
      'getQnom',
      'getPVnom', 'getNeedPVnom',
      'getPSnom', 'getNeedPSnom',
      'getFnom', 'getNnom',
      'doesCoolOrHeat', 'getTnom', 'getTout',
      'getP0nom',
      'getSquareOut', 'getSizeOutD', 'getSizeOutB', 'getSizeOutH',
    ]),
    ...mapGetters('testing/criteria', [
      'getQType', 'getQPercent', 'needQPercent', 'getNeedQ',
      'getPVType', 'getPVPercent', 'needPVPercent', 'getNeedPV',
      'getPSType', 'getPSPercent', 'needPSPercent', 'getNeedPS',
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
