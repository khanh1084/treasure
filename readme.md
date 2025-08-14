# Bài test Full stack Developer

## Yêu cầu

Viết ứng dụng C# (backend) và React (frontend, ưu tiên Material-UI) để giải quyết bài toán "Tìm kho báu" trên ma trận.

---

## 1. Phân tích bài toán

- Ma trận n x m, mỗi ô chứa số từ 1 đến p (số hiệu rương).
- Mỗi rương chứa chìa khoá cho rương số tiếp theo.
- Chỉ có rương số p chứa kho báu.
- Xuất phát tại (1,1) (hàng 1, cột 1), đã có chìa khoá số 0.
- Mỗi lần di chuyển từ (x1, y1) đến (x2, y2) tốn nhiên liệu:  
  `sqrt((x1-x2)^2 + (y1-y2)^2)`
- Tìm lượng nhiên liệu nhỏ nhất để lấy được kho báu.

---

## 2. Yêu cầu chức năng

### Frontend (React + Material-UI)

- Nhập n, m, p và ma trận.
- Validation dữ liệu nhập.
- Gửi dữ liệu lên backend, lưu vào database.
- Hiển thị kết quả lượng nhiên liệu nhỏ nhất.
- Danh sách các lần nhập trước, có thể xem lại và giải lại.

### Backend (C# ASP.NET Core)

- API nhận input, tính toán kết quả, lưu vào database.
- API lấy danh sách các lần nhập trước.

---

## 3. Hướng dẫn cài đặt

### Backend

- .NET 6+ (ASP.NET Core Web API)
- Entity Framework Core (SQLite hoặc SQL Server)
- Các endpoint:
  - `POST /api/treasure/solve` : Nhận input, trả kết quả, lưu DB.
  - `GET /api/treasure/history` : Lấy lịch sử các lần nhập.

### Frontend

- React (Create React App hoặc Vite)
- Material-UI (MUI)
- Axios (giao tiếp API)
- Form nhập liệu, validation, hiển thị kết quả và lịch sử.

---

## 4. Ý tưởng giải thuật

- Với mỗi loại rương (1..p), lưu lại tất cả vị trí xuất hiện trên ma trận.
- Bắt đầu từ (1,1), tìm đường đi ngắn nhất qua các rương theo thứ tự tăng dần.
- Dùng Dijkstra hoặc BFS cho từng bước giữa các nhóm rương liên tiếp.
- Tối ưu: Nếu p nhỏ, có thể dùng DP; nếu p lớn, cần tối ưu bộ nhớ.

---

## 5. Ví dụ giao diện

- Form nhập n, m, p, ma trận (dùng Material-UI Table).
- Nút "Giải" để gửi lên backend.
- Hiển thị kết quả và lịch sử các lần giải.

---

## 6. Demo API (Swagger)

- `POST /api/treasure/solve`
  - Request:
    ```json
    {
      "n": 3,
      "m": 3,
      "p": 3,
      "matrix": [
        [3, 2, 2],
        [2, 2, 2],
        [2, 2, 1]
      ]
    }
    ```
  - Response:
    ```json
    {
      "minFuel": 5.65685
    }
    ```

---

## 7. Yêu cầu nộp bài

- Upload toàn bộ mã nguồn frontend và backend lên Github.
- Gửi link Github.

---

## 8. Gợi ý code

### Backend (C#) - Giải thuật tính toán

### Chạy bằng Docker

```bash
docker compose up --build
```

- Backend API: `http://localhost:8080/swagger`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432` (postgres/postgres)
