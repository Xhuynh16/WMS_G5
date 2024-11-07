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

        [Column("NAME", TypeName = "NVARCHAR(255)")]
        public string Name { get; set; }
        [Column("TYPE", TypeName = "NVARCHAR(50)")]
        public string Type { get; set; }
        [Column("STOCK", TypeName = "NVARCHAR(50)")]
        public string Stock { get; set; }
        [Column("CURRENCY", TypeName = "NVARCHAR(50)")]
        public string Currency { get; set; }
    }
}
