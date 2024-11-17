using DMS.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_PRODUCT")]
    public class TblMdProduct : SoftDeleteEntity
    {
        [Key]
        [Column("CODE", TypeName = "NVARCHAR(50)")]
        public string Code { get; set; }

        [Column("DESCRIPTION", TypeName = "NVARCHAR(50)")]
        public string Description { get; set; }

        [Column("NAME", TypeName = "NVARCHAR(50)")]
        public string Name { get; set; }

        [Column("TYPE", TypeName = "NVARCHAR(50)")]
        public string Type { get; set; }

        [Column("STOCK", TypeName = "NVARCHAR(50)")]
        public string Stock { get; set; }

        [Column("CURRENCY", TypeName = "NVARCHAR(50)")]
        public string Currency { get; set; }

        [Column("BASE_PRICE", TypeName = "NCHAR(10)")]
        public string BasePrice { get; set; }

        [Column("SELLING_PRICE", TypeName = "NCHAR(10)")]
        public string SellingPrice { get; set; }

        [Column("MIN_QUANTITY", TypeName = "NCHAR(10)")]
        public string MinQuantity { get; set; }

        [Column("MAX_QUANTITY", TypeName = "NCHAR(10)")]
        public string MaxQuantity { get; set; }
    }
}
