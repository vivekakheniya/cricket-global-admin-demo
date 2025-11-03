// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import { Grid, Typography } from "@mui/material";
// import MainCard from "ui-component/cards/MainCard";
// import { gridSpacing } from "store/constant";

// const DonutChart = ({ isData }) => {
//   // Sample data for the donut chart
//   const options = {
//     labels: ["Male", "Female"],
//     options: {
//       chart: {
//         width: 380,
//         type: "donut",
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: 400,
//             },
//             legend: {
//               show: false,
//             },
//           },
//         },
//       ],
//       legend: {
//         position: "right",
//         offsetY: 0,
//         height: 230,
//       },
//     },
//   };

//   return (
//     <MainCard>
//       <Grid container spacing={gridSpacing}>
//         <Grid item xs={12}>
//           <Grid container alignItems="center" justifyContent="space-between">
//             <Grid item>
//               <Grid container direction="column" spacing={1}>
//                 <Grid item>
//                   <Typography variant="subtitle">Male Vs Female</Typography>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//         <Grid item xs={12}>
//           <ReactApexChart options={options} series={isData} type="donut" />
//         </Grid>
//       </Grid>
//     </MainCard>
//   );
// };

// export default DonutChart;

import React from "react";
import ReactApexChart from "react-apexcharts";
import { Grid, Typography } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";

const DonutChart = ({ isData }) => {
  // Updated data for the teacher dashboard
  const options = {
    labels: ["Students", "Courses", "Lessons"],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
      },
    },
  };

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="subtitle">
                    Students vs Courses vs Lessons
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ReactApexChart options={options} series={isData} type="donut" />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DonutChart;
