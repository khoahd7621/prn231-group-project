using BusinessObject;
using DataAccess;

namespace Repositories.Impl
{
    public class PositionRepository : IPositionRepository
    {
        public void SavePosition(Position position) => PositionDAO.SavePosition(position);

        public Position GetPositionById(int id) => PositionDAO.FindPositionById(id);

        public Position GetPositionByName(string name) => PositionDAO.FindPositionByName(name);

        public List<Position> GetPositions() => PositionDAO.GetPositions();

        public void UpdatePosition(Position position) => PositionDAO.UpdatePosition(position);

        public void DeletePosition(Position position) => PositionDAO.DeletePosition(position);
    }
}
