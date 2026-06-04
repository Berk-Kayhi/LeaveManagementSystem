const notificationController = require("../../controller/notificationController");
const notificationService = require("../../service/notificationService");

jest.mock("../../service/notificationService", () => ({
  getNotifications: jest.fn(),
  markAllAsRead: jest.fn(),
  deleteAllNotifications: jest.fn(),
  markAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  createNotifications: jest.fn(),
}));

jest.mock("../../service/authService", () => ({
  getAuthHeaderFromRequest: jest.fn(() => "Bearer test-token"),
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

const createUserRequest = () => ({
  user: { id: "user-1" },
  authHeader: "Bearer test-token",
});

const createParamRequest = () => ({
  params: { id: "param-1" },
  user: { id: "user-1" },
  authHeader: "Bearer test-token",
});

describe("notificationController birim testleri", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getNotifications başarılı şekilde bildirimleri döner", async () => {
    const req = createUserRequest();
    const res = createResponse();

    notificationService.getNotifications.mockResolvedValue([]);

    await notificationController.getNotifications(req, res);

    expect(notificationService.getNotifications).toHaveBeenCalledWith(
      "user-1",
      "Bearer test-token",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });

  test("markAllAsRead başarılı şekilde tüm bildirimleri okunmuş yapar", async () => {
    const req = createUserRequest();
    const res = createResponse();

    notificationService.markAllAsRead.mockResolvedValue([]);

    await notificationController.markAllAsRead(req, res);

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
  test("deleteAllNotifications başarılı şekilde tüm bildirimleri siler", async () => {
    const req = createUserRequest();
    const res = createResponse();

    notificationService.deleteAllNotifications.mockResolvedValue([]);

    await notificationController.deleteAllNotifications(req, res);

    expect(notificationService.deleteAllNotifications).toHaveBeenCalledWith(
      "user-1",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("markAsRead başarılı şekilde bildirimi okunmuş yapar", async () => {
    const req = createParamRequest();
    const res = createResponse();

    notificationService.markAsRead.mockResolvedValue([]);

    await notificationController.markAsRead(req, res);

    expect(notificationService.markAsRead).toHaveBeenCalledWith(
      "param-1",
      "user-1",
      "Bearer test-token",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
  });

  test("deleteNotification başarılı şekilde bildirimi siler", async () => {
    const req = createParamRequest();
    const res = createResponse();

    notificationService.deleteNotification.mockResolvedValue();

    await notificationController.deleteNotification(req, res);

    expect(notificationService.deleteNotification).toHaveBeenCalledWith(
      "param-1",
      "user-1",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("createNotifications başarılı şekilde bildirim oluşturur", async () => {
    const createdNotification = {
      id: "notification-1",
      recipientUserId: "user-1",
      message: "Yeni bildirim",
    };
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const req = {
      app: { get: jest.fn(() => ({ to })) },
      body: {
        notification: {
          recipientUserId: "user-1",
          message: "Yeni bildirim",
        },
      },
    };
    const res = createResponse();

    notificationService.createNotifications.mockResolvedValue([
      createdNotification,
    ]);

    await notificationController.createNotifications(req, res);

    expect(notificationService.createNotifications).toHaveBeenCalledWith(
      {
        recipientUserId: "user-1",
        message: "Yeni bildirim",
      },
      "Bearer test-token",
    );

    expect(to).toHaveBeenCalledWith("user:user-1");
    expect(emit).toHaveBeenCalledWith("notification", createdNotification);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [createdNotification],
    });
  });
});
