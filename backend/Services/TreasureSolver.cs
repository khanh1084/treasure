using System.Globalization;
using TreasureApi.Dtos;

namespace TreasureApi.Services
{
    public class TreasureSolver
    {
        public SolveResult Solve(int n, int m, int p, int[][] matrix)
        {
            var positionsByLabel = new List<(int x, int y)>[p + 1];
            for (int k = 0; k <= p; k++) positionsByLabel[k] = new List<(int x, int y)>();

            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < m; j++)
                {
                    int label = matrix[i][j];
                    if (label >= 1 && label <= p)
                    {
                        positionsByLabel[label].Add((i + 1, j + 1));
                    }
                }
            }

            for (int k = 1; k <= p; k++)
            {
                if (positionsByLabel[k].Count == 0)
                {
                    throw new InvalidOperationException($"Missing label {k}");
                }
            }

            var start = (x: 1, y: 1);

            int l1Count = positionsByLabel[1].Count;
            var prevCosts = new double[l1Count];
            var prevParents = new int[l1Count];
            for (int i1 = 0; i1 < l1Count; i1++)
            {
                prevCosts[i1] = Distance(start, positionsByLabel[1][i1]);
                prevParents[i1] = -1;
            }

            var parentIndicesByLayer = new List<int[]>();
            parentIndicesByLayer.Add(prevParents);

            for (int k = 2; k <= p; k++)
            {
                int curCount = positionsByLabel[k].Count;
                var curCosts = new double[curCount];
                var curParents = new int[curCount];
                for (int v = 0; v < curCount; v++)
                {
                    double best = double.PositiveInfinity;
                    int bestU = -1;
                    var vPos = positionsByLabel[k][v];
                    for (int u = 0; u < positionsByLabel[k - 1].Count; u++)
                    {
                        var uPos = positionsByLabel[k - 1][u];
                        double cand = prevCosts[u] + Distance(uPos, vPos);
                        if (cand < best)
                        {
                            best = cand;
                            bestU = u;
                        }
                    }
                    curCosts[v] = best;
                    curParents[v] = bestU;
                }
                prevCosts = curCosts;
                parentIndicesByLayer.Add(curParents);
            }

            int bestIndex = 0;
            double bestCost = prevCosts[0];
            for (int i2 = 1; i2 < prevCosts.Length; i2++)
            {
                if (prevCosts[i2] < bestCost)
                {
                    bestCost = prevCosts[i2];
                    bestIndex = i2;
                }
            }

            var path = new List<PointDto>();
            path.Add(new PointDto { X = start.x, Y = start.y });

            var indices = new int[p + 1];
            indices[p] = bestIndex;
            for (int k = p; k >= 2; k--)
            {
                var parent = parentIndicesByLayer[k - 1][indices[k]];
                indices[k - 1] = parent;
            }
            for (int k = 1; k <= p; k++)
            {
                var pos = positionsByLabel[k][indices[k]];
                path.Add(new PointDto { X = pos.x, Y = pos.y });
            }

            double rounded = Math.Round(bestCost, 5, MidpointRounding.AwayFromZero);

            return new SolveResult
            {
                MinFuel = rounded,
                Path = path
            };
        }

        private static double Distance((int x, int y) a, (int x, int y) b)
        {
            long dx = a.x - b.x;
            long dy = a.y - b.y;
            return Math.Sqrt(dx * dx + dy * dy);
        }
    }

    public class SolveResult
    {
        public double MinFuel { get; set; }
        public List<PointDto> Path { get; set; } = new();
    }
}
