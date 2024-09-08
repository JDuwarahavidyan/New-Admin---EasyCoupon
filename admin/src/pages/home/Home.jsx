import Chart from '../../components/chart/Chart';
import './home.css';
import WidgetSm from '../../components/widgetSm/WidgetSm';
import WidgetLg from '../../components/widgetLg/WidgetLg';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
// eslint-disable-next-line no-unused-vars
import CircularProgress from '@mui/material/CircularProgress';


export default function Home() {
  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.customToken) {
          console.error("User is not authenticated or customToken is missing.");
          setLoading(false);
          return;
        }

        const res = await axios.get("/users/stats", {
          headers: {
            authorization: "Bearer " + user.customToken,
          },
        });

        if (res.data && Array.isArray(res.data)) {
          const statsList = res.data.sort((a, b) => a.month - b.month);

          const tempStats = MONTHS.map((month, index) => {
            const found = statsList.find(item => item.month === index + 1);
            return { name: month, "New User": found ? found.total : 0 };
          });

          setUserStats(tempStats);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };
    getStats();
  }, [MONTHS]);

  if (loading) {
    // return (
    //   <div className="home loadingContainer">
    //     <CircularProgress />
    //   </div>
    // );
  }

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="New User" />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
