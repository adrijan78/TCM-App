using System.ComponentModel;
using System.Reflection;

namespace TCM_App.Helpers
{
    public static class EnumHelper
    {
        public static string GetDescription(this Enum value) {

            FieldInfo field = value.GetType().GetField(value.ToString());
            DescriptionAttribute attribute = (DescriptionAttribute)Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));
            return attribute == null ? value.ToString() : attribute.Description;
        }
    }
}
