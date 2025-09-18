namespace TCM_App.Models.DTOs
{
    public class ClubNumbersInfoDto
    {
        public int NumberOfMembers { get; set; }
        public int NumberOfTrainings { get; set; }
        public double Attendance { get; set; }
        public DateTime? NextTraining { get; set; }



    }
}
