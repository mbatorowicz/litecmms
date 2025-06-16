import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

interface AuditData {
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues?: any;
  newValues?: any;
}

export const auditMiddleware: FastifyPluginAsync = async function (fastify) {
  
  // Decorator do logowania akcji audytowej
  fastify.decorate('logAudit', async function (
    request: FastifyRequest,
    auditData: AuditData
  ) {
    try {
      if (!request.user) {
        return; // Nie logujemy jeśli brak użytkownika
      }

      await fastify.prisma.auditLog.create({
        data: {
          entity: auditData.entity,
          entityId: auditData.entityId,
          action: auditData.action,
          oldValues: auditData.oldValues || null,
          newValues: auditData.newValues || null,
          userId: request.user.id,
          ipAddress: getClientIp(request),
          userAgent: request.headers['user-agent'] || null
        }
      });
    } catch (error) {
      // Nie przerywamy działania aplikacji jeśli audit się nie powiedzie
      fastify.log.error('Audit log failed:', error);
    }
  });

  // Decorator do porównania starych i nowych wartości
  fastify.decorate('createAuditDiff', function (oldData: any, newData: any) {
    const changes: any = {};
    const oldValues: any = {};
    const newValues: any = {};

    // Porównanie pól
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        oldValues[key] = oldData[key];
        newValues[key] = newData[key];
      }
    }

    return {
      oldValues: Object.keys(oldValues).length > 0 ? oldValues : null,
      newValues: Object.keys(newValues).length > 0 ? newValues : null
    };
  });

  // Hook do automatycznego logowania zmian w bazie danych
  fastify.addHook('preHandler', async (request, reply) => {
    // Zapisujemy oryginalną metodę Prisma
    const originalPrisma = request.server.prisma;

    // Nadpisujemy metody create, update, delete dla głównych modeli
    const auditableModels = [
      'user', 'company', 'location', 'machine', 'workOrder', 
      'part', 'maintenancePlan', 'machineModule'
    ];

    // Wrapper dla operacji CREATE
    const wrapCreate = (model: any, modelName: string) => {
      const originalCreate = model.create;
      model.create = async function (args: any) {
        const result = await originalCreate.call(this, args);
        
        if (request.user) {
          await fastify.logAudit(request, {
            entity: modelName.toUpperCase(),
            entityId: result.id,
            action: 'CREATE',
            newValues: args.data
          });
        }
        
        return result;
      };
    };

    // Wrapper dla operacji UPDATE
    const wrapUpdate = (model: any, modelName: string) => {
      const originalUpdate = model.update;
      model.update = async function (args: any) {
        // Pobierz stare wartości przed aktualizacją
        let oldData = null;
        try {
          oldData = await this.findUnique({ where: args.where });
        } catch (e) {
          // Ignoruj błędy
        }

        const result = await originalUpdate.call(this, args);
        
        if (request.user) {
          const diff = fastify.createAuditDiff(oldData || {}, args.data);
          await fastify.logAudit(request, {
            entity: modelName.toUpperCase(),
            entityId: result.id,
            action: 'UPDATE',
            oldValues: diff.oldValues,
            newValues: diff.newValues
          });
        }
        
        return result;
      };
    };

    // Wrapper dla operacji DELETE
    const wrapDelete = (model: any, modelName: string) => {
      const originalDelete = model.delete;
      model.delete = async function (args: any) {
        // Pobierz dane przed usunięciem
        let oldData = null;
        try {
          oldData = await this.findUnique({ where: args.where });
        } catch (e) {
          // Ignoruj błędy
        }

        const result = await originalDelete.call(this, args);
        
        if (request.user && oldData) {
          await fastify.logAudit(request, {
            entity: modelName.toUpperCase(),
            entityId: oldData.id,
            action: 'DELETE',
            oldValues: oldData
          });
        }
        
        return result;
      };
    };

    // Zastosuj wrappery tylko dla określonych modeli
    auditableModels.forEach(modelName => {
      const model = (originalPrisma as any)[modelName];
      if (model) {
        wrapCreate(model, modelName);
        wrapUpdate(model, modelName);
        wrapDelete(model, modelName);
      }
    });
  });
};

// Funkcja pomocnicza do pobrania IP klienta
function getClientIp(request: FastifyRequest): string {
  const xForwardedFor = request.headers['x-forwarded-for'];
  const xRealIp = request.headers['x-real-ip'];
  
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (typeof xRealIp === 'string') {
    return xRealIp;
  }
  
  return request.socket.remoteAddress || 'unknown';
}

// Rozszerzenie typu FastifyInstance
declare module 'fastify' {
  interface FastifyInstance {
    logAudit: (request: FastifyRequest, auditData: AuditData) => Promise<void>;
    createAuditDiff: (oldData: any, newData: any) => { oldValues: any; newValues: any };
  }
}

export default auditMiddleware; 