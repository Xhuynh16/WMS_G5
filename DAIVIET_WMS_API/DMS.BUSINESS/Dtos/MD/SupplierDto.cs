using AutoMapper;
using Common;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace DMS.BUSINESS.Dtos.MD
{
    public class SupplierDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("Số thứ tự")]
        public int OrdinalNumber { get; set; }

        [Key]
        [Description("Mã")]
        public string Id { get; set; }

        [Description("Tên")]
        public string Name { get; set; }

        [Description("Liên Hệ")]
        public string Contact { get; set; }

        [Description("Địa Chỉ")]
        public string Address { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdSupplier, SupplierDto>().ReverseMap();
        }
    }
 
}
