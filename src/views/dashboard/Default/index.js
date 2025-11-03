import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import EarningCard from "./EarningCard";
import { gridSpacing } from "store/constant";
import DashboardApi from "apis/dashboard.api";

const Dashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const dashboardApi = new DashboardApi();

  // Dummy cricket event data
  const dummyData = {
    totalTicketsSold: 4520,
    todayTicketsSold: 320,
    upcomingEvents: [
      { name: "India vs Australia - T20", date: "2025-11-05" },
      { name: "India vs South Africa - ODI", date: "2025-11-12" },
      { name: "IPL 2025 Opening Match", date: "2025-12-01" },
    ],
    // Growth chart data for cricket
    growthData: {
      "Total Matches": 30,
      "Completed Matches": 18,
      "Tickets Sold": 4520,
    },
  };

  const [response, setResponse] = useState(dummyData);

  const getDashboard = async () => {
    try {
      const dashboardData = await dashboardApi.getDashboard();
      if (dashboardData?.data?.data) {
        setResponse(dashboardData.data.data);
      } else {
        // toast.error("No API data found — showing cricket dummy data.");
        setResponse(dummyData);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Error fetching dashboard — showing cricket dummy data.");
      setResponse(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Total Tickets Sold */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.totalTicketsSold || 0}
              isTitle="Total Tickets Sold"
            />
          </Grid>

          {/* Today's Tickets Sold */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.todayTicketsSold || 0}
              isTitle="Today's Tickets Sold"
            />
          </Grid>

          {/* Upcoming Matches */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.upcomingEventsCount || 0}
              isTitle="Upcoming Matches"
            />
          </Grid>

          {/* Total Users */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.totalUsers || 0}
              isTitle="Total Users"
            />
          </Grid>

          {/* Total Events Hosted */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.totalEventsHosted || 0}
              isTitle="Total Events Hosted"
            />
          </Grid>

          {/* Total Revenue */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              isCount={response?.totalRevenue?.toFixed(2) || 0}
              isTitle="Total Revenue (€)"
            />
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* <h3 style={{ marginBottom: "16px" }}>🏏 Cricket Dashboard</h3> */}

              <Grid container spacing={2}>
                {/* Left Side: Cricket Performance Chart */}
                {/* <Grid item xs={12} md={6}>
                  <div>
                    <h4 style={{ marginBottom: "10px" }}>Performance Overview</h4>
                    <TotalGrowthBarChart
                      isLoading={isLoading}
                      isData={
                        response?.growthData ?? [
                          { name: "India vs Australia - T20", runs: 180, tickets: 1500 },
                          { name: "India vs South Africa - ODI", runs: 250, tickets: 1300 },
                          { name: "IPL 2025 Opening Match", runs: 210, tickets: 1720 },
                          { name: "India vs England - Test", runs: 320, tickets: 1000 },
                          { name: "India vs New Zealand - T20", runs: 195, tickets: 900 },
                        ]
                      }
                    />
                  </div>
                </Grid> */}

                {/* Right Side: Upcoming Events List */}
                <Grid item xs={12} >
                  <div>
                    <h4 style={{ marginBottom: "10px" }}>
                      Upcoming Events
                    </h4>
                    {response?.topUpcomingEvents?.length ? (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {response.topUpcomingEvents.map((event) => (
                          <li key={event._id} style={{ marginBottom: "8px" }}>
                            <strong>{event.title}</strong> —{" "}
                            <span style={{ color: "#777" }}>
                              {new Date(event.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}{" "}
                              • {event.city}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        <li>
                          <strong>London Tech Innovators Summit 2025</strong> —{" "}
                          <span style={{ color: "#777" }}>
                            Nov 11, 2025 • London
                          </span>
                        </li>
                        <li>
                          <strong>test</strong> —{" "}
                          <span style={{ color: "#777" }}>
                            Nov 2, 2026 • Mumbai
                          </span>
                        </li>
                      </ul>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          {/* 📈 Cricket Growth Bar Chart */}
          {/* <Grid item lg={6} md={12} xs={12}>
  <TotalGrowthBarChart
    isLoading={isLoading}
    isData={
      response?.growthData ?? [
        { name: "India vs Australia - T20", runs: 180, tickets: 1500 },
        { name: "India vs South Africa - ODI", runs: 250, tickets: 1300 },
        { name: "IPL 2025 Opening Match", runs: 210, tickets: 1720 },
      ]
    }
  />
</Grid> */}
          {/* 🥧 Donut Chart for quick stats */}
          {/* <Grid item lg={6} md={12} xs={12}>
            <DonutChart
              isData={[
                response?.growthData?.["Total Matches"] || 0,
                response?.growthData?.["Completed Matches"] || 0,
                response?.growthData?.["Tickets Sold"] || 0,
              ]}
            />
          </Grid> */}

          {/* 🏟 Upcoming Cricket Matches List */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
