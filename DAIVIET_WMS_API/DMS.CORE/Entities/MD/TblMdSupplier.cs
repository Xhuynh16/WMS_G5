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
    [Table("T_MD_SUPPLIER")]
    public class TblMdSupplier : SoftDeleteEntity
    {
        [Key]
        [Column("ID", TypeName = "VARCHAR(50)")]
        public string Id { get; set; }

        [Column("NAME", TypeName = "NVARCHAR(255)")]
        public string Name { get; set; }
        [Column("CONTACT", TypeName = "NVARCHAR(255)")]
        public string Contact { get; set; }
        [Column("ADDRESS", TypeName = "NVARCHAR(255)")]
        public string Address { get; set; }
    }
}
