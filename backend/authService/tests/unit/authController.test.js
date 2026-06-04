const authController = require("../../controller/authController");
const authService = require("../../service/authService");

jest.mock("../../service/authService", () => ({
  isFirstRunSetupOpen: jest.fn(),
  registerFirstAdmin: jest.fn(),
  createUser: jest.fn(),
  loginUser: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  updateUserAssignment: jest.fn(),
  deleteUser: jest.fn(),
}));

const createResponse = () => {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
  };

  res.cookie.mockReturnValue(res);
  res.clearCookie.mockReturnValue(res);
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
};

const createBodyRequest = (body) => ({ body });

const createUserParamRequest = (body) => {
  const req = {
    params: { id: "user-1" },
  };

  if (body) {
    req.body = body;
  }

  return req;
};

describe("authController birim testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getBootstrapStatus başarılı şekilde kurulum durumunu döner", async () => {
    const req = {};
    const res = createResponse();

    authService.isFirstRunSetupOpen.mockResolvedValue(true);
    await authController.getBootstrapStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      isOpen: true,
    });
  });

  test("registerFirstAdmin başarılı şekilde ilk admin hesabını oluşturur", async () => {
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
    const req = createBodyRequest(body);
    const res = createResponse();

    authService.registerFirstAdmin.mockResolvedValue({
      token: "test-token",
      user,
    });
    await authController.registerFirstAdmin(req, res);
    expect(authService.registerFirstAdmin).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "test-token",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user,
      token: "test-token",
    });
  });

  test("createUser başarılı şekilde yeni kullanıcı oluşturur", async () => {
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
    const req = createBodyRequest(body);
    const res = createResponse();

    authService.createUser.mockResolvedValue(user);
    await authController.createUser(req, res);
    expect(authService.createUser).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: user,
    });
  });

  test("login başarılı şekilde kullanıcı girişini yapar", async () => {
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
    const req = createBodyRequest(body);
    const res = createResponse();

    authService.loginUser.mockResolvedValue({
      token: "test-token",
      user,
    });
    await authController.login(req, res);
    expect(authService.loginUser).toHaveBeenCalledWith(
      body.email,
      body.password,
      body.isRememberMe,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "test-token",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user,
      token: "test-token",
    });
  });

  test("logout başarılı şekilde cookie temizler", async () => {
    const req = {};
    const res = createResponse();
    await authController.logout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith("token");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Başarıyla çıkış yapıldı",
    });
  });

  test("verifyToken başarılı şekilde kullanıcı bilgisini döner", async () => {
    const user = {
      _id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: "team-1",
    };

    const req = {
      user: {
        id: "user-1",
      },
    };
    const res = createResponse();

    authService.getUserById.mockResolvedValue(user);
    await authController.verifyToken(req, res);
    expect(authService.getUserById).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
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
  });

  test("getUsers başarılı şekilde kullanıcı listesini döner", async () => {
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

    const req = {};
    const res = createResponse();

    authService.getAllUsers.mockResolvedValue(users);
    await authController.getUsers(req, res);
    expect(authService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: users,
    });
  });

  test("updateAssignment başarılı şekilde kullanıcı atamasını günceller", async () => {
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

    const req = createUserParamRequest(assignment);
    const res = createResponse();

    authService.updateUserAssignment.mockResolvedValue(user);
    await authController.updateAssignment(req, res);
    expect(authService.updateUserAssignment).toHaveBeenCalledWith(
      "user-1",
      assignment,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: user,
    });
  });

  test("deleteUser başarılı şekilde kullanıcıyı siler", async () => {
    const user = {
      id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
      teamId: null,
    };
    const req = createUserParamRequest();
    const res = createResponse();

    authService.deleteUser.mockResolvedValue(user);
    await authController.deleteUser(req, res);
    expect(authService.deleteUser).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: user,
    });
  });
});
