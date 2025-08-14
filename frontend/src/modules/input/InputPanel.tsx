import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useTreasureStore } from "../../store/store";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export function InputPanel() {
  const { n, m, p, matrixText, setInputs, setSelectedRun, prependHistory } =
    useTreasureStore();

  const handleSolve = async () => {
    const rows = matrixText.trim().split(/\n+/);
    if (rows.length !== n) {
      alert("Số dòng ma trận không khớp n");
      return;
    }
    const matrix: number[][] = [];
    for (const r of rows) {
      const nums = r.trim().split(/\s+/).map(Number);
      if (nums.length !== m || nums.some((x: number) => !Number.isFinite(x))) {
        alert("Mỗi dòng phải có đúng m số");
        return;
      }
      matrix.push(nums);
    }
    try {
      const res = await axios.post(`${API_BASE}/api/treasure/solve`, {
        n,
        m,
        p,
        matrix,
      });
      const id = res.data.id as string;
      prependHistory({
        id,
        createdAt: new Date().toISOString(),
        n,
        m,
        p,
        minFuel: res.data.minFuel,
      });
      const detail = await axios.get(`${API_BASE}/api/treasure/run/${id}`);
      setSelectedRun(detail.data);
    } catch (e: any) {
      alert(e?.response?.data || "Lỗi gọi API");
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Nhập dữ liệu</Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={1}>
        <TextField
          label="n"
          type="number"
          value={n}
          onChange={(e) => setInputs({ n: Number(e.target.value) })}
        />
        <TextField
          label="m"
          type="number"
          value={m}
          onChange={(e) => setInputs({ m: Number(e.target.value) })}
        />
        <TextField
          label="p"
          type="number"
          value={p}
          onChange={(e) => setInputs({ p: Number(e.target.value) })}
        />
      </Box>
      <TextField
        label="Ma trận (cách nhau bởi khoảng trắng, xuống dòng cho hàng)"
        multiline
        minRows={5}
        value={matrixText}
        onChange={(e) => setInputs({ matrixText: e.target.value })}
      />
      <Button variant="contained" onClick={handleSolve}>
        Giải
      </Button>
    </Stack>
  );
}
