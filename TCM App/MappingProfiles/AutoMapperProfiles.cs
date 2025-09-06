using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;

namespace TCM_App.MappingProfiles
{
    public class AutoMapperProfiles:AutoMapper.Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Member, MemberDto>()
                .ForMember(d => d.Age, o => o.MapFrom(s => CalculateAgeHelper.CalculateAge(s.DateOfBirth)))
                .ForMember(d => d.Belts, o => o.MapFrom(s => s.Belts))
                .ForMember(d => d.CurrentBelt, o => o.MapFrom(s => s.Belts.MaxBy(x => x.DateReceived)))
                .ForMember(d => d.MemberRoles, o => o.MapFrom(s => s.MemberRoles
                .Select(x => new MemberRoleDto { Id = x.RoleId, RoleName = x.Role != null ? x.Role.Name : "" })));



            CreateMap<MemberRegisterDto, Member>()
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Email));

            CreateMap<MemberEditDto, Member>()
                .ForMember(d => d.ProfilePicture, o => o.Ignore());


            CreateMap<Member, MemberSimpleDto>()
                //.ForMember(d => d.Age, o => o.MapFrom(s => CalculateAgeHelper.CalculateAge(s.DateOfBirth)))
                //.ForMember(d => d.Roles, o => o.MapFrom(s => s.MemberRoles.Select(x => new MemberRoleDto { Id = x.RoleId, RoleName = x.Role != null ? x.Role.Name : "" })));
            ;


            CreateMap<Member, MemberListDto>()
                .ForMember(d => d.Age, o => o.MapFrom(s => CalculateAgeHelper.CalculateAge(s.DateOfBirth)))
                .ForMember(d => d.Belt, o => o.MapFrom(s => s.Belts.OrderByDescending(b=>b.DateReceived).Select(x=>new BeltDto { Id=x.BeltId,Name=x.Belt.BeltName,EarnedOn=x.DateReceived}).FirstOrDefault()))
                .ForMember(d => d.Roles, o => o.MapFrom(s => s.MemberRoles.Select(x => new MemberRoleDto { Id = x.RoleId, RoleName = x.Role != null ? x.Role.Name : "" })));

            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberBelt, BeltDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Belt.BeltName))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.BeltId))
                .ForMember(d =>d.EarnedOn,o=> o.MapFrom(s=>s.DateReceived));
            CreateMap<MemberTraining, MemberTrainingDto>();
            CreateMap<Training, TrainingDto>()
                .ForMember(d=>d.TrainingType, o=> o.MapFrom(s=>s.TrainingType.GetDescription()))
                .ForMember(d => d.Status, o => o.MapFrom(s => ((TrainingStatusesEnum)s.Status).GetDescription()));
                

            CreateMap<Training, TrainingDetailsDto>()
                .ForMember(d => d.TrainingType, o => o.MapFrom(s => s.TrainingType.GetDescription()))
                .ForMember(d => d.Status, o => o.MapFrom(s => ((TrainingStatusesEnum)s.Status).GetDescription()))
                .ForMember(d=>d.MemberTrainings,o=>o.MapFrom(s=>s.MemberTrainings));

            CreateMap<CreateTrainingDto, Training>()
                .ForMember(d => d.MemberTrainings, o => o.Ignore())
                .ForMember(d => d.Status, o => o.MapFrom(s => (int)s.Status))
                .ForMember(d => d.TrainingType, o => o.MapFrom(s => s.TrainingType));

            CreateMap<Note, NoteDto>();
            CreateMap<AddNoteDto, Note>();

            CreateMap<AppRole,RoleDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));

            CreateMap<Belt, BeltDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.BeltName))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));

        }

    }
}
