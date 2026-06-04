const request = require("supertest");
const app = require("../../app");
const notificationService = require("../../service/notificationService");

jest.mock("../../service/authService", () => ({
  getAuthHeaderFromRequest: jest.fn(() => "Bearer test-token"),
  verifyToken: jest.fn(() => Promise.resolve({ id: "test-user-id" })),
}));

jest.mock("../../service/notificationService", () => ({
  getNotifications: jest.fn(),
  markAllAsRead: jest.fn(),
  deleteAllNotifications: jest.fn(),
  markAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  createNotifications: jest.fn(),
}));

const authRequest = (method, url) =>
  request(app)[method](url).set("Authorization", "Bearer test-token");

describe("notification route entegrasyon testleri", () => {
  const originalServiceToken = process.env.SOCKET_SERVICE_TOKEN;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SOCKET_SERVICE_TOKEN = "test-service-token";
  });

  afterEach(() => {
    process.env.SOCKET_SERVICE_TOKEN = originalServiceToken;
    app.set("io", undefined);
  });

  test("GET /api/notifications kullanıcı bildirimlerini döner", async () => {
    const notifications = [
      {
        id: "notification-1",
        recipientUserId: "test-user-id",
        message: "Test bildirimi",
        isRead: false,
      },
    ];

    notificationService.getNotifications.mockResolvedValue(notifications);

    const response = await authRequest("get", "/api/notifications");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: notifications });
    expect(notificationService.getNotifications).toHaveBeenCalledWith(
      "test-user-id",
      "Bearer test-token",
    );
  });

  test("PATCH /api/notifications/read-all tüm bildirimleri okunmuş yapar", async () => {
    notificationService.markAllAsRead.mockResolvedValue();

    const response = await authRequest("patch", "/api/notifications/read-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(notificationService.markAllAsRead).toHaveBeenCalledWith(
      "test-user-id",
    );
  });

  test("PATCH /api/notifications/delete-all tüm bildirimleri siler", async () => {
    notificationService.deleteAllNotifications.mockResolvedValue();

    const response = await authRequest("patch", "/api/notifications/delete-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(notificationService.deleteAllNotifications).toHaveBeenCalledWith(
      "test-user-id",
    );
  });

  test("PATCH /api/notifications/:id/read bir bildirimi okunmuş yapar", async () => {
    const notification = {
      id: "notification-1",
      recipientUserId: "test-user-id",
      isRead: true,
    };

    notificationService.markAsRead.mockResolvedValue(notification);

    const response = await authRequest(
      "patch",
      "/api/notifications/notification-1/read",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: notification });
    expect(notificationService.markAsRead).toHaveBeenCalledWith(
      "notification-1",
      "test-user-id",
      "Bearer test-token",
    );
  });

  test("PATCH /api/notifications/:id/delete bir bildirimi siler", async () => {
    notificationService.deleteNotification.mockResolvedValue();

    const response = await authRequest(
      "patch",
      "/api/notifications/notification-1/delete",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(notificationService.deleteNotification).toHaveBeenCalledWith(
      "notification-1",
      "test-user-id",
    );
  });

  test("POST /api/notifications bildirim oluşturur ve socket event gönderir", async () => {
    const newNotification = {
      recipientUserId: "user-1",
      message: "Yeni bildirim",
    };
    const createdNotification = {
      id: "notification-1",
      recipientUserId: "user-1",
      message: "Yeni bildirim",
    };
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));

    app.set("io", { to });
    notificationService.createNotifications.mockResolvedValue([
      createdNotification,
    ]);

    const response = await request(app)
      .post("/api/notifications")
      .set("x-service-token", "test-service-token")
      .send({ notification: newNotification });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: [createdNotification],
    });
    expect(notificationService.createNotifications).toHaveBeenCalledWith(
      newNotification,
      "Bearer test-token",
    );
    expect(to).toHaveBeenCalledWith("user:user-1");
    expect(emit).toHaveBeenCalledWith("notification", createdNotification);
  });
});
