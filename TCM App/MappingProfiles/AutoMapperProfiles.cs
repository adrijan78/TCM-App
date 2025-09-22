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

            CreateMap<Note, NoteDto>()
                .ForMember(d=>d.ToMemberFullName,o=>o.MapFrom(s=>s.ToMember.FirstName + " "+ s.ToMember.LastName));
            CreateMap<AddNoteDto, Note>();

            CreateMap<AppRole,RoleDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));

            CreateMap<Belt, BeltDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.BeltName))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));

            CreateMap<UpdateMemberBeltDto, MemberBelt>()
                .ForMember(d=>d.DateReceived, o=>o.MapFrom(s=>s.EarnedOn));
            CreateMap<MemberBelt, UpdateMemberBeltDto>()
                .ForMember(d=>d.Name,o=>o.MapFrom(s=>s.Belt.BeltName))
                .ForMember(d=>d.EarnedOn,o=>o.MapFrom(s=>s.DateReceived));

            CreateMap<Payments, PaymentsDto>()
                .ForMember(d => d.PaymentDate, o => o.MapFrom(s => s.PaymentDate))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.IsPaidOnline, o => o.MapFrom(s => s.IsPaidOnline))
                .ForMember(d => d.MemberName, o => o.MapFrom(s => s.Member.FirstName + " "+ s.Member.LastName));

            CreateMap<UpdateTrainingDto, Training>()
                .ForMember(d => d.MemberTrainings, o => o.Ignore())
                .ForMember(d => d.Status, o => o.MapFrom(s => (int)s.Status))
                .ForMember(d => d.TrainingType, o => o.MapFrom(s => s.TrainingType));


            CreateMap<Training, TrainingEditDto>()
                .ForMember(d => d.Status, o => o.MapFrom(s => (TrainingStatusesEnum)s.Status))
                .ForMember(d => d.TrainingType, o => o.MapFrom(s => s.TrainingType))
                .ForMember(d => d.MembersToAttend, o => o.MapFrom(s => s.MemberTrainings.Select(mt => new MemberTrainingSimpleDto
                {
                    Id = mt.MemberId,
                   
                }).ToList()));

        }

    }
}
