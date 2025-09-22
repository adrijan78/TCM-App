using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TCM_App.EmailService;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class TrainingService(ITrainingRepository _trainingRepository,
        IMapper mapper,
        IMemberRepository _memberRepository,
        IEmailService _emailService) : ITrainingService
    {

        public async Task<string> AddTraining(CreateTrainingDto trainingDto)
        {
          var training = mapper.Map<Training>(trainingDto);
          foreach (var memberT in trainingDto.MembersToAttend)
          {

              if(memberT != null) {
                    var existingMember = await _memberRepository.GetMemberById(memberT.MemberId);

                    if (existingMember == null)
                    {
                        throw new Exception($"Членот не е пронајден");
                    }

                    if(existingMember.StartedOn > trainingDto.Date)
                    {
                        throw new Exception($"Членот {existingMember.FirstName} {existingMember.LastName} не може да присуствува на тренингот бидејќи е регистриран на {existingMember.StartedOn.ToUniversalTime().ToShortDateString()}");
                    }

                    var memberTraining = new MemberTraining
                    {
                        MemberId = memberT.MemberId,
                        TrainingId = training.Id,
                        Status = memberT.Status,
                        Date = training.Date,
                        Description = training.Description,
                    };
                    training.MemberTrainings.Add(memberTraining);
              }
              
          }
          var trainingId= await _trainingRepository.CreateTraining(training);

            if (trainingId != null) {

                var trainingLink = $"http://localhost:4200/trainings/{trainingId}";

                foreach (var memberT in trainingDto.MembersToAttend)
                {
                    if(memberT != null) { 
                        var existingMember = await _memberRepository.GetMemberById(memberT.MemberId);
                        if(existingMember != null)
                        {
                            var emailRequest = new SendEmailRequest
                            {
                                Recipient = existingMember.Email!,
                                Subject = "Нов тренинг",
                                MessageBody = $"Почитуван/а {existingMember.FirstName} {existingMember.LastName},<br/> Нов тренинг е закажан за вас на {training.Date.ToString("f")}.<br/>Опис: {training.Description}. " +
                                $"На следниот линк можете да го најавите вашето присуство/отсуство {trainingLink}"
                            };
                             _emailService.SendEmailAsync(emailRequest);
                        }
                    }
                }

            }

            return trainingId;





        }

        public async Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId,int year)
        {
           return await _trainingRepository.GetNumberOfTrainingsForEveryMonth(clubId,year);
        }

        public async Task<Dictionary<int, int>> GetNumberOfAttendedMemberTrainingsForEveryMonth(int clubId, int year, int memberId)
        {
            return await _trainingRepository.GetNumberOfAttendedMemberTrainingsForEveryMonth(clubId, year, memberId);
        }

        public async Task<TrainingDetailsDto> GetTraining(int trainingId, bool includeAllMembers, int? memberId = null)
        {
            var training = await _trainingRepository.GetTraining(trainingId, includeAllMembers, memberId);
            if (!includeAllMembers)
            {
            training.MemberTrainings = training.MemberTrainings?.Where(mt=> mt.MemberId == memberId).ToList();

            }

            return training;

        }

        public async Task<List<TrainingDetailsDto>> GetTrainingsForSpecificMonth(int month)
        {
            return await _trainingRepository.GetTrainingsForSpecificMonth(month);
        }

        public async Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams trainingParams)
        {
            return await _trainingRepository.GetTrainingsByClubId(clubId, trainingParams);
        }

        public async Task<TrainingEditDto> GetTrainingForUpdate(int id)
        {
           return await _trainingRepository.GetTrainingForUpdate(id);
        }

        public  Task<int> UpdateTraining(UpdateTrainingDto trainingDto)
        {

            var result=_trainingRepository.UpdateTraining(trainingDto);


            return result;
        }

        public async Task<int> DeleteTraining(int id)
        {
            var training= await _trainingRepository.GetByIdAsync(id);
            if(training == null)
            {
                throw new Exception($"Training with id {id} not found");
            }
            await _trainingRepository.DeleteTraining(training);

            return id;
        }
    }
}
