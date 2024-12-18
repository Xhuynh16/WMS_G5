﻿using AutoMapper;
using Common;
using DMS.CORE.Entities.BU;

namespace DMS.BUSINESS.Dtos.BU
{
    public class ModuleAttachmentDto : IMapFrom, IDto
    {
        public int Id { get; set; }

        public Guid ReferenceId { get; set; }

        public string ModuleType { get; set; }

        public int AttachmentId { get; set; }

        public virtual AttachmentDto Attachment { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblCmModuleAttachment, ModuleAttachmentDto>().ReverseMap();
        }
    }
}
