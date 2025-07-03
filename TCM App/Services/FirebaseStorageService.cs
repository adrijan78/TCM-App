using Google.Cloud.Storage.V1;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class FirebaseStorageService : IFirebaseStorageService
    {
        private const string ProjectName = "tcmapp-1902";
        private const string BucketName = $"{ProjectName}.firebasestorage.app";
        private readonly StorageClient _storageClient;

        public FirebaseStorageService(StorageClient storageClient)
        {
            _storageClient = storageClient; 
        }

        public void GetAllPhotoUris()
        {
            throw new NotImplementedException();
        }

        public async Task<string> UploadAvatarFileAsync(IFormFile file,int userId)
        {
            
            var fileName = $"avatars/{userId}/{Guid.NewGuid()}_{file.FileName}";

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            var storageObject = await _storageClient.UploadObjectAsync(
                BucketName,
                fileName,
                file.ContentType,
                stream);

            return $"https://firebasestorage.googleapis.com/v0/b/{BucketName}/o/{Uri.EscapeDataString(fileName)}?alt=media";

        }

    }
}
