using AutoMapper;
using Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.CORE.Entities.BU;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Dtos.BU
{
    public class OpinionListDto : IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string PId { get; set; }
        public int? OrderNumber { get; set; }

        public bool IsChecked { get; set; }

        public string? Title { get; set; }

        public string? Key { get; set; }
        public List<OpinionListDto>? Children { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<tblBuOpinionList, OpinionListDto>().ReverseMap();
        }
    }
    public class OpinionViewModel
    {
        public Guid GroupId { get; set; }

        public List<OpinionListDto> ListOpinion { get; set; }

        public OpinionViewModel()
        {
            ListOpinion = new List<OpinionListDto>();
        }
    }

}
