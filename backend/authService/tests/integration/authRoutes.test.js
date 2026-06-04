const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const authService = require("../../service/authService");
const app = require("../../app");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("../../models/user", () => ({
  findById: jest.fn(),
}));

jest.mock("../../service/authService", () => ({
  isFirstRunSetupOpen: jest.fn(),
  registerFirstAdmin: jest.fn(),
  loginUser: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  updateUserAssignment: jest.fn(),
  deleteUser: jest.fn(),
}));

const authRequest = (method, url) => {
  return request(app)[method](url).set("Authorization", "Bearer test-token");
};

const mockAdminUser = () => {
  jwt.verify.mockReturnValue({ id: "admin-1" });
  User.findById.mockResolvedValue({
    _id: "admin-1",
    role: "admin",
  });
};

describe("auth route entegrasyon testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/auth/bootstrap/status kurulum durumunu döner", async () => {
    authService.isFirstRunSetupOpen.mockResolvedValue(true);
    const response = await request(app).get("/api/auth/bootstrap/status");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, isOpen: true });
  });

  test("POST /api/auth/register ilk admin hesabını oluşturur", async () => {
    const user = {
      id: "admin-1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      teamId: null,
    };
    const body = {
      email: "admin@example.com",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
    };

    authService.registerFirstAdmin.mockResolvedValue({
      token: "test-token",
      user,
    });
    const response = await request(app).post("/api/auth/register").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      user,
      token: "test-token",
    });
    expect(response.headers["set-cookie"][0]).toContain("token=test-token");
    expect(authService.registerFirstAdmin).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  });

  test("POST /api/auth/login kullanıcı girişini yapar", async () => {
    const user = {
      id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: null,
    };
    const body = {
      email: "employee@example.com",
      password: "password123",
      isRememberMe: false,
    };

    authService.loginUser.mockResolvedValue({
      token: "test-token",
      user,
    });
    const response = await request(app).post("/api/auth/login").send(body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      user,
      token: "test-token",
    });
    expect(response.headers["set-cookie"][0]).toContain("token=test-token");
    expect(authService.loginUser).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.isRememberMe,
    );
  });

  test("POST /api/auth/logout kullanıcı çıkışını yapar", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Başarıyla çıkış yapıldı" });
  });

  test("GET /api/auth/verify token doğrulamasını yapar", async () => {
    jwt.verify.mockReturnValue({ id: "user-1" });
    authService.getUserById.mockResolvedValue({
      _id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: "team-1",
    });
    const response = await authRequest("get", "/api/auth/verify");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      user: {
        id: "user-1",
        email: "employee@example.com",
        firstName: "Employee",
        lastName: "User",
        role: "employee",
        teamId: "team-1",
      },
    });
    expect(authService.getUserById).toHaveBeenCalledWith("user-1");
  });

  test("GET /api/auth/users kullanıcı listesini döner", async () => {
    const users = [
      {
        id: "user-1",
        email: "employee@example.com",
        firstName: "Employee",
        lastName: "User",
        role: "employee",
        teamId: null,
      },
    ];
    jwt.verify.mockReturnValue({ id: "user-1" });
    authService.getAllUsers.mockResolvedValue(users);

    const response = await authRequest("get", "/api/auth/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: users });
    expect(authService.getAllUsers).toHaveBeenCalledTimes(1);
  });

  test("POST /api/auth/users yeni kullanıcı oluşturur", async () => {
    const user = {
      id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: null,
    };
    const body = {
      email: "employee@example.com",
      password: "password123",
      firstName: "Employee",
      lastName: "User",
    };
    mockAdminUser();
    authService.createUser.mockResolvedValue(user);

    const response = await authRequest("post", "/api/auth/users").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, data: user });
    expect(authService.createUser).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  });

  test("PUT /api/auth/users/:id/assignment kullanıcı atamasını günceller", async () => {
    const assignment = {
      role: "team_lead",
      teamId: "team-1",
    };
    const user = {
      id: "user-1",
      email: "lead@example.com",
      firstName: "Team",
      lastName: "Lead",
      role: "team_lead",
      teamId: "team-1",
    };
    mockAdminUser();
    authService.updateUserAssignment.mockResolvedValue(user);

    const response = await authRequest(
      "put",
      "/api/auth/users/user-1/assignment",
    ).send(assignment);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: user });
    expect(authService.updateUserAssignment).toHaveBeenCalledWith(
      "user-1",
      assignment,
    );
  });

  test("DELETE /api/auth/users/:id kullanıcıyı siler", async () => {
    const user = {
      id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: null,
    };

    mockAdminUser();
    authService.deleteUser.mockResolvedValue(user);

    const response = await authRequest("delete", "/api/auth/users/user-1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: user });
    expect(authService.deleteUser).toHaveBeenCalledWith("user-1");
  });
});
