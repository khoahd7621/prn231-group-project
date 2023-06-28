using System.Linq.Expressions;

namespace Repositories
{
    public interface IEntityRepository<TEntity> where TEntity : class, new()
    {
        TEntity Get(Expression<Func<TEntity, bool>> filter);
        Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter);
        TEntity GetById(int id);
        Task<TEntity> GetByIdAsync(int id);
        TEntity Add(TEntity entity);
        Task<TEntity> AddAsync(TEntity entity);
        IEnumerable<TEntity> AddRange(IEnumerable<TEntity> entities);
        Task<IEnumerable<TEntity>> AddRangeAsync(IEnumerable<TEntity> entities);
        void Update(TEntity entity);
        void UpdateRange(IEnumerable<TEntity> entities);
        Task UpdateAsync(TEntity entity);
        Task UpdateRangeAsync(IEnumerable<TEntity> entities);
        void Remove(TEntity entity);
        void RemoveRange(IEnumerable<TEntity> entities);
        Task RemoveAsync(TEntity entity);
        Task RemoveRangeAsync(IEnumerable<TEntity> entities);
        int Count();
        Task<int> CountAsync();
        ICollection<TEntity> GetAll(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, ICollection<TEntity>> options = null,
            string includeProperties = null
        );
        TEntity GetFirstOrDefault(
            Expression<Func<TEntity, bool>> filter = null,
            string includeProperties = null
        );
        Task<ICollection<TEntity>> GetAllAsync(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, ICollection<TEntity>> options = null,
            string includeProperties = null
        );
        Task<TEntity> GetFirstOrDefaultAsync(
            Expression<Func<TEntity, bool>> filter = null,
            string includeProperties = null
        );
    }
}
