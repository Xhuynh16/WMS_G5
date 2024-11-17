using DMS.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.BU
{
    [Table("T_BU_TICKETS")]
    public class TblBuImport : SoftDeleteEntity
    {
        [Key]
        [Column("ID", TypeName = "VARCHAR(50)")]
        public string Id { get; set; }
        [Column("NAME", TypeName = "NVARCHAR(50)")]
        public string Name { get; set; }
        [Column("STATUS", TypeName = "VARCHAR(50)")]
        public string Status { get; set; }
        [Column("TYPE", TypeName = "VARCHAR(50)")]
        public string Type { get; set; }
        [Column("ADDRESS", TypeName = "NVARCHAR(50)")]
        public string Address { get; set; }
        [Column("NOTE", TypeName = "NVARCHAR(250)")]
        public string note { get; set; }
    }
}
