import {
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useTreasureStore } from "../../store/store";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export function HistoryPanel() {
  const { setSelectedRun, historyItems, setHistory, setInputs } =
    useTreasureStore();

  const load = async () => {
    const res = await axios.get(`${API_BASE}/api/treasure/history`);
    setHistory(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (id: string) => {
    const res = await axios.get(`${API_BASE}/api/treasure/run/${id}`);
    const detail = res.data;
    setSelectedRun(detail);
    const nextMatrixText = detail.matrix
      .map((row: number[]) => row.join(" "))
      .join("\n");
    setInputs({
      n: detail.n,
      m: detail.m,
      p: detail.p,
      matrixText: nextMatrixText,
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Lịch sử</Typography>
      <Button size="small" onClick={load}>
        Tải lại
      </Button>
      <div style={{ maxHeight: "40vh", overflow: "auto" }}>
        <List dense>
          {historyItems.map((it) => (
            <ListItemButton key={it.id} onClick={() => open(it.id)}>
              <ListItemText
                primary={`#${it.id.slice(0, 8)} — p=${
                  it.p
                } — fuel=${it.minFuel.toFixed(5)}`}
                secondary={new Date(it.createdAt).toLocaleString()}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
    </Stack>
  );
}
