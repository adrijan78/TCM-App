using TCM_App.Models.Enums;

namespace TCM_App.Helpers
{
    
    public class BaseParams
    {
        private const int MaxPageSize = 50;
        public string? SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 5;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
    
    
    public class UserParams:BaseParams
    {
        

        public string? Belt { get; set; }

        public int? MemberAgeCategorie { get; set; }
        

    }

    public class TrainingParams:BaseParams
    {
        public int? TrainingType { get; set; }
        public int? TrainingMonth { get; set; }

    }
}
