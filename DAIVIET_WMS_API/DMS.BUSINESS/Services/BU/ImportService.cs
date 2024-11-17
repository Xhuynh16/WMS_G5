using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.BU;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE;
using DMS.CORE.Entities.BU;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Services.BU
{
    public interface IImportService : IGenericService<TblBuImport, ImportDto>
    {
        Task<IList<ImportDto>> GetAll(BaseMdFilter filter);
        Task<ImportDto> CreateImportAndDetails(ImportDto dto);
        Task<ImportDto> getListImportAndDetails(string id);
        Task<ImportDto> UpdateImport(ImportDto dto);
    }
    public class ImportService(AppDbContext dbContext, IMapper mapper) : GenericService<TblBuImport, ImportDto>(dbContext, mapper), IImportService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblBuImport.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                    x.Name.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query, filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;

            }
        }
        public override async Task<PagedResponseDto> SearchEx(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblBuImport.Where(x => x.Type =="N").AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                    x.Name.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query, filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;

            }
        }
        public async Task<IList<ImportDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblBuImport.AsQueryable();
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await base.GetAllMd(query, filter);

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public async Task<ImportDto> CreateImportAndDetails(ImportDto dto)
        {
            try
            {
                var ticketCode = "";
                if (dto.Type == "X")
                {
                    var currentDate = DateTime.Now.ToString("yyyyMMddHHmmss");
                    ticketCode = "XK" + currentDate;
                }
                else
                {
                    var currentDate = DateTime.Now.ToString("yyyyMMddHHmmss");
                    ticketCode = "NK" + currentDate;
                }
                // Tạo entity TblBuImport
                var importEntity = new TblBuImport
                {
                    Id = ticketCode,
                    Name = dto.Name,
                    Status = dto.Status,
                    Type = dto.Type,
                    Address = dto.Address,
                    note = dto.Note,
                    IsActive = true,
                };

                // Tạo danh sách chi tiết
                var details = new List<TblBuTicketDetails>();
                if (dto.Details != null && dto.Details.Any())
                {
                    foreach (var detail in dto.Details)
                    {

                        var ticketDetail = new TblBuTicketDetails
                        {
                            Code = Guid.NewGuid().ToString(),
                            Ticket_id = importEntity.Id,
                            Product_id = detail.Product_id,
                            Quantity_Change = detail.Quantity_Change,
                            Note = detail.Note,
                            IsActive = true,
                        };
                        details.Add(ticketDetail);
                    }
                }

                // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // Thêm bản ghi Import
                        await _dbContext.TblBuImport.AddAsync(importEntity);

                        // Thêm các bản ghi Details
                        if (details.Any())
                        {
                            await _dbContext.TblBuTicketDetails.AddRangeAsync(details);
                        }

                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();

                        // Tạo DTO để trả về
                        var resultDto = new ImportDto
                        {
                            Id = importEntity.Id,
                            Name = importEntity.Name,
                            Status = importEntity.Status,
                            Type = importEntity.Type,
                            Note = importEntity.note,
                            Details = details
                        };

                        return resultDto;
                    }
                    catch (Exception)
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        public static string GetNameStatus(string value)
        {
            return value == "01" ? "Khởi tạo" : value == "02" ? "Chờ xác nhận" : value == "03" ? "Đã phê duyệt" : value == "04" ? "Từ chối" : value == "05" ? "Đã hoàn thành" : "Chưa hoàn thành";
        }
        public async Task<ImportDto> getListImportAndDetails(string id)
        {
            try
            {
                var data = new ImportDto();
                var query = await this._dbContext.TblBuImport.Where(x => x.Id == id).ToListAsync();

                var ticket = query.FirstOrDefault();
                var details = new List<TblBuTicketDetails>();
                data.Id = ticket.Id;
                data.Name = ticket.Name;
                data.Status = ticket.Status;
                data.Type = ticket.Type;
                data.Address = ticket.Address;
                data.CreateBy = ticket.CreateBy;
                data.CreateDate = ticket.CreateDate;
                data.Note = ticket.note;
                details = this._dbContext.TblBuTicketDetails.Where(x => x.Ticket_id == id).OrderByDescending(x => x.CreateDate).ToList();
                data.Details = details;
                if (!string.IsNullOrEmpty(data.Status))
                {
                    data.Status = GetNameStatus(data.Status);
                }
                return data;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return new ImportDto();
            }
        }
        public async Task<ImportDto> UpdateImport(ImportDto dto)
        {
            try
            {
                // Tìm entity Import trong database
                var importEntity = await _dbContext.TblBuImport.FindAsync(dto.Id);
                if (importEntity == null)
                {
                    throw new KeyNotFoundException("Import record not found.");
                }

                // Cập nhật thông tin Import
                importEntity.Name = dto.Name;
                importEntity.Status = dto.Status;
                importEntity.Type = dto.Type; 
                importEntity.Address = dto.Address;
                importEntity.note = dto.Note;
                importEntity.IsActive = dto.IsActive;

                // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // Cập nhật Import
                        _dbContext.TblBuImport.Update(importEntity);

                        // Nếu status là "03" và có chi tiết, cập nhật stock trong bảng Product
                        if (dto.Status == "03" && dto.Details != null && dto.Details.Any())
                        {
                            foreach (var detail in dto.Details)
                            {
                                if (!string.IsNullOrEmpty(detail.Product_id) && !string.IsNullOrEmpty(detail.Quantity_Change))
                                {
                                    var product = await _dbContext.tblMdProduct
                                        .FirstOrDefaultAsync(p => p.Code == detail.Product_id);

                                    if (product != null)
                                    {
                                        // Chuyển đổi string sang số để tính toán
                                        if (int.TryParse(product.Stock, out int currentStock) &&
                                            int.TryParse(detail.Quantity_Change, out int quantityChange))
                                        {
                                            if(dto.Type == "N")
                                            {
                                                // Cập nhật stock mới = stock hiện tại + quantity_change
                                                int newStock = currentStock + quantityChange;
                                                product.Stock = newStock.ToString();
                                                _dbContext.tblMdProduct.Update(product);
                                            }
                                            else
                                            {
                                                // Cập nhật stock mới = stock hiện tại - quantity_change
                                                int newStock = currentStock - quantityChange;
                                                product.Stock = newStock.ToString();
                                                _dbContext.tblMdProduct.Update(product);
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }

                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();

                        // Tạo DTO để trả về
                        var resultDto = new ImportDto
                        {
                            Id = importEntity.Id,
                            Name = importEntity.Name,
                            Status = importEntity.Status,
                            Type = importEntity.Type,
                            Note = importEntity.note,
                            Details = dto.Details
                        };

                        return resultDto;
                    }
                    catch (Exception)
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
    }
}
