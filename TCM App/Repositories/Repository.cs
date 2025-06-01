using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TCM_App.Data;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class Repository<T>( DataContext _context) : IRepository<T> where T : class
    {
        

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public void DeleteAsync(T entity)
        {
            _context.Set<T>().Remove(entity);
        }


        public async Task<List<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _context.Set<T>();

            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }
           return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
             await _context.SaveChangesAsync();
        }

        public void UpdateAsync(T entity)
        {
            _context.Set<T>().Update(entity);

        }
    }
}
