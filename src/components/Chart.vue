<template>
  <div>
    <div :id="graphid" v-if="chart" class="text-center m-2"></div>
    <div>
      <p>
        <span>
          На диаграмме сплошная кривая показывает полное давление,
          пунктирная - статическое давление.
        </span>
      </p>
      <p>
        <span v-if="chart.nominals.Pv">
          Сплошная чёрная круглая точка - это номинальная рабочая точка по полному давлению.
        </span>
        <span v-if="chart.nominals.Ps">
          Пустая чёрная круглая точка - это номинальная рабочая точка по статическому давлению.
        </span>
      </p>
      <p>
        Прямоугольник из сплошной линии
        - это критерии оценки изделия по производительности и полному давлению.
        Прямоугольник из пунктирной линии
        - по производительности и статическому давлению.
        В зависимости от заданных критериев оценки, эти два прямоугольника могут совпадать.
      </p>
      <p>
        Изделие считается прошедшим проверку, если выполнено оба условия:
        <ul>
          <li>
            сплошная кривая находится внутри сплошного прямоугольника
            и/или пересекает его границу;
          </li>
          <li>
            пунктирная кривая находится внутри пунктирного прямоугольника
            и/или пересекает его границу.
          </li>
        </ul>
      </p>
    </div>
  </div>
</template>

<script>
import * as vega from 'vega';
import Polynome from '@smirnovvdonsk/polynome';

export default {
  data() {
    return {
      vegaView: {},
    };
  },
  props: {
    chart: Object,
    graphid: {
      // идентификатор объекта DOM, где будет построен график Vega
      type: String,
      default: 'fan-aero-test-vega-chart',
    },
  },
  mounted() {
    window.onresize = this.refresh;
    // window.onbeforeprint = this.refresh;
    this.refresh();
  },
  updated() {
    this.refresh();
  },
  beforeUnmount() {
    this.vegaFinalize();
  },
  methods: {
    refresh() {
      if (this.chart) {
        this.vegaRender(this.VegaSpec);
        this.$el.parentElement.oncontextmenu = this.saveSVG;
      }
    },
    saveSVG(event) {
      event.preventDefault();
      const blob = new Blob(
        [event.currentTarget.querySelector('svg').outerHTML],
        { type: 'image/svg+xml' },
      );
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'testing-chart.svg';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    vegaRender(spec) {
      // let vueComponent = this;
      this.vegaView = new vega.View(vega.parse(spec), {
        renderer: 'svg', // renderer (canvas or svg)
        container: `#${this.graphid}`, // parent DOM container
        hover: true, // enable hover processing
      });
      return this.vegaView.runAsync();
    },
    vegaFinalize() {
      this.vegaView.finalize();
    },
  },
  computed: {
    QMinMax() {
      const arr = [
        ...this.chart.Q,
        ...(this.chart.criteria.Q || []),
        this.chart.nominals.Q,
      ]
        .filter(Number.isFinite);
      return [Math.min(...arr), Math.max(...arr)];
    },
    PMinMax() {
      const arr = [
        ...this.chart.Pv,
        ...(this.chart.criteria.Pv || []),
        this.chart.nominals.Pv,
        ...this.chart.Ps,
        ...(this.chart.criteria.Ps || []),
        this.chart.nominals.Ps,
      ]
        .filter(Number.isFinite);
      return [Math.min(...arr), Math.max(...arr)];
    },
    QRescaleMatrix() {
      return [
        { limit: 0, factor: 1, suffix: '' },
        { limit: 1000, factor: 1000, suffix: '× 1 000' },
        { limit: 1000000, factor: 1000000, suffix: '× 1 000 000' },
      ];
    },
    QRescale() {
      const matrix = this.QRescaleMatrix;
      const max = this.QMinMax[1];
      return matrix[matrix.map((x) => max >= x.limit).lastIndexOf(true)];
    },
    scaleTemplate() {
      return {
        type: 'linear',
        zero: false,
        nice: true,
      };
    },
    scaleFlow() {
      return {
        name: 'Flow',
        range: 'width',
        domain: this.QMinMax.map((Q) => Q / this.QRescale.factor),
        ...this.scaleTemplate,
      };
    },
    scalePres() {
      return {
        name: 'Pres',
        range: 'height',
        domain: this.PMinMax,
        ...this.scaleTemplate,
      };
    },
    axeFlow() {
      return {
        name: 'Flow',
        orient: 'bottom',
        title: `Q, ${this.QRescale.suffix} м³/ч`,
        scale: 'Flow',
        format: '.5',
        grid: true,
      };
    },
    axePres() {
      return {
        name: 'Pres',
        orient: 'left',
        title: 'p, Па',
        scale: 'Pres',
        format: 'd',
        grid: true,
      };
    },
    lineFullPres() {
      return {
        name: 'FullPres',
        type: 'line',
        from: {
          data: 'Natural',
        },
        encode: {
          enter: {
            x: {
              scale: 'Flow',
              field: 'Flow',
            },
            y: {
              scale: 'Pres',
              field: 'FullPres',
            },
            stroke: {
              value: 'black',
            },
            interpolate: {
              value: 'cardinal',
            },
            strokeWidth: {
              value: 2,
            },
          },
        },
      };
    },
    lineStatPres() {
      return {
        name: 'StatPres',
        type: 'line',
        from: {
          data: 'Natural',
        },
        encode: {
          enter: {
            x: {
              scale: 'Flow',
              field: 'Flow',
            },
            y: {
              scale: 'Pres',
              field: 'StatPres',
            },
            stroke: {
              value: 'black',
            },
            interpolate: {
              value: 'cardinal',
            },
            strokeWidth: {
              value: 2,
            },
            strokeDash: {
              value: [3, 3],
            },
          },
        },
      };
    },
    pinFullPres() {
      const { Pv } = this.chart.nominals;
      let result;
      if (Pv) {
        result = {
          name: 'PinFullPres',
          type: 'symbol',
          encode: {
            enter: {
              shape: { value: 'circle' },
              size: { value: '100' },
              opacity: {
                value: 1,
              },
              strokeOpacity: {
                value: 0,
              },
              strokeWidth: {
                value: 0,
              },
              stroke: {
                value: 'white',
              },
              fill: {
                value: 'black',
              },
              y: {
                scale: 'Pres',
                value: Pv,
              },
              x: {
                scale: 'Flow',
                value: this.chart.nominals.Q / this.QRescale.factor,
              },
            },
          },
        };
      }
      return result;
    },
    pinStatPres() {
      const { Ps } = this.chart.nominals;
      let result;
      if (Ps) {
        result = {
          name: 'PinStatPres',
          type: 'symbol',
          encode: {
            enter: {
              shape: { value: 'circle' },
              size: { value: '100' },
              fillOpacity: {
                value: 1,
              },
              strokeOpacity: {
                value: 1,
              },
              strokeWidth: {
                value: 1,
              },
              stroke: {
                value: 'black',
              },
              strokeDash: {
                value: [2, 1],
              },
              fill: {
                value: 'white',
              },
              y: {
                scale: 'Pres',
                value: Ps,
              },
              x: {
                scale: 'Flow',
                value: this.chart.nominals.Q / this.QRescale.factor,
              },
            },
          },
        };
      }
      return result;
    },
    rectFullPres() {
      const { criteria } = this.chart;
      const Q = criteria.Q
        ? criteria.Q.map((x, i) => (Number.isFinite(x) ? x : this.QMinMax[i]))
        : this.QMinMax;
      const Pv = criteria.Pv
        ? criteria.Pv.map((x, i) => (Number.isFinite(x) ? x : this.PMinMax[i]))
        : this.PMinMax;
      let result;
      if (Pv) {
        result = {
          name: 'RectFullPres',
          type: 'rect',
          encode: {
            enter: {
              fillOpacity: {
                value: 0,
              },
              strokeOpacity: {
                value: 0.5,
              },
              strokeWidth: {
                value: 2,
              },
              stroke: {
                value: 'black',
              },
              fill: {
                value: 'black',
              },
              x: {
                scale: 'Flow',
                value: Q[0] / this.QRescale.factor,
              },
              y: {
                scale: 'Pres',
                value: Pv[0],
              },
              x2: {
                scale: 'Flow',
                value: Q[1] / this.QRescale.factor,
              },
              y2: {
                scale: 'Pres',
                value: Pv[1],
              },
            },
          },
        };
      }
      return result;
    },
    rectStatPres() {
      const { criteria } = this.chart;
      const Q = criteria.Q
        ? criteria.Q.map((x, i) => (Number.isFinite(x) ? x : this.QMinMax[i]))
        : this.QMinMax;
      const Ps = criteria.Ps
        ? criteria.Ps.map((x, i) => (Number.isFinite(x) ? x : this.PMinMax[i]))
        : this.PMinMax;
      let result;
      if (Ps) {
        result = {
          name: 'RectStatPres',
          type: 'rect',
          encode: {
            enter: {
              fillOpacity: {
                value: 0,
              },
              strokeOpacity: {
                value: 0.5,
              },
              strokeWidth: {
                value: 2,
              },
              stroke: {
                value: 'black',
              },
              strokeDash: {
                value: [6, 4],
              },
              fill: {
                value: 'black',
              },
              x: {
                scale: 'Flow',
                value: Q[0] / this.QRescale.factor,
              },
              y: {
                scale: 'Pres',
                value: Ps[0],
              },
              x2: {
                scale: 'Flow',
                value: Q[1] / this.QRescale.factor,
              },
              y2: {
                scale: 'Pres',
                value: Ps[1],
              },
            },
          },
        };
      }
      return result;
    },
    curves() {
      const pointsQuantity = 32;
      const { Q, Pv, Ps } = this.chart;
      const PvPolynome = Polynome.lagrangeInterpolate(Q.map((x, i) => ({ x, y: Pv[i] })));
      const PsPolynome = Polynome.lagrangeInterpolate(Q.map((x, i) => ({ x, y: Ps[i] })));
      const QArray = Array(pointsQuantity)
        .fill(Q[0]).map((x, i) => x + i * ((Q[Q.length - 1] - x) / (pointsQuantity - 1)));
      const PvArray = PvPolynome.evals(QArray);
      const PsArray = PsPolynome.evals(QArray);
      return QArray.map((x, i) => ({
        Flow: x / this.QRescale.factor,
        FullPres: PvArray[i],
        StatPres: PsArray[i],
      }));
    },
    VegaSpec() {
      return {
        version: 5,
        // width: -200 + this.$el.parentElement.clientWidth,
        width: 600,
        // width: -200 + document.body.offsetWidth,
        height: 400,
        // padding: 'auto',
        padding: 0,
        legends: [],
        scales: [this.scaleFlow, this.scalePres],
        axes: [this.axeFlow, this.axePres],
        data: [
          {
            name: 'Natural',
            values: this.curves,
            /* values: this.chart.Q.map((Q, i) => ({
              Flow: Q / this.QRescale.factor,
              FullPres: this.chart.Pv[i],
              StatPres: this.chart.Ps[i],
            })), */
          },
        ],
        marks: [
          this.lineFullPres,
          this.lineStatPres,
          this.pinFullPres,
          this.pinStatPres,
          this.rectFullPres,
          this.rectStatPres,
        ].filter((mark) => mark),
      };
    },
  },
};
</script>
