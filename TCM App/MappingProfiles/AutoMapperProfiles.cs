using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.MappingProfiles
{
    public class AutoMapperProfiles:AutoMapper.Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Member, MemberDto>()
                .ForMember(d=>d.Age,o=>o.MapFrom(s=>CalculateAgeHelper.CalculateAge(s.DateOfBirth)));
            CreateMap<Photo, PhotoDto>();
        }

    }
}
