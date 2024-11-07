using AutoMapper;
using Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Dtos.BU;
using DMS.CORE.Entities.AD;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Dtos.MD
{
    public class TemplateOpinionDto : BaseMdTemDto, IMapFrom, IDto
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public int TimeYear { get; set; }
        public string Note { get; set; }
        public string OrgCode { get; set; }
        public List<TemplateOpinionDataDto>? TemDataReferences { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTemplateOpinion, TemplateOpinionDto>().ReverseMap();
        }

    }
    public class TemplateOpinionDetailDto : IMapFrom, IDto
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
        public int TimeYear { get; set; }
        public string Note { get; set; }
        public string OrgCode { get; set; }
        public OrganizeDto TreeOrgannize { get; set; }
        public OpinionListDto TreeOpinionList { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTemplateOpinion, TemplateOpinionDetailDto>().ReverseMap();
        }
    }

}
