using System.ComponentModel;
using System.ComponentModel.Design;

namespace TCM_App.Models.Enums
{
    public enum TrainingStatusesEnum
    {
        [Description("Активен")]
        Active=1,
        [Description("Завршен")]
        Finished =2,
        [Description("Откажан")]
        Cancelled =3,
    }
}
