namespace TreasureApi.Dtos
{
    public class SolveRequest
    {
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public int[][]? Matrix { get; set; }
    }

    public class PointDto
    {
        public int X { get; set; }
        public int Y { get; set; }
    }

    public class SolveResponse
    {
        public Guid Id { get; set; }
        public double MinFuel { get; set; }
        public List<PointDto> Path { get; set; } = new();
    }

    public class HistoryItem
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public double MinFuel { get; set; }
    }

    public class SolveDetail
    {
        public Guid Id { get; set; }
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public int[][] Matrix { get; set; } = Array.Empty<int[]>();
        public double MinFuel { get; set; }
        public List<PointDto> Path { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}

