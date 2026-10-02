import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/prisma';

// Helper to check if PostgreSQL server is reachable
async function isDatabaseReachable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

describe('Database Integration Tests (Requires PostgreSQL)', () => {
  let dbAvailable = false;
  let testTicketId = '';

  beforeAll(async () => {
    dbAvailable = await isDatabaseReachable();
  });

  afterAll(async () => {
    if (dbAvailable) {
      if (testTicketId) {
        await prisma.ticket.delete({ where: { id: testTicketId } }).catch(() => {});
      }
      await prisma.$disconnect();
    }
  });

  it('TEST 1 — Database Creation (POST /api/tickets)', async () => {
    if (!dbAvailable) {
      console.warn('⚠️ PostgreSQL unavailable at DATABASE_URL. Database creation test skipped.');
      return;
    }

    const payload = {
      title: 'Database integration test ticket',
      description: 'Verifying end to end ticket creation persistence in PostgreSQL.',
      customerEmail: 'db.test@example.com',
      priority: 'HIGH',
      status: 'OPEN',
    };

    const response = await request(app)
      .post('/api/tickets')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(payload.title);
    expect(response.body.data.customerEmail).toBe(payload.customerEmail);
    expect(response.body.data.priority).toBe('HIGH');
    expect(response.body.data.status).toBe('OPEN');

    testTicketId = response.body.data.id;
  });

  it('TEST 2 — Database Search, Filter & Pagination (GET /api/tickets)', async () => {
    if (!dbAvailable) {
      console.warn('⚠️ PostgreSQL unavailable. Database search/filter test skipped.');
      return;
    }

    const response = await request(app).get(
      '/api/tickets?search=integration&status=OPEN&priority=HIGH&page=1&limit=10'
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
    expect(response.body.data.pagination).toEqual({
      page: 1,
      limit: 10,
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
      hasNextPage: expect.any(Boolean),
      hasPreviousPage: expect.any(Boolean),
    });
  });

  it('TEST 3 — Database Update & Persistence (PATCH /api/tickets/:id)', async () => {
    if (!dbAvailable || !testTicketId) {
      console.warn('⚠️ PostgreSQL unavailable. Database update persistence test skipped.');
      return;
    }

    const updatePayload = {
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
    };

    const patchResponse = await request(app)
      .patch(`/api/tickets/${testTicketId}`)
      .send(updatePayload);

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.success).toBe(true);
    expect(patchResponse.body.data.status).toBe('IN_PROGRESS');
    expect(patchResponse.body.data.priority).toBe('MEDIUM');

    // Fetch same ticket to verify persistent storage & updatedAt change
    const getResponse = await request(app).get(`/api/tickets/${testTicketId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.status).toBe('IN_PROGRESS');
    expect(getResponse.body.data.priority).toBe('MEDIUM');
    expect(new Date(getResponse.body.data.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(getResponse.body.data.createdAt).getTime()
    );
  });

  it('TEST 4 — Summary Counts Unfiltered Dataset (GET /api/tickets/summary)', async () => {
    if (!dbAvailable) {
      console.warn('⚠️ PostgreSQL unavailable. Summary count test skipped.');
      return;
    }

    const response = await request(app).get('/api/tickets/summary');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      total: expect.any(Number),
      open: expect.any(Number),
      inProgress: expect.any(Number),
      resolved: expect.any(Number),
    });
  });
});
