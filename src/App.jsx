import "./App.css";
import {styled} from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DonutChart from "./components/DonutChart";
import LineChart from "./components/LineChart";
import AreaChart from "./components/AreaChart";
import BarChart from "./components/BarChart";
import HorizontalBarChart from "./components/HorizontalBarChart";
import StackedBarChart from "./components/StackedBarChart";
import ProgressBar from "./components/ProgressBar";

function App() {
	const Item = styled(Paper)(({theme}) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		padding: theme.spacing(2),
		textAlign: "left",
		height: "400px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	}));

	const ChartHeader = styled(Typography)(() => ({
		color: "#1C2833",
		fontWeight: "bold",
		fontFamily: "Montserrat",
		fontSize: "0.9rem",
		alignSelf: "flex-start",
	}));

	return (
		<>
			<Grid
				container
				spacing={4}
				columns={13}
				sx={{height: "100%", maxWidth: "1800px"}}
			>
				<Grid xs={6}>
					<Item>
						<ChartHeader>Audence by Channels</ChartHeader>
						<DonutChart />
					</Item>
				</Grid>
				<Grid xs={4}>
					<Item>
						<ChartHeader>Payments Last 3 Weeks</ChartHeader>
						<LineChart />
					</Item>
				</Grid>
				<Grid xs={3}>
					<Item>
						<ChartHeader>Sessions over Time</ChartHeader>
						<AreaChart />
					</Item>
				</Grid>
				<Grid xs={3}>
					<Item>
						<ChartHeader>Paid vs Organic New Users</ChartHeader>
						<BarChart />
					</Item>
				</Grid>
				<Grid xs={3}>
					<Item>
						<ChartHeader>Top Pages by Conversion</ChartHeader>
						<HorizontalBarChart />
					</Item>
				</Grid>
				<Grid xs={4}>
					<Item>
						<ChartHeader>MRR Movement</ChartHeader>
						<StackedBarChart />
					</Item>
				</Grid>
				<Grid xs={3}>
					<Item>
						<ChartHeader>Average Conversion Rate</ChartHeader>
						<ProgressBar />
					</Item>
				</Grid>
			</Grid>
		</>
	);
}

export default App;
