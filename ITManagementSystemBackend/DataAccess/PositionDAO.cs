using BusinessObject;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PositionDAO
    {
        public static List<Position> GetPositions()
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Positions.Include(s => s.Contracts).ToList();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static Position FindPositionById(int positionId)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Positions.Include(s => s.Contracts)
                        .SingleOrDefault(c => c.Id == positionId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Position FindPositionByName(string name)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    return context.Positions.Include(s => s.Contracts)
                        .SingleOrDefault(c => c.PositionName == name);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void SavePosition(Position position)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    context.Positions.Add(position);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void UpdatePosition(Position position)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    context.Entry(position).State = EntityState.Modified;
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void DeletePosition(Position position)
        {
            try
            {
                using (var context = new MyDbContext())
                {
                    var positionToDelete = context
                        .Positions
                        .SingleOrDefault(c => c.Id == position.Id);
                    context.Positions.Remove(positionToDelete);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
