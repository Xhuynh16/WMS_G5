using AutoMapper;
using Common;
using DMS.BUSINESS.Common;
using DMS.BUSINESS.Dtos.MD;
using DMS.CORE.Entities.MD;
using DMS.CORE;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DMS.BUSINESS.Dtos.AD;
using DMS.BUSINESS.Dtos.BU;
using DMS.BUSINESS.Services.AD;
using DMS.BUSINESS.Services.BU;
using DMS.CORE.Entities.AD;

namespace DMS.BUSINESS.Services.MD
{
    public interface ITemplateOpinionService : IGenericService<TblMdTemplateOpinion, TemplateOpinionDto>
    {
        Task<IList<TemplateOpinionDto>> GetAll(BaseMdFilter filter);

        //Task<byte[]> Export(BaseMdFilter filter);
        Task<TemplateOpinionDetailDto> GetTemplateWithTree(string code);
    }
    public class TemplateOpinionService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdTemplateOpinion, TemplateOpinionDto>(dbContext, mapper), ITemplateOpinionService
    {

        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdTemplateOpinion.AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                    x.Name.Contains(filter.KeyWord) || x.Code.Contains(filter.KeyWord));
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

        public async Task<IList<TemplateOpinionDto>> GetAll(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.tblMdTemplateOpinion.AsQueryable();
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

        public async Task<TemplateOpinionDetailDto> GetTemplateWithTree(string Code)
        {
            var data = await _dbContext.tblMdTemplateOpinion.Include(x => x.ListTemplateOpinionData).FirstOrDefaultAsync(x => x.Code == Code as string);

            if (data == null) return null;

            var lstNodeOrg = new List<OrganizeDto>();
            var rootNodeOrg = new OrganizeDto() { Id = "ORG", PId = "-ORG", Name = "Danh Sách Các Đơn Vị", Title = "1.1_  STC", Key = "ORG" };
            lstNodeOrg.Add(rootNodeOrg);
            var lstNodeOpi = new List<OpinionListDto>();
            var rootNodeOpi = new OpinionListDto() { Id = "OPL", PId = "-", Name = "Danh Mục Ý Kiến", Title = "OPL. DANH MỤC Ý KIẾN", Key = "OPL" };
            lstNodeOpi.Add(rootNodeOpi);
            var lstAllOpinionList = await _dbContext.TblBuOpinionLists
                                                   .Where(x => x.Id != "OPL")
                                                   .OrderBy(x => x.OrderNumber)
                                                   .ToListAsync();
            var lstAllOrganize = await _dbContext.tblAdOrganize
                                                    .Where(x => x.Id != "ORG")
                                                    .OrderBy(x => x.OrderNumber)
                                                    .ToListAsync();
            var lstOpinionInTemplate = data.ListTemplateOpinionData
                .Select(x => x.OpinionCode)
                .ToList();
            var lstOrganizeInTemplate = data.ListTemplateOpinionData
                .Select(x => x.OrgCode)
                .ToList();

            if (data.ListTemplateOpinionData.Count > 0)
            {
                rootNodeOrg.IsChecked = true;
                rootNodeOpi.IsChecked = true;
            }
            foreach (var tem in lstAllOrganize)
            {
                var nodeOrg = new OrganizeDto()
                {
                    Id = tem.Id,
                    Name = tem.Name,
                    PId = tem.PId,
                    OrderNumber = tem.OrderNumber,
                    Title = $"{tem.Id}_{tem.Name}",
                    Key = tem.Id
                };
                if (lstOrganizeInTemplate.Contains(tem.Id))
                {
                    nodeOrg.IsChecked = true;
                }
                lstNodeOrg.Add(nodeOrg);
            }

            var nodeDict = lstNodeOrg.ToDictionary(n => n.Id);
            foreach (var item in lstNodeOrg)
            {
                if (item.PId == "-ORG" || !nodeDict.TryGetValue(item.PId, out OrganizeDto parentNode))
                {
                    continue;
                }

                parentNode.Children ??= new List<OrganizeDto>();
                parentNode.Children.Add(item);
            }
            foreach (var tem in lstAllOpinionList)
            {
                var nodeOpi = new OpinionListDto()
                {
                    Id = tem.Id,
                    Name = tem.Name,
                    PId = tem.PId,
                    OrderNumber = tem.OrderNumber,
                    Title = $"{tem.Id} _ {tem.Name}",
                    Key = tem.Id
                };
                if (lstOpinionInTemplate.Contains(tem.Id) && lstOrganizeInTemplate.Contains(tem.PId))
                {
                    nodeOpi.IsChecked = true;
                }
                lstNodeOpi.Add(nodeOpi);
            }

            var nodeDictOpi = lstNodeOpi.ToDictionary(n => n.Id);
            foreach (var item in lstNodeOpi)
            {
                if (item.PId == "-" || !nodeDictOpi.TryGetValue(item.PId, out OpinionListDto parentNode))
                {
                    continue;
                }

                parentNode.Children ??= new List<OpinionListDto>();
                parentNode.Children.Add(item);
            }
            foreach (var organize in lstNodeOrg)
            {
                if (organize.Children != null)
                {
                    foreach (var child in organize.Children)
                    {
                        var flatOpinionList = lstNodeOpi.Select(opi => new OpinionListDto
                        {
                            Id = opi.Id,
                            Name = opi.Name,
                            PId = opi.PId,
                            OrderNumber = opi.OrderNumber,
                            Title = opi.Title,
                            Key = opi.Key,
                            IsChecked = data.ListTemplateOpinionData.Any(x => x.OrgCode == child.Id && x.OpinionCode == opi.Id)
                        }).ToList();
                        child.TreeOpinionList = new List<OpinionListDto> { BuildOpinionTree(flatOpinionList) };

                    }
                }
            }


            var result = _mapper.Map<TemplateOpinionDetailDto>(data);
            result.TreeOrgannize = rootNodeOrg;
            result.TreeOpinionList = rootNodeOpi;
            return result;
        }
        private OpinionListDto BuildOpinionTree(List<OpinionListDto> flatList, string parentId = "OPL")
        {
            var root = flatList.FirstOrDefault(x => x.Id == parentId);
            if (root == null) return null;

            root.Children = flatList
                .Where(x => x.PId == root.Id)
                .Select(child => BuildOpinionTree(flatList, child.Id))
                .ToList();

            return root;
        }
    }

}
