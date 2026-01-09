import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
// Importamos app DESPUÉS de los mocks (aunque el hoisting lo maneja, es buena práctica visual)
import app from '../app';

// 1. HOISTING: Definimos los mocks ANTES de todo
// Esto se ejecuta antes que los imports y los vi.mock
const mocks = vi.hoisted(() => {
  // Helpers para simular el encadenamiento db.update().set().where()
  const whereFn = vi.fn();
  const setFn = vi.fn(() => ({ where: whereFn }));
  const updateFn = vi.fn(() => ({ set: setFn }));

  return {
    mockDb: {
      query: {
        member: { findFirst: vi.fn() },
        task: { findFirst: vi.fn() },
      },
      update: updateFn,
      // Simulamos transacción ejecutando el callback inmediatamente
      transaction: vi.fn(async (callback) => await callback({ update: updateFn })),
    },
    // Exponemos las funciones internas para poder hacer 'expect' luego
    spies: { updateFn, setFn, whereFn }
  };
});

// 2. MOCK FACTORIES: Usamos las variables hoisted
vi.mock('../db', () => ({
  db: mocks.mockDb
}));

vi.mock('../middleware/auth.middleware', () => ({
  requireAuth: (req: any, res: any, next: any) => {
    // Leemos el usuario desde un header falso para el test
    const mockUserHeader = req.headers['x-mock-user'];
    res.locals.user = mockUserHeader ? JSON.parse(mockUserHeader as string) : { id: 'default' };
    next();
  },
}));

// 3. LOS TESTS
describe('PATCH /api/tasks/:taskId/status', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería bloquear a un HIJO intentando modificar tarea de OTRO', async () => {
    const mockHijo2 = { id: 'user-hijo-2' };
    const mockMemberHijo2 = { userId: 'user-hijo-2', familyId: 'fam-1', role: 'CHILD' };
    
    // Tarea que pertenece al Hijo 1
    const mockTaskDeHijo1 = { 
      id: 'task-1', 
      familyId: 'fam-1', 
      assignedToId: 'user-hijo-1', 
      status: 'PENDING' 
    };

    // Configuramos qué devuelve la DB
    mocks.mockDb.query.member.findFirst.mockResolvedValue(mockMemberHijo2);
    mocks.mockDb.query.task.findFirst.mockResolvedValue(mockTaskDeHijo1);

    const res = await request(app)
      .patch('/api/tasks/task-1/status')
      .set('x-mock-user', JSON.stringify(mockHijo2))
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/pertenece a otro/);
  });

  it('debería permitir a un HIJO tomar una tarea LIBRE', async () => {
    const mockHijo1 = { id: 'user-hijo-1' };
    const mockMemberHijo1 = { userId: 'user-hijo-1', familyId: 'fam-1', role: 'CHILD' };
    
    const mockTaskLibre = { 
      id: 'task-libre', 
      familyId: 'fam-1', 
      assignedToId: null, // Libre
      status: 'PENDING' 
    };

    mocks.mockDb.query.member.findFirst.mockResolvedValue(mockMemberHijo1);
    mocks.mockDb.query.task.findFirst.mockResolvedValue(mockTaskLibre);

    const res = await request(app)
      .patch('/api/tasks/task-libre/status')
      .set('x-mock-user', JSON.stringify(mockHijo1))
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Verificamos que se llamó a la base de datos para actualizar
    expect(mocks.spies.updateFn).toHaveBeenCalled();
  });
});