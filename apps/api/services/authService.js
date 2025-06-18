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
exports.authService = exports.AuthService = void 0;
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
// Singleton Prisma Client - bezpieczne podejście
var prisma;
function getPrismaClient() {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
}
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.prisma = getPrismaClient();
    }
    // Bezpieczne hashowanie hasła
    AuthService.prototype.hashPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bcryptjs_1.default.hash(password, 12)];
            });
        });
    };
    // Weryfikacja hasła
    AuthService.prototype.verifyPassword = function (password, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bcryptjs_1.default.compare(password, hash)];
            });
        });
    };
    // Generowanie tokenów JWT
    AuthService.prototype.generateTokens = function (user) {
        var payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        };
        var jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        var refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
        // Naprawiony JWT access token z jawną konfiguracją
        var accessToken = jsonwebtoken_1.default.sign(payload, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN || '15m'
        });
        // Naprawiony JWT refresh token z jawną konfiguracją
        var refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: 'refresh' }, refreshSecret, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
        });
        return { accessToken: accessToken, refreshToken: refreshToken };
    };
    // Weryfikacja tokena JWT
    AuthService.prototype.verifyToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtSecret, decoded;
            return __generator(this, function (_a) {
                try {
                    jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
                    decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                    return [2 /*return*/, decoded];
                }
                catch (error) {
                    throw new Error('Invalid token');
                }
                return [2 /*return*/];
            });
        });
    };
    // Znajdź użytkownika po email
    AuthService.prototype.findUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findUnique({
                        where: { email: email },
                        include: {
                            company: true,
                            locations: {
                                include: {
                                    location: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    // Znajdź użytkownika po ID  
    AuthService.prototype.findUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findUnique({
                        where: { id: id },
                        include: {
                            company: true,
                            locations: {
                                include: {
                                    location: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    // Sprawdź czy użytkownik istnieje
    AuthService.prototype.userExists = function (email, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: email },
                                { username: username }
                            ]
                        }
                    })];
            });
        });
    };
    // Utwórz nowego użytkownika z firmą
    AuthService.prototype.createUserWithCompany = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var email, username, firstName, lastName, password, companyName, phone, passwordHash;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = userData.email, username = userData.username, firstName = userData.firstName, lastName = userData.lastName, password = userData.password, companyName = userData.companyName, phone = userData.phone;
                        return [4 /*yield*/, this.hashPassword(password)];
                    case 1:
                        passwordHash = _a.sent();
                        return [2 /*return*/, this.prisma.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                var company, user, location;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma.company.create({
                                                data: {
                                                    name: companyName,
                                                    language: 'pl',
                                                    timezone: 'Europe/Warsaw'
                                                }
                                            })];
                                        case 1:
                                            company = _a.sent();
                                            return [4 /*yield*/, prisma.user.create({
                                                    data: {
                                                        email: email,
                                                        username: username,
                                                        firstName: firstName,
                                                        lastName: lastName,
                                                        passwordHash: passwordHash,
                                                        phone: phone,
                                                        role: 'ADMINISTRATOR',
                                                        companyId: company.id,
                                                        language: 'pl',
                                                        timezone: 'Europe/Warsaw'
                                                    }
                                                })];
                                        case 2:
                                            user = _a.sent();
                                            return [4 /*yield*/, prisma.location.create({
                                                    data: {
                                                        name: 'Lokalizacja główna',
                                                        description: 'Domyślna lokalizacja',
                                                        companyId: company.id
                                                    }
                                                })];
                                        case 3:
                                            location = _a.sent();
                                            // Przypisz użytkownika do lokalizacji
                                            return [4 /*yield*/, prisma.userLocation.create({
                                                    data: {
                                                        userId: user.id,
                                                        locationId: location.id
                                                    }
                                                })];
                                        case 4:
                                            // Przypisz użytkownika do lokalizacji
                                            _a.sent();
                                            return [2 /*return*/, { user: user, company: company, location: location }];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    // Zapisz refresh token
    AuthService.prototype.saveRefreshToken = function (token, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.refreshToken.create({
                        data: {
                            token: token,
                            userId: userId,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dni
                        }
                    })];
            });
        });
    };
    // Aktualizuj ostatnie logowanie
    AuthService.prototype.updateLastLogin = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.user.update({
                        where: { id: userId },
                        data: { lastLogin: new Date() }
                    })];
            });
        });
    };
    // Usuń wszystkie refresh tokeny użytkownika
    AuthService.prototype.deleteRefreshTokens = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.refreshToken.deleteMany({
                        where: { userId: userId }
                    })];
            });
        });
    };
    // Wyłączenie Prisma przy zamykaniu aplikacji
    AuthService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.$disconnect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
// Eksport singletona
exports.authService = new AuthService();
