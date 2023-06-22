using BusinessObject;

namespace Repositories
{
    public interface ILevelRepository
    {
        void SaveLevel(Level level);
        Level GetLevelById(int id);
        Level GetLevelByName(string name);
        List<Level> GetLevels();
        void UpdateLevel(Level level);
        void DeleteLevel(Level level);
    }
}
