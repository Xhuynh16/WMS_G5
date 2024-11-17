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
    [Table("T_BU_TICKETS_DETAILS")]
    public class TblBuTicketDetails : SoftDeleteEntity
    {
        [Key]
        [Column("CODE", TypeName = "VARCHAR(50)")]
        public string? Code { get; set; }
        [Column("TICKET_ID", TypeName = "NVARCHAR(50)")]
        public string? Ticket_id { get; set; }
        [Column("PRODUCT_ID", TypeName = "VARCHAR(50)")]
        public string? Product_id { get; set; }
        [Column("QUANTITY_CHANGE", TypeName = "VARCHAR(50)")]
        public string? Quantity_Change { get; set; }
        [Column("NOTE", TypeName = "NVARCHAR(250)")]
        public string? Note { get; set; }
    }
}
