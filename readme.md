## Treasure Finder

Ứng dụng full‑stack giải bài toán tìm kho báu trên ma trận: Backend (ASP.NET Core + PostgreSQL) và Frontend (React + Vite + Material UI).

### Đề bài

- Cho ma trận kích thước n×m, mỗi ô chứa nhãn từ 1..p.
- Xuất phát tại S = (1,1).
- Chi phí di chuyển từ (x1,y1) đến (x2,y2): sqrt((x1−x2)^2 + (y1−y2)^2).
- Yêu cầu: tìm lượng nhiên liệu nhỏ nhất để lần lượt đi qua một ô mang nhãn 1, rồi 2, … đến p.

### Tính năng

- Nhập n, m, p và ma trận; gửi lên backend để tính đường đi tối ưu.
- Lưu lịch sử; bấm item lịch sử để xem chi tiết và tự động điền lại input.
- Trực quan hóa đường đi và lượng nhiên liệu tối thiểu.

### Cài đặt nhanh

#### Cách 1: Docker Compose (khuyến nghị)

```bash
docker compose up --build
```

- Backend: http://localhost:8080/swagger
- Frontend: http://localhost:5173
- DB: Postgres localhost:5432 (postgres/postgres)

#### Cách 2: Chạy local

1. Postgres (dùng Docker nếu chưa cài):

```bash
docker run --name postgres-treasure -e POSTGRES_DB=treasuredb -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

2. Backend:

```powershell
cd backend
$env:POSTGRES_CONNECTION_STRING="Host=localhost;Port=5432;Database=treasuredb;Username=postgres;Password=postgres"
dotnet run
```

3. Frontend:

```powershell
cd frontend
npm i
$env:VITE_API_BASE_URL="http://localhost:8080"
npm run dev
```

### API

- POST `/api/treasure/solve` → nhận `{ n, m, p, matrix }`, trả `{ id, minFuel, path }`.
- GET `/api/treasure/history` → danh sách lịch sử (mới nhất trước).
- GET `/api/treasure/run/{id}` → chi tiết 1 lần chạy (ma trận, đường đi, minFuel).

### Thuật toán (tóm tắt)

- Xuất phát tại S=(1,1). Gom toạ độ theo từng nhãn 1..P.
- Quy hoạch động: từ mỗi điểm ở nhãn k‑1 sang nhãn k, chọn chi phí nhỏ nhất (khoảng cách Euclid).
- Backtrack dựng lại đường đi; làm tròn kết quả 5 chữ số thập phân.

### Mô hình dữ liệu

- Bảng `treasure_runs` (PostgreSQL): `id`, `n`, `m`, `p`, `matrix_json` (jsonb), `path_json` (jsonb), `min_fuel`, `created_at`.

### Liên kết nhanh

- Backend (Swagger): http://localhost:8080/swagger
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432 (postgres/postgres, db: treasuredb)
