export const CRITERIA_TYPES = {
  SYMMETRIC: '±',
  POSITIVE: '+',
  AT_LEAST: 'не менее',
};

const DEFAULTS = {
  currentStepIndex: 0,
  testing: {
    nominals: {
      name: '',
      serial: '',
      place: '',

      Qnom: 0, // м3/ч
      needPVnom: true,
      PVnom: 0, // Па
      needPSnom: false,
      PSnom: 0, // Па

      doesCoolOrHeat: false, // Изделие меняет температуру перемещаемого воздуха
      Tnom: 20, // °C
      Tout: 20, // °C
      P0nom: 101325, // Па

      Nnom: 0, // кВт
      Fnom: 0, // об/мин

      squareOut: true, // Выходной патрубок прямоугольный, а не круглый
      sizeOutD: 0, // Диаметр выходного патрубка, мм
      sizeOutB: 0, // Ширина выходного патрубка, мм
      sizeOutH: 0, // Высота выходного патрубка, мм
    },
    criteria: {
      needQ: true,
      QType: CRITERIA_TYPES.SYMMETRIC,
      QPercent: 15, // %

      needPV: true,
      PVType: CRITERIA_TYPES.SYMMETRIC,
      PVPercent: 15, // %

      needPS: true,
      PSType: CRITERIA_TYPES.SYMMETRIC,
      PSPercent: 15, // %
    },
    mode: {
      psi: 20, // %. Расхождение графика по расходу (ширина характеристики максимальная)
      speedRange: { // м/с. Диапазон скоростей измерения
        min: 5,
        max: 25,
      },
      diameter: 800, // мм. Диаметр воздуховода
      maxPressure: 3000, // Па

      speedChange: false, // Будем ли мы замедлять/ускорять колесо при испытаниях
      F: 0, // об/мин. Испытательная частота оборотов

      maxN: 110, // кВт. Максимальная мощность на объекте

      needNEngine: false, // Будем ли мы использовать нештатный двигатель
      NEngine: 0, // кВт. Мощность испытательного двигателя
      FnomEngine: 0, // об/мин. Номинальная частота испытательного двигателя
    },
  },
};

export default DEFAULTS;
