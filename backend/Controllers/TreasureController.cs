using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TreasureApi.Data;
using TreasureApi.Dtos;
using TreasureApi.Models;
using TreasureApi.Services;

namespace TreasureApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class TreasureController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly TreasureSolver _solver;
        private readonly ILogger<TreasureController> _logger;

        public TreasureController(AppDbContext db, TreasureSolver solver, ILogger<TreasureController> logger)
        {
            _db = db;
            _solver = solver;
            _logger = logger;
        }

        [HttpPost("solve")]
        public async Task<ActionResult<SolveResponse>> Solve([FromBody] SolveRequest request)
        {
            if (request.N <= 0 || request.M <= 0 || request.P <= 0)
            {
                return BadRequest("n, m, p must be positive");
            }
            if (request.Matrix is null || request.Matrix.Length != request.N)
            {
                return BadRequest("Matrix row count must equal n");
            }
            for (int i = 0; i < request.N; i++)
            {
                if (request.Matrix[i] is null || request.Matrix[i].Length != request.M)
                {
                    return BadRequest($"Row {i} length must equal m");
                }
            }
            // Ensure all matrix values are within [1, P]
            for (int i = 0; i < request.N; i++)
            {
                for (int j = 0; j < request.M; j++)
                {
                    int value = request.Matrix[i][j];
                    if (value < 1 || value > request.P)
                    {
                        return BadRequest("All matrix values must be between 1 and P");
                    }
                }
            }
            var labels = new HashSet<int>();
            for (int i = 0; i < request.N; i++)
                for (int j = 0; j < request.M; j++)
                    labels.Add(request.Matrix[i][j]);
            for (int k = 1; k <= request.P; k++)
            {
                if (!labels.Contains(k))
                {
                    return BadRequest($"Matrix is missing label {k}");
                }
            }

            var result = _solver.Solve(request.N, request.M, request.P, request.Matrix);

            var entity = new TreasureRun
            {
                Id = Guid.NewGuid(),
                N = request.N,
                M = request.M,
                P = request.P,
                MatrixJson = JsonSerializer.Serialize(request.Matrix),
                MinFuel = result.MinFuel,
                PathJson = JsonSerializer.Serialize(result.Path),
                CreatedAt = DateTime.UtcNow
            };
            _db.TreasureRuns.Add(entity);
            await _db.SaveChangesAsync();

            return Ok(new SolveResponse
            {
                Id = entity.Id,
                MinFuel = result.MinFuel,
                Path = result.Path
            });
        }

        [HttpGet("history")]
        public async Task<ActionResult<List<HistoryItem>>> GetHistory()
        {
            var items = await _db.TreasureRuns
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new HistoryItem
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    N = x.N,
                    M = x.M,
                    P = x.P,
                    MinFuel = x.MinFuel
                })
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("run/{id:guid}")]
        public async Task<ActionResult<SolveDetail>> GetRunDetail(Guid id)
        {
            var run = await _db.TreasureRuns.FindAsync(id);
            if (run == null) return NotFound();

            var matrix = JsonSerializer.Deserialize<int[][]>(run.MatrixJson) ?? Array.Empty<int[]>();
            var path = JsonSerializer.Deserialize<List<PointDto>>(run.PathJson) ?? new List<PointDto>();

            return Ok(new SolveDetail
            {
                Id = run.Id,
                N = run.N,
                M = run.M,
                P = run.P,
                Matrix = matrix,
                MinFuel = run.MinFuel,
                Path = path,
                CreatedAt = run.CreatedAt
            });
        }
    }
}
