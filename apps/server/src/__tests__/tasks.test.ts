import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
// Importamos app DESPUÉS de los mocks (aunque el hoisting lo maneja, es buena práctica visual)
import app from '../app.js';

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
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      familyId: 'fam-1',
      assignedToId: 'user-hijo-1',
      status: 'PENDING'
    };

    // Configuramos qué devuelve la DB
    mocks.mockDb.query.member.findFirst.mockResolvedValue(mockMemberHijo2);
    mocks.mockDb.query.task.findFirst.mockResolvedValue(mockTaskDeHijo1);

    const res = await request(app)
      .patch('/api/tasks/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d/status')
      .set('x-mock-user', JSON.stringify(mockHijo2))
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/pertenece a otro/);
  });

  it('debería permitir a un HIJO tomar una tarea LIBRE', async () => {
    const mockHijo1 = { id: 'user-hijo-1' };
    const mockMemberHijo1 = { userId: 'user-hijo-1', familyId: 'fam-1', role: 'CHILD' };

    const mockTaskLibre = {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      familyId: 'fam-1',
      assignedToId: null, // Libre
      status: 'PENDING'
    };

    mocks.mockDb.query.member.findFirst.mockResolvedValue(mockMemberHijo1);
    mocks.mockDb.query.task.findFirst.mockResolvedValue(mockTaskLibre);

    const res = await request(app)
      .patch('/api/tasks/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/status')
      .set('x-mock-user', JSON.stringify(mockHijo1))
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verificamos que se llamó a la base de datos para actualizar
    expect(mocks.spies.updateFn).toHaveBeenCalled();
  });

  it('debería asignar la tarea al HIJO cuando la marca como REVIEW directamente', async () => {
    const mockHijo1 = { id: 'user-hijo-1' };
    const mockMemberHijo1 = { userId: 'user-hijo-1', familyId: 'fam-1', role: 'CHILD' };

    const mockTaskLibre = {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      familyId: 'fam-1',
      assignedToId: null,
      status: 'PENDING'
    };

    mocks.mockDb.query.member.findFirst.mockResolvedValue(mockMemberHijo1);
    mocks.mockDb.query.task.findFirst.mockResolvedValue(mockTaskLibre);

    const res = await request(app)
      .patch('/api/tasks/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/status')
      .set('x-mock-user', JSON.stringify(mockHijo1))
      .send({ status: 'REVIEW' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(mocks.spies.setFn).toHaveBeenCalledWith({
      status: 'REVIEW',
      assignedToId: 'user-hijo-1'
    });
  });
});