"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var cors_1 = require("@fastify/cors");
var jwt_1 = require("@fastify/jwt");
var cookie_1 = require("@fastify/cookie");
var dotenv_1 = require("dotenv");
var client_1 = require("@prisma/client");
// import bcryptPlugin from './plugins/bcrypt';
var test_1 = require("./routes/test");
var auth_1 = require("./routes/auth");
var auth_2 = require("./middleware/auth");
var alerts_1 = require("./routes/alerts");
var dashboard_1 = require("./routes/dashboard");
var companies_1 = require("./routes/companies");
var locations_1 = require("./routes/locations");
var machines_1 = require("./routes/machines");
var users_1 = require("./routes/users");
var work_orders_1 = require("./routes/work-orders");
var parts_1 = require("./routes/parts");
var notifications_1 = require("./routes/notifications");
// Ładowanie zmiennych środowiskowych
dotenv_1.default.config({ path: 'database.env' });
// Konfiguracja środowiska
var config = {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    databaseUrl: process.env.DATABASE_URL,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
// Tworzenie serwera Fastify z enhanced loggingiem
var server = (0, fastify_1.default)({
    logger: {
        level: config.nodeEnv === 'production' ? 'warn' : 'info'
    }
});
// Sprawdzenie wymaganych zmiennych środowiskowych
if (!config.databaseUrl) {
    server.log.error('❌ DATABASE_URL nie została załadowana z database.env');
    server.log.error('💡 Sprawdź czy plik database.env istnieje i ma poprawny format');
    process.exit(1);
}
// Potwierdzenie poprawnego załadowania konfiguracji
server.log.info('✅ DATABASE_URL załadowana z database.env');
// Inicjalizacja Prisma Client
var prisma = new client_1.PrismaClient();
// Rejestracja Prisma jako dekorator
server.decorate('prisma', prisma);
// Rejestracja pluginów
server.register(cookie_1.default);
// server.register(bcryptPlugin);
// JWT plugin
server.register(jwt_1.default, {
    secret: config.jwtSecret,
    sign: {
        expiresIn: config.jwtExpiresIn
    },
    cookie: {
        cookieName: 'token',
        signed: false
    }
});
// CORS
server.register(cors_1.default, {
    origin: config.frontendUrl,
    credentials: true
});
// Middleware autoryzacji
server.register(auth_2.authMiddleware);
// Routes
server.register(test_1.default, { prefix: '/api' });
server.register(auth_1.default, { prefix: '/api/auth' });
server.register(alerts_1.default, { prefix: '/api/alerts' });
server.register(dashboard_1.default, { prefix: '/api/dashboard' });
server.register(companies_1.default, { prefix: '/api/companies' });
server.register(locations_1.default, { prefix: '/api/locations' });
server.register(machines_1.default, { prefix: '/api/machines' });
server.register(users_1.default, { prefix: '/api/users' });
server.register(work_orders_1.default, { prefix: '/api/work-orders' });
server.register(parts_1.default, { prefix: '/api/parts' });
server.register(notifications_1.default, { prefix: '/api/notifications' });
// Funkcja testowania połączenia z bazą danych
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    _a.sent();
                    server.log.info('🔍 Sprawdzanie połączenia z bazą danych...');
                    // Test prostego zapytania
                    return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT 1"], ["SELECT 1"])))];
                case 2:
                    // Test prostego zapytania
                    _a.sent();
                    server.log.info('✅ Połączenie z bazą danych aktywne');
                    return [2 /*return*/, { status: 'ok', message: 'Połączenie z bazą danych aktywne' }];
                case 3:
                    error_1 = _a.sent();
                    server.log.warn('⚠️  Baza danych niedostępna - serwer będzie działał w trybie ograniczonym');
                    server.log.error('Database error:', error_1);
                    return [2 /*return*/, { status: 'warning', message: 'Baza danych niedostępna' }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Prosty endpoint health check
server.get('/health', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: 'ok',
                message: 'LiteCMMS Server is running',
                timestamp: new Date().toISOString(),
                version: '2.0.0'
            }];
    });
}); });
// Endpoint API status
server.get('/api/status', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                api: 'LiteCMMS API v2.0',
                status: 'operational',
                timestamp: new Date().toISOString(),
                endpoints: [
                    'GET /health',
                    'GET /api/status',
                    'GET /api/system-status'
                ]
            }];
    });
}); });
// Endpoint dla statusu systemu (dla frontendu)
server.get('/api/system-status', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var dbStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, testDatabaseConnection()];
            case 1:
                dbStatus = _a.sent();
                return [2 /*return*/, {
                        apiServer: {
                            status: 'ok',
                            message: 'Połączenie aktywne'
                        },
                        database: dbStatus,
                        services: {
                            total: 2,
                            running: dbStatus.status === 'ok' ? 2 : 1,
                            stopped: dbStatus.status === 'ok' ? 0 : 1
                        },
                        timestamp: new Date().toISOString()
                    }];
        }
    });
}); });
// Uruchomienie serwera
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // Test połączenia z bazą danych przy starcie
                return [4 /*yield*/, testDatabaseConnection()];
            case 1:
                // Test połączenia z bazą danych przy starcie
                _a.sent();
                return [4 /*yield*/, server.listen({ port: config.port, host: config.host })];
            case 2:
                _a.sent();
                server.log.info("\uD83D\uDE80 LiteCMMS Server uruchomiony na http://localhost:".concat(config.port));
                server.log.info("\uD83D\uDCCA Health check: http://localhost:".concat(config.port, "/health"));
                server.log.info("\uD83D\uDD0C API Status: http://localhost:".concat(config.port, "/api/status"));
                server.log.info("\u2699\uFE0F  System Status: http://localhost:".concat(config.port, "/api/system-status"));
                server.log.info("\uD83E\uDDEA Test endpoint: http://localhost:".concat(config.port, "/api/test"));
                server.log.info("\uD83D\uDD10 Auth - Login: POST http://localhost:".concat(config.port, "/api/auth/login"));
                server.log.info("\uD83D\uDD10 Auth - Register: POST http://localhost:".concat(config.port, "/api/auth/register"));
                server.log.info("\uD83D\uDD10 Auth - Logout: POST http://localhost:".concat(config.port, "/api/auth/logout"));
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                server.log.error(err_1);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Graceful shutdown
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server.log.info('\n🛑 Zamykanie serwera...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                // await authService.disconnect();
                return [4 /*yield*/, prisma.$disconnect()];
            case 2:
                // await authService.disconnect();
                _a.sent();
                return [4 /*yield*/, server.close()];
            case 3:
                _a.sent();
                server.log.info('✅ Serwer zamknięty pomyślnie');
                process.exit(0);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                server.log.error('❌ Błąd podczas zamykania:', err_2);
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Start serwera
start();
var templateObject_1;
