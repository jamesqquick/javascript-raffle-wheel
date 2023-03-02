//Original article - https://codingartistweb.com/2022/08/spin-wheel-app-with-javascript/

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const finalValue = document.getElementById('final-value');
const namesInput = document.getElementById('namesInput');
let myChart;

namesInput.addEventListener('input', () => {
  renderChart(getNamesFromString(namesInput.value));
});

const backgroundColors = ['#3b82f6', '#2563eb'];

const renderChart = (names) => {
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
      labels: names,
      datasets: [
        {
          backgroundColor: backgroundColors,
          data: Array(names.length).fill(1),
        },
      ],
    },
    options: {
      animation: { duration: 0 },
      plugins: {
        //hide tooltip and legend
        tooltip: false,
        legend: {
          display: false,
        },
        //display labels inside pie chart
        datalabels: {
          color: '#dbeafe',
          formatter: (_, context) =>
            context.chart.data.labels[context.dataIndex],
          font: { size: 24 - names.length * 0.5 },
        },
      },
    },
  });
  myChart.options.rotation = 0;
  myChart.update();
};

const displayWinner = (angle, labels) => {
  const choiceAngleLength = 360 / labels.length;
  const inversedAngle = 360 - angle;
  const winnerIndex = Math.floor(inversedAngle / choiceAngleLength);
  const winnerName = labels[winnerIndex];
  finalValue.innerText = `Winner: ${winnerName}`;
  spinBtn.disabled = false;
  namesInput.disabled = false;
};

spinBtn.addEventListener('click', () => {
  spinBtn.disabled = true;
  namesInput.disabled = true;
  finalValue.innerHTML = `<p>Spinning...</p>`;
  const finalDegree = Math.floor(Math.random() * 360);

  let rotationAngle = 101;
  let numRotations = 0;
  const MAX_ROTATIONS = 15;

  myChart.options.rotation = 0;
  myChart.update();

  const rotationInterval = setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + rotationAngle;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      numRotations += 1;
      rotationAngle -= 5;
      myChart.options.rotation = 0;
    } else if (
      numRotations > MAX_ROTATIONS &&
      myChart.options.rotation == finalDegree
    ) {
      displayWinner(finalDegree, myChart.data.labels);
      clearInterval(rotationInterval);
      numRotations = 0;
      rotationAngle = 101;
    }
  }, 10);
});

const getNamesFromString = (str) => {
  const rawNames = namesInput.value;
  return rawNames.split('\n').filter((name) => !!name);
};

renderChart(getNamesFromString(namesInput.value));
