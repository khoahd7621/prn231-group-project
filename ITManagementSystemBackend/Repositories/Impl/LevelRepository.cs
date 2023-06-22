using BusinessObject;
using DataAccess;

namespace Repositories.Impl
{
    public class LevelRepository : ILevelRepository
    {
        public void SaveLevel(Level level) => LevelDAO.SaveLevel(level);

        public Level GetLevelById(int id) => LevelDAO.FindLevelById(id);

        public Level GetLevelByName(string name) => LevelDAO.FindLevelByName(name);

        public List<Level> GetLevels() => LevelDAO.GetLevels();

        public void UpdateLevel(Level level) => LevelDAO.UpdateLevel(level);

        public void DeleteLevel(Level level) => LevelDAO.DeleteLevel(level);
    }
}
