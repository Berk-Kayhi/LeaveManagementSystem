package components;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import base.BasePage;

import java.time.Duration;

public class SidebarComponent extends BasePage {
    public SidebarComponent(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public By MAIN_PAGE_LOCATOR = By.id("main-page");
    public By CALENDAR_PAGE_LOCATOR = By.id("calendar-page");
    public By MANAGEMENT_PAGE_LOCATOR = By.id("management-page");
    public By HISTORY_LEAVES_PAGE_LOCATOR = By.id("history-leaves-page");
    public By ADMIN_MANAGEMENT_PAGE_LOCATOR = By.id("admin-management-page");
    public By REQUEST_LEAVE_PAGE_LOCATOR = By.id("request-leave-page");
    public By NOTIFICATION_BUTTON_LOCATOR = By.id("notifications-button");
    public By QUIT_BUTTON_LOCATOR = By.id("quit-button");

    @Step("Ana sayfaya git")
    public SidebarComponent goToMainPage(){
        goToPage(MAIN_PAGE_LOCATOR, "/main");
        takeScreenshot();
        return this;
    }
    @Step("Takvim sayfasına git")
    public SidebarComponent goToCalendarPage(){
        goToPage(CALENDAR_PAGE_LOCATOR, "/calendar");
        takeScreenshot();
        return this;
    }
    @Step("İzin istekleri sayfasına git")
    public SidebarComponent goToManagementPage(){
        goToPage(MANAGEMENT_PAGE_LOCATOR, "/management");
        takeScreenshot();
        return this;
    }
    @Step("İstek geçmişi sayfasına git")
    public SidebarComponent goToHistoryLeavesPage(){
        goToPage(HISTORY_LEAVES_PAGE_LOCATOR, "/history-leaves");
        takeScreenshot();
        return this;
    }
    @Step("Admin yönetim sayfasına git")
    public SidebarComponent goToAdminManagementPage(){
        goToPage(ADMIN_MANAGEMENT_PAGE_LOCATOR, "/admin-management");
        takeScreenshot();
        return this;
    }
    @Step("İzin talebi oluşturma sayfasına git")
    public SidebarComponent goToRequestLeavePage(){
        goToPage(REQUEST_LEAVE_PAGE_LOCATOR, "/request-leave");
        takeScreenshot();
        return this;
    }
    @Step("Bildirimler panelini aç")
    public SidebarComponent openNotificationPanel(){
        openNotificationPanelWithFallback();
        validateNotificationPanelOpenedOrEmpty();
        waitHalfSecond();
        takeScreenshot();
        return this;
    }

    @Step("Bildirimler panelini kapat")
    public SidebarComponent closeNotificationPanel(){
        javascriptClick(NOTIFICATION_BUTTON_LOCATOR);
        return this;
    }

    @Step("Bildirimler panelini aç veya kapat")
    public SidebarComponent clickNotificationButton(){
        return openNotificationPanel();
    }

    @Step("Çıkış yap")
    public SidebarComponent clickQuitButton(){
        buttonClick(QUIT_BUTTON_LOCATOR);
        validateElementVisible(By.id("login-button"));
        return this;
    }

    private void goToPage(By locator, String path) {
        buttonClick(locator);
        try {
            new WebDriverWait(driver, Duration.ofSeconds(2)).until(ExpectedConditions.urlContains(path));
        } catch (TimeoutException e) {
            javascriptClick(locator);
        }
        validateUrlContains(path);
    }

    private void openNotificationPanelWithFallback() {
        buttonClick(NOTIFICATION_BUTTON_LOCATOR);
        try {
            new WebDriverWait(driver, Duration.ofSeconds(2))
                    .until(ExpectedConditions.or(
                            ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-notification-panel-active='true']")),
                            ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[normalize-space()='Aktif bildiriminiz yok']"))
                    ));
        } catch (TimeoutException e) {
            javascriptClick(NOTIFICATION_BUTTON_LOCATOR);
        }
    }

    private void validateNotificationPanelOpenedOrEmpty() {
        wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-notification-panel-active='true']")),
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[normalize-space()='Aktif bildiriminiz yok']"))
        ));
    }
}
