using System.ComponentModel;

namespace TCM_App.Models.Enums
{
    public enum TrainingType
    {
        [Description("Регуларен тренинг")]
        Regular=1,
        [Description("Спаринг")]
        Sparing =2,
    }
}
