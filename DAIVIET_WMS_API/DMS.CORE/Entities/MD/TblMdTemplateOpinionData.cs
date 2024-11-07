using DMS.CORE.Common;
using DMS.CORE.Entities.AD;
using DMS.CORE.Entities.BU;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.CORE.Entities.MD
{
    [Table("T_MD_TEMPLATE_OPINION_DATA")]
    public class TblMdTemplateOpinionData : BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("CODE")]
        public Guid Code { get; set; }
        [Column("ORG_CODE")]
        public string? OrgCode { get; set; }
        [ForeignKey("OrgCode")]
        public virtual tblAdOrganize Organize { get; set; }
        [Column("OPINION_CODE")]
        public string? OpinionCode { get; set; }

        [ForeignKey("OpinionCode")]
        public virtual tblBuOpinionList OpinionList { get; set; }
        [Column("TEMPLATE_CODE")]
        public string? TemplateCode { get; set; }

        [ForeignKey("TemplateCode")]
        public virtual TblMdTemplateOpinion TemplateOpinion { get; set; }
    }
}
