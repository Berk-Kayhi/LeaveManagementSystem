const request = require("supertest");
const teamService = require("../../service/teamService");

jest.mock("../../middleware/authMiddleware", () => (req, res, next) => {
  req.user = {
    id: "user-1",
    role: "admin",
    teamId: "team-1",
  };
  req.authHeader = "Bearer test-token";
  next();
});

jest.mock("../../middleware/adminOnlyMiddleware", () => (req, res, next) => {
  next();
});

jest.mock("../../service/teamService", () => ({
  getTeams: jest.fn(),
  getMyTeam: jest.fn(),
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
  assignTeamMembers: jest.fn(),
  deleteTeam: jest.fn(),
}));

jest.mock("../../service/leaveService", () => ({
  getMyLeaves: jest.fn(),
  createLeave: jest.fn(),
  getTeamView: jest.fn(),
  getManageableLeaves: jest.fn(),
  getAllLeaves: jest.fn(),
  approveLeave: jest.fn(),
  rejectLeave: jest.fn(),
}));

const app = require("../../app");

const authRequest = (method, url) => {
  return request(app)[method](url).set("Authorization", "Bearer test-token");
};

describe("team route entegrasyon testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/teams/my kullanıcının takımını döner", async () => {
    const team = { id: "team-1", teamName: "Engineering" };

    teamService.getMyTeam.mockResolvedValue(team);

    const response = await authRequest("get", "/api/teams/my");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: team });
    expect(teamService.getMyTeam).toHaveBeenCalledWith({
      id: "user-1",
      role: "admin",
      teamId: "team-1",
    });
  });

  test("GET /api/teams takımları döner", async () => {
    const teams = [{ id: "team-1", teamName: "Engineering" }];

    teamService.getTeams.mockResolvedValue(teams);

    const response = await authRequest("get", "/api/teams");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: teams });
    expect(teamService.getTeams).toHaveBeenCalledWith("Bearer test-token");
  });

  test("POST /api/teams takım oluşturur", async () => {
    const body = {
      teamName: "Engineering",
      teamLeadId: "lead-1",
    };
    const team = { id: "team-1", teamName: "Engineering" };

    teamService.createTeam.mockResolvedValue(team);

    const response = await authRequest("post", "/api/teams").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, data: team });
    expect(teamService.createTeam).toHaveBeenCalledWith(
      "Engineering",
      "lead-1",
      "Bearer test-token",
    );
  });

  test("PUT /api/teams/:id takımı günceller", async () => {
    const body = {
      teamName: "Product",
      teamLeadId: "lead-2",
    };
    const team = { id: "team-1", teamName: "Product" };

    teamService.updateTeam.mockResolvedValue(team);

    const response = await authRequest("put", "/api/teams/team-1").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: team });
    expect(teamService.updateTeam).toHaveBeenCalledWith(
      "team-1",
      body,
      "Bearer test-token",
    );
  });

  test("PUT /api/teams/:id/members takım üyelerini atar", async () => {
    const body = {
      userIds: ["user-1", "user-2"],
    };
    const team = { id: "team-1", members: ["user-1", "user-2"] };

    teamService.assignTeamMembers.mockResolvedValue(team);

    const response = await authRequest("put", "/api/teams/team-1/members").send(
      body,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: team });
    expect(teamService.assignTeamMembers).toHaveBeenCalledWith(
      "team-1",
      ["user-1", "user-2"],
      "Bearer test-token",
    );
  });

  test("DELETE /api/teams/:id takımı siler", async () => {
    const team = { id: "team-1", teamName: "Engineering" };

    teamService.deleteTeam.mockResolvedValue(team);

    const response = await authRequest("delete", "/api/teams/team-1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: team });
    expect(teamService.deleteTeam).toHaveBeenCalledWith(
      "team-1",
      "Bearer test-token",
    );
  });
});
