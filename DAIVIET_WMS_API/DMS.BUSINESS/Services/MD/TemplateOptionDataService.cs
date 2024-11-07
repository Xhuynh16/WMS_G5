using AutoMapper;
using DMS.BUSINESS.Common;
using Microsoft.EntityFrameworkCore;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Services.AD;
using DMS.CORE.Entities.AD;
using DMS.CORE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DMS.CORE.Entities.MD;
using Common;
using DMS.BUSINESS.Dtos.MD;

namespace DMS.BUSINESS.Services.MD
{
    public interface ITemplateOptionDataService : IGenericService<TblMdTemplateOpinionData, TemplateOpinionDataDto>
    {
        Task<IList<TemplateOpinionDataDto>> GetAll(BaseMdFilter filter);
        //Task<IList<TemplateOpinionDataDto>> Add(IList<TemplateOpinionDataDto> dto);
        Task<Guid?> GetCode(TemplateOpinionDataGenCodeDto dto);

        // Phương thức xóa dựa trên orgCode, templateCode, và opinionCode
        Task Delete(TemplateOpinionDataGenCodeDto dto);
    }
    public class TemplateOptionDataService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdTemplateOpinionData, TemplateOpinionDataDto>(dbContext, mapper), ITemplateOptionDataService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdTemplateOpinionData.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                    x.TemplateCode.Contains(filter.KeyWord) || x.OrgCode.Contains(filter.KeyWord));
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
        public  async Task<IList<TemplateOpinionDataDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdTemplateOpinionData.AsQueryable();
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

        public async Task<Guid?> GetCode(TemplateOpinionDataGenCodeDto dto)
        {
            try
            {
                var data = await _dbContext.tblMdTemplateOpinionData
                                           .Where(x => x.OrgCode == dto.OrgCode && x.TemplateCode == dto.TemplateCode && x.OpinionCode == dto.OpinionCode)
                                           .FirstOrDefaultAsync();
                return data?.Code;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task Delete(TemplateOpinionDataGenCodeDto dto)
        {
            try
            {
                // Lấy code dựa trên ba giá trị
                var code = await GetCode(dto);

                if (code.HasValue)
                {
                    // Gọi phương thức Delete từ GenericService để xóa bản ghi
                    await Delete(code.Value);
                }
                else
                {
                    Status = false;
                    MessageObject.Code = "0000";
                }
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
        /*
public async Task<IList<TemplateOpinionDataDto>> Add(IList<TemplateOpinionDataDto> dto)
{
   try
   {
       var entities = _mapper.Map<List<TemplateOpinionDataDto>>(dto);

       // Thêm các entity vào DbSet
       await _dbContext.Set<TemplateOpinionDataDto>().AddRangeAsync(entities);

       // Lưu các thay đổi vào cơ sở dữ liệu
       await _dbContext.SaveChangesAsync();

       // Chuyển đổi các entity đã thêm thành DTO và trả về
       return _mapper.Map<List<TemplateOpinionDataDto>>(entities);
   }
   catch (Exception ex)
   {
       Status = false;
       Exception = ex;
       return null;
   }
}
*/
    }
}
