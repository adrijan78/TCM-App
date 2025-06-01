using TCM_App.Data;
using TCM_App.Models;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class NoteRepository(DataContext _context) : Repository<Note>(_context), INoteRepository
    {
    }
}
