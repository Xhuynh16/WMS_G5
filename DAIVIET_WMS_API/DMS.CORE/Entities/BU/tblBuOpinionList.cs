using DMS.CORE.Common;
using DMS.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.BU
{
    [Table("T_BU_OPINION_LIST")]
    public class tblBuOpinionList : SoftDeleteEntity
    {
        [Key]
        [Column("ID", TypeName = "VARCHAR(50)")]
        public string Id { get; set; }
        [Column("NAME", TypeName = "NVARCHAR(MAX)")]
        public string Name { get; set; }
        [Column("PID", TypeName ="VARCHAR(50)")]
        public string PId { get; set; }
        [Column("ORDER_NUMBER", TypeName = "INT")]
        public int OrderNumber { get; set; }

    }
}
