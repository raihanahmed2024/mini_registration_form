using MongoDB.Bson;
using MongoDB.Driver;
using RegistrationApi.Models;
using RegistrationApi.Settings;

namespace RegistrationApi.Services
{
    public class RegistrationService
    {
        private readonly IMongoCollection<Registration> _collection;

        public RegistrationService(MongoDbSettings settings)
        {
            if (settings == null)
                throw new ArgumentNullException(nameof(settings));
            if (string.IsNullOrEmpty(settings.ConnectionString))
                throw new InvalidOperationException("MongoDB ConnectionString is not configured");
            if (string.IsNullOrEmpty(settings.DatabaseName))
                throw new InvalidOperationException("MongoDB DatabaseName is not configured");

            try
            {
                var client = new MongoClient(settings.ConnectionString);
                var database = client.GetDatabase(settings.DatabaseName);
                _collection = database.GetCollection<Registration>(settings.CollectionName);
                
                // Verify connection by pinging the server
                var pingResult = database.RunCommandAsync((Command<BsonDocument>)"{ ping: 1 }").GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Failed to connect to MongoDB at '{settings.ConnectionString}'. " +
                    $"Make sure MongoDB is running and accessible. Error: {ex.Message}", ex);
            }
        }

        public async Task<List<Registration>> GetAsync()
        {
            return await _collection
                .Find(_ => true)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Registration> CreateAsync(Registration registration)
        {
            await _collection.InsertOneAsync(registration);
            return registration;
        }

        public async Task<Registration?> GetByIdAsync(string id)
        {
            return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(string id, Registration updatedRegistration)
        {
            await _collection.ReplaceOneAsync(x => x.Id == id, updatedRegistration);
        }

        public async Task DeleteAsync(string id)
        {
            await _collection.DeleteOneAsync(x => x.Id == id);
        }
    }
}