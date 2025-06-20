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
                .ForMember(d=>d.Age,o=>o.MapFrom(s=>CalculateAgeHelper.CalculateAge(s.DateOfBirth)))
                .ForMember(d=>d.Belts,o=>o.MapFrom(s=>s.Belts))
                .ForMember(d=>d.CurrentBelt,o=>o.MapFrom(s=> s.Belts.MaxBy(x => x.DateReceived)));
            CreateMap<Member, MemberListDto>()
                .ForMember(d => d.Age, o => o.MapFrom(s => CalculateAgeHelper.CalculateAge(s.DateOfBirth)))
                .ForMember(d => d.Belt, o => o.MapFrom(s => s.Belts.MaxBy(x=>x.DateReceived)));

            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberBelt, BeltDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Belt.BeltName))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.BeltId))
                .ForMember(d =>d.EarnedOn,o=> o.MapFrom(s=>s.DateReceived));
            CreateMap<MemberTraining, MemberTrainingDto>();
            CreateMap<Training, TrainingDto>()
                .ForMember(d=>d.TrainingType, o=> o.MapFrom(s=>s.TrainingType.GetDescription()));
                
        }

    }
}
