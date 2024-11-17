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
    public class ProductDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("Số thứ tự")]
        public int OrdinalNumber { get; set; }

        [Key]
        [Description("Mã")]
        public string Code { get; set; }

        [Description("Mô tả")]
        public string? Description { get; set; }

        [Description("Tên")]
        public string? Name { get; set; }

        [Description("Loại Hàng")]
        public string? Type { get; set; }

        [Description("Số lượng")]
        public string? Stock { get; set; }

        [Description("Đơn vị tính")]
        public string? Currency { get; set; }

        [Description("Giá cơ bản")]
        public string? BasePrice { get; set; }

        [Description("Giá bán")]
        public string? SellingPrice { get; set; }

        [Description("Số lượng tối thiểu")]
        public string? MinQuantity { get; set; }

        [Description("Số lượng tối đa")]
        public string? MaxQuantity { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdProduct, ProductDto>().ReverseMap();
        }
    }

}
