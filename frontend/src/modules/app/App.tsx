import { Container, Grid, Paper, Typography } from "@mui/material";
import { HistoryPanel } from "../history/HistoryPanel";
import { InputPanel } from "../input/InputPanel";
import { VisualizationPanel } from "../visualize/VisualizationPanel";
import { useTreasureStore } from "../../store/store";

export default function App() {
  const { selectedRun } = useTreasureStore();
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Treasure Finder
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <InputPanel />
          </Paper>
          <Paper sx={{ p: 2, mt: 2 }}>
            <HistoryPanel />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "calc(100vh - 140px)" }}>
            <VisualizationPanel run={selectedRun} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
