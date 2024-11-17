using AutoMapper;
using Common;
using DMS.CORE.Entities.BU;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Dtos.BU
{
    public class ImportDto : BaseMdTemDto, IMapFrom, IDto
    {
        [Key]
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? Address { get; set; }
        public string? Type { get; set; }
        public string? Note { get; set; }
        public List<TblBuTicketDetails>? Details { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblBuImport, ImportDto>().ReverseMap();
        }
    }
    
}
