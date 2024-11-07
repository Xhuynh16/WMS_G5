using DMS.CORE.Common;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DMS.CORE.Entities.BU
{
    [Table("T_CM_ATTACHMENT")]
    public class TblCmAttachment : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ID")]
        public int Id { get; set; }

        [Column("NAME",TypeName = "nvarchar2(255)")]
        public string Name { get; set; }

        [Column("URL", TypeName = "varchar2(255)")]
        public string Url { get; set; }

        [Column("EXTENSION", TypeName = "varchar2(50)")]
        public string Extension { get; set; }

        [Column("SIZE")]
        public double Size { get; set; }

        [Column("TYPE", TypeName = "varchar2(50)")]
        public string Type { get; set; }
    }
}
