namespace TCM_App.Helpers
{
    public static class CalculateAgeHelper
    {
        public static int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth > today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}
