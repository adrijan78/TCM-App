namespace TCM_App.Services.Interfaces
{
    public interface IFirebaseStorageService
    {
        public void GetAllPhotoUris();
        public Task<string> UploadAvatarFileAsync(IFormFile file, int userId);
    }
}
