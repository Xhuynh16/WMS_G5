using AutoMapper;
using Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.CORE.Entities.AD;
using DMS.CORE.Entities.BU;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Dtos.MD
{
    public class TemplateOpinionDataListDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public Guid Code { get; set; }
        public string OrgCode { get; set; }
        public string OpinionCode { get; set; }
        public string TemplateCode { get; set; }
        public List<OrganizeDto> Organizes { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTemplateOpinionData, TemplateOpinionDataListDto>().ReverseMap();
        }
    }
    public class TemplateOpinionDataDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public Guid Code { get; set; }
        public string OrgCode { get; set; }
        public string OpinionCode { get; set; }
        public string TemplateCode { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTemplateOpinionData, TemplateOpinionDataDto>().ReverseMap();
        }
    }
    public class TemplateOpinionDataGenCodeDto :  IMapFrom, IDto
    {
       
        public string OrgCode { get; set; }
        public string OpinionCode { get; set; }
        public string TemplateCode { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTemplateOpinionData, TemplateOpinionDataGenCodeDto>().ReverseMap();
        }
    }


}
