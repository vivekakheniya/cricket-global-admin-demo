// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// // material-ui
// import { useTheme } from "@mui/material/styles";
// import { Grid, Typography } from "@mui/material";

// // third-party
// import ApexCharts from "apexcharts";
// import Chart from "react-apexcharts";

// // project imports
// import SkeletonTotalGrowthBarChart from "ui-component/cards/Skeleton/TotalGrowthBarChart";
// import MainCard from "ui-component/cards/MainCard";
// import { gridSpacing } from "store/constant";

// // chart data

// // ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

// const TotalGrowthBarChart = ({ isLoading, isData }) => {
//   const theme = useTheme();
//   const customization = useSelector((state) => state.customization);
//   const [data, setData] = useState([]);

//   const { navType } = customization;
//   const { primary } = theme.palette.text;
//   const darkLight = theme.palette.dark.light;
//   const grey200 = theme.palette.grey[200];
//   const grey500 = theme.palette.grey[500];

//   const primary200 = theme.palette.primary[200];
//   const primaryDark = theme.palette.primary.dark;
//   const secondaryMain = theme.palette.secondary.main;
//   const secondaryLight = theme.palette.secondary.light;
//   const chartData = {
//     height: 480,
//     type: "bar",
//     options: {
//       chart: {
//         id: "bar-chart",
//         stacked: true,
//         toolbar: {
//           show: true,
//         },
//         zoom: {
//           enabled: true,
//         },
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             legend: {
//               position: "bottom",
//               offsetX: -10,
//               offsetY: 0,
//             },
//           },
//         },
//       ],
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "50%",
//         },
//       },
//       xaxis: {
//         type: "category",
//         categories: ["BJP", "Congress", "BSP", "RLP", "IND", "Other"],
//       },
//       legend: {
//         show: true,
//         fontSize: "14px",
//         fontFamily: `'Roboto', sans-serif`,
//         position: "bottom",
//         offsetX: 20,
//         labels: {
//           useSeriesColors: false,
//         },
//         markers: {
//           width: 16,
//           height: 16,
//           radius: 5,
//         },
//         itemMargin: {
//           horizontal: 15,
//           vertical: 8,
//         },
//       },
//       fill: {
//         type: "solid",
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       grid: {
//         show: true,
//       },
//     },
//     series: data,
//   };
//   useEffect(() => {
//     const newChartData = {
//       ...chartData.options,
//       colors: [primary200, primaryDark, secondaryMain, secondaryLight],
//       xaxis: {
//         labels: {
//           style: {
//             colors: [
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//               primary,
//             ],
//           },
//         },
//       },
//       yaxis: {
//         labels: {
//           style: {
//             colors: [primary],
//           },
//         },
//       },
//       grid: {
//         borderColor: grey200,
//       },
//       tooltip: {
//         theme: "light",
//       },
//       legend: {
//         labels: {
//           colors: grey500,
//         },
//       },
//     };

//     // do not load chart when loading
//     if (!isLoading) {
//       setData([
//         {
//           name: "Male",
//           data: [
//             isData.BJP.Male ? isData.BJP.Male : 0,
//             isData.Congress.Male ? isData.Congress.Male : 0,
//             isData.BSP.Male ? isData.BSP.Male : 0,
//             isData.RPL.Male ? isData.RPL.Male : 0,
//             isData.IND.Male ? isData.IND.Male : 0,
//             isData.Other.Male ? isData.Other.Male : 0,
//           ],
//         },
//         {
//           name: "Female",
//           data: [
//             isData.BJP.Female ? isData.BJP.Female : 0,
//             isData.Congress.Female ? isData.Congress.Female : 0,
//             isData.BSP.Female ? isData.BSP.Female : 0,
//             isData.RPL.Female ? isData.RPL.Female : 0,
//             isData.IND.Female ? isData.IND.Female : 0,
//             isData.Other.Female ? isData.Other.Female : 0,
//           ],
//         },
//         {
//           name: "Other",
//           data: [
//             isData.BJP.Other ? isData.BJP.Other : 0,
//             isData.Congress.Other ? isData.Congress.Other : 0,
//             isData.BSP.Other ? isData.BSP.Other : 0,
//             isData.RPL.Other ? isData.RPL.Other : 0,
//             isData.IND.Other ? isData.IND.Other : 0,
//             isData.Other.Other ? isData.Other.Other : 0,
//           ],
//         },
//       ]);
//       ApexCharts.exec(`bar-chart`, "updateOptions", newChartData);
//     }
//   }, [
//     navType,
//     primary200,
//     primaryDark,
//     secondaryMain,
//     secondaryLight,
//     primary,
//     darkLight,
//     grey200,
//     isLoading,
//     grey500,
//   ]);

//   return (
//     <>
//       {isLoading ? (
//         <SkeletonTotalGrowthBarChart />
//       ) : (
//         <MainCard>
//           <Grid container spacing={gridSpacing}>
//             <Grid item xs={12}>
//               <Grid
//                 container
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Grid item>
//                   <Grid container direction="column" spacing={1}>
//                     <Grid item>
//                       <Typography variant="subtitle2">Total Growth</Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12}>
//               <Chart {...chartData} />
//             </Grid>
//           </Grid>
//         </MainCard>
//       )}
//     </>
//   );
// };

// TotalGrowthBarChart.propTypes = {
//   isLoading: PropTypes.bool,
// };

// export default TotalGrowthBarChart;

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

// project imports
import SkeletonTotalGrowthBarChart from "ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";

const TotalGrowthBarChart = ({ isLoading, isData }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [data, setData] = useState([]);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  const chartData = {
    height: 480,
    type: "bar",
    options: {
      chart: {
        id: "bar-chart",
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },
      xaxis: {
        type: "category",
        categories: ["Courses", "Lessons", "Students"],
      },
      legend: {
        show: true,
        position: "bottom",
      },
      fill: {
        type: "solid",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
      },
    },
    series: data,
  };

  useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary],
          },
        },
      },
      grid: {
        borderColor: grey200,
      },
      tooltip: {
        theme: "light",
      },
      legend: {
        labels: {
          colors: grey500,
        },
      },
    };

    if (!isLoading) {
      setData([
        {
          name: "Active",
          data: [
            isData.Courses?.Active || 0,
            isData.Lessons?.Active || 0,
            isData.Students?.Active || 0,
          ],
        },
        {
          name: "Completed",
          data: [
            isData.Courses?.Completed || 0,
            isData.Lessons?.Completed || 0,
            isData.Students?.Completed || 0,
          ],
        },
        {
          name: "Pending",
          data: [
            isData.Courses?.Pending || 0,
            isData.Lessons?.Pending || 0,
            isData.Students?.Pending || 0,
          ],
        },
      ]);
      ApexCharts.exec("bar-chart", "updateOptions", newChartData);
    }
  }, [
    navType,
    primary200,
    primaryDark,
    secondaryMain,
    secondaryLight,
    primary,
    grey200,
    isLoading,
    grey500,
  ]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Dashboard Summary</Typography>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
  isData: PropTypes.object,
};

export default TotalGrowthBarChart;
