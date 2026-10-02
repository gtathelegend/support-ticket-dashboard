import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Ticket REST API Integration Tests', () => {
  // =========================================================================
  // TEST 1 — Validation
  // =========================================================================
  describe('POST /api/tickets (Validation)', () => {
    it('should return 400 Bad Request with structured details when title > 120 chars and email is invalid', async () => {
      const invalidPayload = {
        title: 'A'.repeat(125), // 125 chars > 120 char limit
        description: 'Test description',
        customerEmail: 'not-a-valid-email',
        priority: 'HIGH',
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(response.body.error.details)).toBe(true);

      const fields = response.body.error.details.map((d: { field: string }) => d.field);
      expect(fields).toContain('title');
      expect(fields).toContain('customerEmail');
    });

    it('should return 400 Bad Request when title or description contains only whitespace', async () => {
      const payload = {
        title: '   ',
        description: '  ',
        customerEmail: 'valid@example.com',
        priority: 'MEDIUM',
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when priority is invalid', async () => {
      const payload = {
        title: 'Valid title',
        description: 'Valid description',
        customerEmail: 'user@example.com',
        priority: 'URGENT', // Invalid priority enum
      };

      const response = await request(app)
        .post('/api/tickets')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // =========================================================================
  // TEST 2 — Search / Filter / Pagination Query Validation
  // =========================================================================
  describe('GET /api/tickets (Query Parameter Validation)', () => {
    it('should return 400 Bad Request when page is negative or invalid string', async () => {
      const response = await request(app).get('/api/tickets?page=-5');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when limit exceeds 10', async () => {
      const response = await request(app).get('/api/tickets?limit=50');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when status enum parameter is invalid', async () => {
      const response = await request(app).get('/api/tickets?status=UNKNOWN');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // =========================================================================
  // TEST 3 — Update / Parameter Validation
  // =========================================================================
  describe('PATCH /api/tickets/:id (Validation & Error Handling)', () => {
    it('should return 400 Bad Request with INVALID_ID error code when ID is malformed', async () => {
      const response = await request(app)
        .patch('/api/tickets/invalid-uuid-123')
        .send({ status: 'RESOLVED' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_ID');
    });

    it('should return 400 Bad Request when update payload is empty {}', async () => {
      const validUuid = '00000000-0000-4000-a000-000000000001';
      const response = await request(app)
        .patch(`/api/tickets/${validUuid}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // =========================================================================
  // GET /api/tickets/:id (UUID Validation)
  // =========================================================================
  describe('GET /api/tickets/:id (ID Validation)', () => {
    it('should return 400 Bad Request with INVALID_ID when path ID is not a UUID', async () => {
      const response = await request(app).get('/api/tickets/not-a-valid-uuid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_ID');
    });
  });
});
