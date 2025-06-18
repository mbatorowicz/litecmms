"use strict";
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
exports.authMiddleware = void 0;
var authMiddleware = function (fastify) {
    return __awaiter(this, void 0, void 0, function () {
        // Funkcja pomocnicza do weryfikacji użytkownika
        function authenticateUser(request) {
            return __awaiter(this, void 0, void 0, function () {
                var token, decoded, user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            token = request.cookies.token ||
                                ((_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
                            if (!token) {
                                throw new Error('No token provided');
                            }
                            return [4 /*yield*/, request.jwtVerify()];
                        case 1:
                            decoded = _b.sent();
                            return [4 /*yield*/, fastifyWithPrisma.prisma.user.findUnique({
                                    where: { id: decoded.id },
                                    include: {
                                        company: true,
                                        locations: {
                                            include: {
                                                location: true
                                            }
                                        }
                                    }
                                })];
                        case 2:
                            user = _b.sent();
                            if (!user || !user.isActive) {
                                throw new Error('User not found or inactive');
                            }
                            // Aktualizacja ostatniego logowania
                            return [4 /*yield*/, fastifyWithPrisma.prisma.user.update({
                                    where: { id: user.id },
                                    data: { lastLogin: new Date() }
                                })];
                        case 3:
                            // Aktualizacja ostatniego logowania
                            _b.sent();
                            return [2 /*return*/, {
                                    id: user.id,
                                    email: user.email,
                                    username: user.username,
                                    role: user.role,
                                    companyId: user.companyId,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    locations: user.locations.map(function (ul) { return ul.location; }),
                                    company: user.company
                                }];
                    }
                });
            });
        }
        var fastifyWithPrisma;
        var _this = this;
        return __generator(this, function (_a) {
            fastifyWithPrisma = fastify;
            // Decorator do weryfikacji tokena
            fastify.decorate('authenticate', function (request, reply) {
                return __awaiter(this, void 0, void 0, function () {
                    var user, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, authenticateUser(request)];
                            case 1:
                                user = _a.sent();
                                request.user = user;
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                reply.code(401).send({
                                    error: 'Unauthorized',
                                    message: 'Invalid or expired token'
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            });
            // Decorator do autoryzacji ról z poprawnym typowaniem
            fastify.decorate('authorize', function (allowedRoles) {
                return function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                    var user_1, user, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                if (!!request.user) return [3 /*break*/, 2];
                                return [4 /*yield*/, authenticateUser(request)];
                            case 1:
                                user_1 = _a.sent();
                                request.user = user_1;
                                _a.label = 2;
                            case 2:
                                user = request.user;
                                if (!user || !allowedRoles.includes(user.role)) {
                                    reply.code(403).send({
                                        error: 'Forbidden',
                                        message: 'You do not have permission to access this resource'
                                    });
                                    return [2 /*return*/];
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                reply.code(401).send({
                                    error: 'Unauthorized',
                                    message: 'Authentication required'
                                });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
            });
            // Decorator do autoryzacji lokalizacji z poprawnym typowaniem
            fastify.decorate('authorizeLocation', function (locationId) {
                return function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                    var user_2, user, hasAccess, err_3;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                if (!!request.user) return [3 /*break*/, 2];
                                return [4 /*yield*/, authenticateUser(request)];
                            case 1:
                                user_2 = _b.sent();
                                request.user = user_2;
                                _b.label = 2;
                            case 2:
                                user = request.user;
                                if (!user) {
                                    reply.code(401).send({ error: 'Authentication required' });
                                    return [2 /*return*/];
                                }
                                // Administrator ma dostęp do wszystkich lokalizacji
                                if (user.role === 'ADMINISTRATOR') {
                                    return [2 /*return*/];
                                }
                                hasAccess = (_a = user.locations) === null || _a === void 0 ? void 0 : _a.some(function (location) { return location.id === locationId; });
                                if (!hasAccess) {
                                    reply.code(403).send({
                                        error: 'Forbidden',
                                        message: 'You do not have access to this location'
                                    });
                                    return [2 /*return*/];
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                err_3 = _b.sent();
                                reply.code(401).send({
                                    error: 'Unauthorized',
                                    message: 'Authentication required'
                                });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
            });
            // Hook do automatycznej autoryzacji dla określonych route'ów
            fastify.addHook('preHandler', function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                var publicRoutes, user, err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            publicRoutes = [
                                '/api/auth/login',
                                '/api/auth/register',
                                '/api/auth/refresh',
                                '/api/auth/forgot-password',
                                '/api/auth/reset-password',
                                '/health'
                            ];
                            // Sprawdzenie czy route jest publiczny
                            if (publicRoutes.includes(request.url)) {
                                return [2 /*return*/];
                            }
                            if (!request.url.startsWith('/api/')) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, authenticateUser(request)];
                        case 2:
                            user = _a.sent();
                            request.user = user;
                            return [3 /*break*/, 4];
                        case 3:
                            err_4 = _a.sent();
                            reply.code(401).send({
                                error: 'Unauthorized',
                                message: 'Authentication required'
                            });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
};
exports.authMiddleware = authMiddleware;
// Typy są już zdefiniowane w server/types/fastify.d.ts
exports.default = exports.authMiddleware;
