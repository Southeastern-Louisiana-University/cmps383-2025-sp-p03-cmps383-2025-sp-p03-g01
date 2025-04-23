using Selu383.SP25.P03.Api.Features.Reviews;
using Selu383.SP25.P03.Api.Features.Users;
using System.ComponentModel.DataAnnotations;

namespace Selu383.SP25.P03.Api.Features.Theaters
{
    public class Theater
    {
        public int Id { get; set; }
        [MaxLength(120)]
        public required string Name { get; set; }
        public required string Address { get; set; }
        public int SeatCount { get; set; }
        public int? ManagerId { get; set; }
        public virtual User? Manager { get; set; }
        public ICollection<Hall> Halls { get; set; }
        public List<ReviewGetDto>? Reviews { get; set; }
    }
}
