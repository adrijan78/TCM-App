using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using TCM_App.EmailService;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TCM_App.Services
{
    public class MemberService(IMemberRepository _memberRepository, IFirebaseStorageService
        _firebaseStorageService, IRepository<Photo> _photoRepository,
        IRepository<MemberBelt> _memberBeltRepository,
        IRepository<Payments> _paymentsRepository,
        IEmailService _emailService,
        IMapper mapper) : IMemberService
    {
        public Task<Member> AddMember(Member member)
        {
            var existingMember = _memberRepository.CheckIfMemberExists(member.Id);
            if (existingMember)
            {
                throw new Exception("Member already exists!");
            }

            //Implement AutoMapper or manual mapping here if needed

            return null;

        }

        public Task DeactivateMember(int memberId)
        {
            return _memberRepository.DeactivateMember(memberId);
        }

        public Task DeleteMember(Member member)
        {
            throw new NotImplementedException();
        }

        public async Task<Member> GetMember(int id)
        {
            var member = await _memberRepository.GetMemberById(id);
            if (member == null)
            {
                throw new Exception("Member not found!");
            }
            return member;
        }

        public async Task<PagedList<MemberTrainingDto>> GetMemberAttendanceAndPerformance(int memberId, UserParams userParams)
        {
            if (!CheckIfMemberExists(memberId))
            {
                throw new Exception("Member not found!");
            }
            return await _memberRepository.GetMemberAttendanceAndPerformance(memberId, userParams);

        }

        public async Task UpdateMemberAttendanceAndPerformace(List<UpdateMemberTrainingDto> memberTrainingDtos, bool isCoach)
        {

            await _memberRepository.UpdateMemberAttendanceAndPerformace(memberTrainingDtos,isCoach);


        }

        public async Task<PagedList<MemberListDto>> GetMembers(int id, UserParams userParams)
        {
            return await _memberRepository.GetMembersByClubId(id, userParams);
        }

        public Task<Dictionary<int, List<MemberDropdownDto>>> GetMembersGroupedByBelt()
        {
            return _memberRepository.GetMembersGroupedByBelt();
        }

        public async Task UpdateMember(int id, MemberEditDto memberDto)
        {
            var member = await _memberRepository.GetMemberById(id);
            if (member == null)
            {
                throw new Exception("Member not found!");
            }



            if (memberDto.NewPhoto != null)
            {

                var result = await _firebaseStorageService.UploadAvatarFileAsync(memberDto.NewPhoto, id);

                if (result != null && result.Length > 0)
                {
                    var existingPhoto = member.ProfilePicture ?? null;
                    if (existingPhoto != null)
                    {
                        existingPhoto.Url = result;

                    }
                    else
                    {

                        var photo = new Photo
                        {
                            Url = result,
                            PublicId = id.ToString(),
                            MemberId = id,
                            Member = member
                        };

                        await _photoRepository.AddAsync(photo);
                        existingPhoto = _photoRepository.Query().FirstOrDefault(x => x.MemberId == id);
                    }

                }

                else
                {
                    throw new Exception("Failed to upload profile picture.");
                }


            }
            member.FirstName = memberDto.FirstName;
            member.LastName = memberDto.LastName;
            member.DateOfBirth = memberDto.DateOfBirth.AddDays(1);
            member.Height = memberDto.Height;
            member.Weight = memberDto.Weight;
            member.IsActive = memberDto.IsActive.HasValue ? memberDto.IsActive.Value : false;
            member.IsCoach = memberDto.IsCoach.HasValue ? memberDto.IsCoach.Value : false;

            var existingBelt = _memberBeltRepository.Query().Where(x => x.MemberId == id && x.IsCurrentBelt).FirstOrDefault();
            if (existingBelt == null || (existingBelt != null && existingBelt.BeltId != memberDto.CurrentBeltId))
            {
                if (existingBelt != null)
                    //Set existing belt to not current
                    existingBelt.IsCurrentBelt = false;

                //Add new belt if it doesn't exist
                var memberBelt = new MemberBelt
                {
                    MemberId = id,
                    BeltId = memberDto.CurrentBeltId,
                    IsCurrentBelt = true,
                    DateReceived = DateTime.Now,
                    Description = ""
                };
                await _memberBeltRepository.AddAsync(memberBelt);


            }



            _memberRepository.UpdateAsync(member);

            await _memberBeltRepository.SaveChangesAsync();
            await _memberRepository.SaveChangesAsync();
        }

        private bool CheckIfMemberExists(int memberId)
        {
            return _memberRepository.CheckIfMemberExists(memberId);
        }

        public Task<List<UpdateMemberBeltDto>> GetMemberBelts(int id)
        {
            var belts = _memberBeltRepository.Query()
               .Include(x => x.Belt)
               .Where(x => x.MemberId == id)
               .OrderByDescending(x => x.DateReceived)
               .ToList();

            return Task.FromResult(mapper.Map<List<UpdateMemberBeltDto>>(belts));
        }

        public async Task<int> AddBeltExamForMember(UpdateMemberBeltDto memberBelt)
        {
            var member = _memberRepository.Query().FirstOrDefault(x => x.Id == memberBelt.MemberId);
            if (member == null)
            {
                throw new Exception("Member not found");
            }

            var domain = mapper.Map<MemberBelt>(memberBelt);

            var existingCurrentBelt = await _memberBeltRepository.Query().Where(x => x.MemberId == memberBelt.MemberId && x.IsCurrentBelt).FirstOrDefaultAsync();
            if (existingCurrentBelt != null)
            {
                existingCurrentBelt.IsCurrentBelt = false;
                _memberBeltRepository.UpdateAsync(existingCurrentBelt);
            }

            await _memberBeltRepository.AddAsync(domain);
            await _memberBeltRepository.SaveChangesAsync();

            _emailService.SendEmailAsync(new SendEmailRequest
            {
                Recipient = member.Email!,
                Subject = "Нов појас",
                MessageBody = $"Честитки. Успешно го положивте полагањето за појас. Појасот ќе биде додаден на вашиот профил"
            });


            return domain.Id;

        }

        public async Task<IActionResult> DeleteBeltExamForMember(int id)
        {
            var memberBelt = await _memberBeltRepository.GetByIdAsync(id);
            if (memberBelt == null)
            {
                throw new Exception("Member belt exam not found");
            }

            var previousBelt = await _memberBeltRepository.Query()
                .Where(x => x.MemberId == memberBelt.MemberId && x.Id != memberBelt.Id)
                .OrderByDescending(x => x.DateReceived)
                .FirstOrDefaultAsync();
            if (previousBelt != null && memberBelt.IsCurrentBelt)
            {
                previousBelt.IsCurrentBelt = true;
                _memberBeltRepository.UpdateAsync(previousBelt);
            }

            _memberBeltRepository.DeleteAsync(memberBelt);
            await _memberBeltRepository.SaveChangesAsync();
            return new OkObjectResult(new ApiResponse<string>
            {
                Success = true,
                Message = "Успешно избришан појас"
            });

        }

        public async Task<PagedList<PaymentsDto>> GetMemberPayments(int id, BaseParams paymentParams)
        {

            if (!CheckIfMemberExists(id))
            {
                throw new Exception("Членот не е пронајден");
            }

            var payments = _paymentsRepository.Query().Where(x => x.MemberId == id).OrderByDescending(x => x.PaymentDate);

            return await PagedList<PaymentsDto>.CreateAsync(payments.ProjectTo<PaymentsDto>(mapper.ConfigurationProvider), paymentParams.PageNumber, paymentParams.PageSize); ;


        }

        public Task<PagedList<PaymentsDto>> GetMembersPayments(PaymentParams paymentParams)
        {
            var query = _paymentsRepository.Query().Include(x => x.Member).ThenInclude(x => x.ProfilePicture).AsQueryable();

            query = query.Where(x => x.IsPaidOnline == paymentParams.PaymentType);

            if (paymentParams.PaymentMonth.HasValue)
            {
                query = query.Where(x => x.PaymentDate.Month == paymentParams.PaymentMonth.Value);
            }
            if (paymentParams.PaymentYear.HasValue)
            {
                query = query.Where(x => x.PaymentDate.Year == paymentParams.PaymentYear.Value);
            }
            if (paymentParams.MemberId.HasValue)
            {
                query = query.Where(x => x.MemberId == paymentParams.MemberId.Value);
            }

            query = query.OrderByDescending(x => x.PaymentDate);
            return PagedList<PaymentsDto>.CreateAsync(query.ProjectTo<PaymentsDto>(mapper.ConfigurationProvider), paymentParams.PageNumber, paymentParams.PageSize);
        }

        public async Task<int> DeleteMemberPayment(int paymentId)
        {
            var existingPayment = await _paymentsRepository.Query().FirstOrDefaultAsync(x => x.Id == paymentId);
            if (existingPayment != null)
            {
                 _paymentsRepository.DeleteAsync(existingPayment);

                 await _paymentsRepository.SaveChangesAsync();

                return existingPayment.Id;

            }
            else
            {
                throw new Exception("Записот за платена членарина не беше пронајден");
            }

        }
    }
}
