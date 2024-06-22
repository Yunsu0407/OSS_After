//import {styled} from "styled-components";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// const Main = styled.div`
//   display: flex;
//   align-items: center;
//   width: 50%;
// `;

export default function DoughnutChart({ correct, incorrect }) {
  const Data = {
    labels: ["미제출", "제출완료"],
    datasets: [
      {
        data: [incorrect, correct],
        backgroundColor: ["#FF8878", "skyblue"], //"c5f2ba"],
        borderColor: ["#FF8878", "skyblue"], //"c5f2ba"],
      },
    ],
  };

  const Options = {};

  return (
      <Doughnut data={Data} options={Options}></Doughnut>
  );
}