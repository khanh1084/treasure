namespace TreasureApi.Models
{
    public class TreasureRun
    {
        public Guid Id { get; set; }
        public int N { get; set; }
        public int M { get; set; }
        public int P { get; set; }
        public string MatrixJson { get; set; } = string.Empty;
        public double MinFuel { get; set; }
        public string PathJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
