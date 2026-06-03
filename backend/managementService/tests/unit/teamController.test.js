const teamController = require("../../controller/teamController");
const teamService = require("../../service/teamService");

jest.mock("../../service/teamService", () => ({
  getTeams: jest.fn(),
  getMyTeam: jest.fn(),
  createTeam: jest.fn(),
  updateTeam: jest.fn(),
  assignTeamMembers: jest.fn(),
  deleteTeam: jest.fn(),
}));

const createResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };

  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);

  return res;
};

const createRequest = () => {
  return {
    params: {
      id: "team-1",
    },
    body: {
      teamName: "Engineering",
      teamLeadId: "lead-1",
      userIds: ["user-1", "user-2"],
    },
    user: {
      id: "user-1",
      role: "admin",
      teamId: "team-1",
    },
    authHeader: "Bearer test-token",
  };
};

describe("teamController birim testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getTeams başarılı şekilde takımları döner", async () => {
    const teams = [{ id: "team-1", teamName: "Engineering" }];
    const req = createRequest();
    const res = createResponse();

    teamService.getTeams.mockResolvedValue(teams);
    await teamController.getTeams(req, res);

    expect(teamService.getTeams).toHaveBeenCalledWith("Bearer test-token");
    expect(res.json).toHaveBeenCalledWith({ success: true, data: teams });
  });

  test("getMyTeam başarılı şekilde kullanıcının takımını döner", async () => {
    const team = { id: "team-1", teamName: "Engineering" };
    const req = createRequest();
    const res = createResponse();

    teamService.getMyTeam.mockResolvedValue(team);
    await teamController.getMyTeam(req, res);

    expect(teamService.getMyTeam).toHaveBeenCalledWith(req.user);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: team });
  });

  test("createTeam başarılı şekilde takım oluşturur", async () => {
    const team = { id: "team-1", teamName: "Engineering" };
    const req = createRequest();
    const res = createResponse();

    teamService.createTeam.mockResolvedValue(team);
    await teamController.createTeam(req, res);

    expect(teamService.createTeam).toHaveBeenCalledWith(
      "Engineering",
      "lead-1",
      "Bearer test-token",
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: team });
  });

  test("updateTeam başarılı şekilde takımı günceller", async () => {
    const team = { id: "team-1", teamName: "Engineering" };
    const req = createRequest();
    const res = createResponse();

    teamService.updateTeam.mockResolvedValue(team);
    await teamController.updateTeam(req, res);

    expect(teamService.updateTeam).toHaveBeenCalledWith(
      "team-1",
      req.body,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: team });
  });

  test("assignTeamMembers başarılı şekilde takım üyelerini atar", async () => {
    const team = { id: "team-1", members: ["user-1", "user-2"] };
    const req = createRequest();
    const res = createResponse();

    teamService.assignTeamMembers.mockResolvedValue(team);
    await teamController.assignTeamMembers(req, res);

    expect(teamService.assignTeamMembers).toHaveBeenCalledWith(
      "team-1",
      ["user-1", "user-2"],
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: team });
  });

  test("deleteTeam başarılı şekilde takımı siler", async () => {
    const team = { id: "team-1", teamName: "Engineering" };
    const req = createRequest();
    const res = createResponse();

    teamService.deleteTeam.mockResolvedValue(team);
    await teamController.deleteTeam(req, res);

    expect(teamService.deleteTeam).toHaveBeenCalledWith(
      "team-1",
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: team });
  });
});
