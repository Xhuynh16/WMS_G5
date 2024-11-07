using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Dtos.BU;
using DMS.BUSINESS.Services.AD;
using DMS.CORE;
using DMS.CORE.Entities.AD;
using DMS.CORE.Entities.BU;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DMS.BUSINESS.Services.BU
{
    public interface IOpinionListService : IGenericService<tblBuOpinionList, OpinionListDto>
    {
        Task<OpinionListDto> BuildDataForTree();
        Task UpdateOrderTree(OpinionListDto moduleDto);
        new Task<OpinionListDto> Delete(object code);
        Task<IList<OpinionListDto>> GetAll(BaseFilter filter);
    }
    public class OpinionListService(AppDbContext dbContext, IMapper mapper) : GenericService<tblBuOpinionList, OpinionListDto>(dbContext, mapper), IOpinionListService
    {
        //public OpinionListService(AppDbContext dbContext, IMapper mapper) : base(dbContext, mapper)
        //{
        //}
        public async Task<OpinionListDto> BuildDataForTree()
        {
            var lstNode = new List<OpinionListDto>();
            var rootNode = new OpinionListDto() { Id = "OPL", PId = "-", Name = "Danh Mục Ý Kiến", Title = "OPL. DANH MỤC Ý KIẾN", Key = "OPL" };
            lstNode.Add(rootNode);
            var lstAllOpinion = (await this.GetAll()).OrderBy(x => x.OrderNumber).ToList();
            foreach (var Opinion in lstAllOpinion)
            {
                var node = new OpinionListDto()
                {
                    Id = Opinion.Id,
                    Name = Opinion.Name,
                    PId = Opinion.PId,
                    OrderNumber = Opinion.OrderNumber,
                    Title = $"{Opinion.Id} _ {Opinion.Name}",
                    IsChecked = Opinion.IsChecked,
                    Key = Opinion.Id
                };
                lstNode.Add(node);
            }
            var nodeDict = lstNode.ToDictionary(n => n.Id);
            foreach (var item in lstNode)
            {
                if (item.PId == "-" || !nodeDict.TryGetValue(item.PId, out OpinionListDto parentNode))
                {
                    continue;
                }
                if (parentNode.Children == null)
                {
                    parentNode.Children = new List<OpinionListDto>();
                }
                parentNode.Children.Add(item);
            }
            return rootNode;
        }
        public async Task UpdateOrderTree(OpinionListDto moduleDto)
        {
            try
            {
                var lstModuleDto = new List<OpinionListDto>();
                var lstModuleUpdate = new List<tblBuOpinionList>();

                this.ConvertNestedToList(moduleDto, ref lstModuleDto);
                if (moduleDto.Children == null || moduleDto.Children.Count == 0)
                {
                    return;
                }
                var numberOrder = 1;
                foreach (var item in lstModuleDto)
                {
                    var module = _mapper.Map<tblBuOpinionList>(item);
                    module.OrderNumber = numberOrder++;
                    lstModuleUpdate.Add(module);
                }
                this._dbContext.UpdateRange(lstModuleUpdate);
                await this._dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                this.Status = false;
                this.Exception = ex;
            }
        }

        private void ConvertNestedToList(OpinionListDto node, ref List<OpinionListDto> lstNodeFlat)
        {
            if (node.Id != "OPL")
            {
                lstNodeFlat.Add(node);
            }
            if (node.Children != null && node.Children.Count > 0)
            {
                foreach (var item in node.Children)
                {
                    ConvertNestedToList(item, ref lstNodeFlat);
                }
            }
        }
        public override Task<OpinionListDto> Add(IDto dto)
        {
            var model = dto as OpinionListDto;
            if (string.IsNullOrWhiteSpace(model.PId))
            {
                model.PId = "OPL";
            }
            return base.Add(dto);
        }

        public async new Task<OpinionListDto> Delete(object code)
        {
            try
            {
                var codeString = code.ToString();
                var query = _dbContext.Set<tblBuOpinionList>().AsQueryable();
                query = query.Where(x => x.PId == codeString);
                var recordWithSamePid = await query.ToListAsync();
                if( recordWithSamePid.Count == 0)
                {
                    var recordToDelete = await _dbContext.Set<tblBuOpinionList>().FirstOrDefaultAsync(x => x.Id == codeString);
                    if(recordToDelete != null )
                    {
                        _dbContext.Remove(recordToDelete);
                        await _dbContext.SaveChangesAsync();
                    }
                    return _mapper.Map<OpinionListDto>(recordToDelete);
                }
                return null;
            }
            catch (Exception ex)
            {
                this.Status = false;
                this.Exception = ex;
                return null;
            }
        }
        public async Task<IList<OpinionListDto>> GetAll(BaseFilter filter)
        {
            try
            {
                var query = this._dbContext.TblBuOpinionLists.AsQueryable();
                if (filter.IsActive.HasValue) 
                {
                  query = query.Where(x => x.IsActive == filter.IsActive);
                }
                query = query.OrderByDescending(x => x.CreateDate);
                return _mapper.Map<IList<OpinionListDto>>(await query.ToListAsync());
            }
            catch (Exception ex)
            {
                this.Status = false;
                this.Exception = ex;
                return null;
            }
        }
    }
}

