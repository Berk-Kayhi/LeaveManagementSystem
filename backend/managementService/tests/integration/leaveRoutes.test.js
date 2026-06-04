const request = require("supertest");
const leaveService = require("../../service/leaveService");

jest.mock("../../middleware/authMiddleware", () => (req, res, next) => {
  req.user = {
    id: "user-1",
    role: "admin",
  };
  req.authHeader = "Bearer test-token";
  next();
});

jest.mock("../../middleware/leaveManagerMiddleware", () => (req, res, next) => {
  next();
});

jest.mock("../../middleware/adminOnlyMiddleware", () => (req, res, next) => {
  next();
});

jest.mock("../../service/leaveService", () => ({
  getMyLeaves: jest.fn(),
  createLeave: jest.fn(),
  getTeamView: jest.fn(),
  getManageableLeaves: jest.fn(),
  getAllLeaves: jest.fn(),
  approveLeave: jest.fn(),
  rejectLeave: jest.fn(),
}));

jest.mock("../../service/teamService", () => ({
  getTeams: jest.fn(),
  getMyTeam: jest.fn(),
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
  assignTeamMembers: jest.fn(),
  deleteTeam: jest.fn(),
}));

const app = require("../../app");

const authRequest = (method, url) => {
  return request(app)[method](url).set("Authorization", "Bearer test-token");
};

describe("leave route entegrasyon testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/leaves/add izin oluşturur", async () => {
    const body = {
      leaveType: "annual",
      startDate: "2026-06-03",
      days: 2,
    };
    const leave = { id: "leave-1", status: "pending" };

    leaveService.createLeave.mockResolvedValue(leave);

    const response = await authRequest("post", "/api/leaves/add").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leave });
    expect(leaveService.createLeave).toHaveBeenCalledWith(
      { id: "user-1", role: "admin" },
      body,
      "Bearer test-token",
    );
  });

  test("GET /api/leaves/my kullanıcının izinlerini döner", async () => {
    const leaves = [{ id: "leave-1" }];

    leaveService.getMyLeaves.mockResolvedValue(leaves);

    const response = await authRequest("get", "/api/leaves/my");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leaves });
    expect(leaveService.getMyLeaves).toHaveBeenCalledWith("user-1");
  });

  test("GET /api/leaves/team-view takım görünümünü döner", async () => {
    const data = { leaves: [] };

    leaveService.getTeamView.mockResolvedValue(data);

    const response = await authRequest("get", "/api/leaves/team-view");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data });
    expect(leaveService.getTeamView).toHaveBeenCalledWith(
      { id: "user-1", role: "admin" },
      "Bearer test-token",
    );
  });

  test("GET /api/leaves/manager-view yönetilebilir izinleri döner", async () => {
    const leaves = [{ id: "leave-1" }];

    leaveService.getManageableLeaves.mockResolvedValue(leaves);

    const response = await authRequest("get", "/api/leaves/manager-view");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leaves });
    expect(leaveService.getManageableLeaves).toHaveBeenCalledWith(
      { id: "user-1", role: "admin" },
      "Bearer test-token",
    );
  });

  test("GET /api/leaves/all tüm izinleri döner", async () => {
    const leaves = [{ id: "leave-1" }];

    leaveService.getAllLeaves.mockResolvedValue(leaves);

    const response = await authRequest("get", "/api/leaves/all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leaves });
    expect(leaveService.getAllLeaves).toHaveBeenCalledWith("Bearer test-token");
  });

  test("PUT /api/leaves/approve/:id izni onaylar", async () => {
    const leave = { id: "leave-1", status: "approved" };

    leaveService.approveLeave.mockResolvedValue(leave);

    const response = await authRequest("put", "/api/leaves/approve/leave-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leave });
    expect(leaveService.approveLeave).toHaveBeenCalledWith(
      "leave-1",
      { id: "user-1", role: "admin" },
      "Bearer test-token",
    );
  });

  test("PUT /api/leaves/reject/:id izni reddeder", async () => {
    const leave = { id: "leave-1", status: "rejected" };

    leaveService.rejectLeave.mockResolvedValue(leave);

    const response = await authRequest("put", "/api/leaves/reject/leave-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: leave });
    expect(leaveService.rejectLeave).toHaveBeenCalledWith(
      "leave-1",
      { id: "user-1", role: "admin" },
      "Bearer test-token",
    );
  });
});
