const leaveController = require("../../controller/leaveController");
const leaveService = require("../../service/leaveService");

jest.mock("../../service/leaveService", () => ({
  getMyLeaves: jest.fn(),
  createLeave: jest.fn(),
  getTeamView: jest.fn(),
  getManageableLeaves: jest.fn(),
  getAllLeaves: jest.fn(),
  approveLeave: jest.fn(),
  rejectLeave: jest.fn(),
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

const createUserRequest = () => {
  return {
    user: {
      id: "user-1",
      role: "employee",
    },
    authHeader: "Bearer test-token",
  };
};

const createParamRequest = () => {
  return {
    params: {
      id: "leave-1",
    },
    user: {
      id: "user-1",
      role: "team_lead",
    },
    authHeader: "Bearer test-token",
  };
};

describe("leaveController birim testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getMyLeaves başarılı şekilde kullanıcının izinlerini döner", async () => {
    const leaves = [{ id: "leave-1", status: "pending" }];
    const req = createUserRequest();
    const res = createResponse();

    leaveService.getMyLeaves.mockResolvedValue(leaves);
    await leaveController.getMyLeaves(req, res);

    expect(leaveService.getMyLeaves).toHaveBeenCalledWith("user-1");
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leaves });
  });

  test("createLeave başarılı şekilde izin oluşturur", async () => {
    const leaveBody = {
      leaveType: "annual",
      startDate: "2026-06-03",
      days: 2,
    };
    const leave = { id: "leave-1", status: "pending" };
    const req = createUserRequest();
    req.body = leaveBody;
    const res = createResponse();

    leaveService.createLeave.mockResolvedValue(leave);
    await leaveController.createLeave(req, res);

    expect(leaveService.createLeave).toHaveBeenCalledWith(
      req.user,
      leaveBody,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leave });
  });

  test("getTeamView başarılı şekilde takım görünümünü döner", async () => {
    const data = { leaves: [] };
    const req = createUserRequest();
    const res = createResponse();

    leaveService.getTeamView.mockResolvedValue(data);
    await leaveController.getTeamView(req, res);

    expect(leaveService.getTeamView).toHaveBeenCalledWith(
      req.user,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  test("getStats başarılı şekilde yönetilebilir izinleri döner", async () => {
    const leaves = [{ id: "leave-1" }];
    const req = createUserRequest();
    const res = createResponse();

    leaveService.getManageableLeaves.mockResolvedValue(leaves);
    await leaveController.getStats(req, res);

    expect(leaveService.getManageableLeaves).toHaveBeenCalledWith(
      req.user,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leaves });
  });

  test("getAllLeaves başarılı şekilde tüm izinleri döner", async () => {
    const leaves = [{ id: "leave-1" }];
    const req = createUserRequest();
    const res = createResponse();

    leaveService.getAllLeaves.mockResolvedValue(leaves);
    await leaveController.getAllLeaves(req, res);

    expect(leaveService.getAllLeaves).toHaveBeenCalledWith("Bearer test-token");
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leaves });
  });

  test("approveLeave başarılı şekilde izni onaylar", async () => {
    const leave = { id: "leave-1", status: "approved" };
    const req = createParamRequest();
    const res = createResponse();

    leaveService.approveLeave.mockResolvedValue(leave);
    await leaveController.approveLeave(req, res);

    expect(leaveService.approveLeave).toHaveBeenCalledWith(
      "leave-1",
      req.user,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leave });
  });

  test("rejectLeave başarılı şekilde izni reddeder", async () => {
    const leave = { id: "leave-1", status: "rejected" };
    const req = createParamRequest();
    const res = createResponse();

    leaveService.rejectLeave.mockResolvedValue(leave);
    await leaveController.rejectLeave(req, res);

    expect(leaveService.rejectLeave).toHaveBeenCalledWith(
      "leave-1",
      req.user,
      "Bearer test-token",
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: leave });
  });
});
