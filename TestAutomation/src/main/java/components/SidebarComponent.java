package components;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import base.BasePage;

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

    public SidebarComponent goToMainPage(){
        buttonClick(MAIN_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent goToCalendarPage(){
        buttonClick(CALENDAR_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent goToManagementPage(){
        buttonClick(MANAGEMENT_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent goToHistoryLeavesPage(){
        buttonClick(HISTORY_LEAVES_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent goToAdminManagementPage(){
        buttonClick(ADMIN_MANAGEMENT_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent goToRequestLeavePage(){
        buttonClick(REQUEST_LEAVE_PAGE_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent clickNotificationButton(){
        buttonClick(NOTIFICATION_BUTTON_LOCATOR);
        waitForPageView();
        return this;
    }
    public SidebarComponent clickQuitButton(){
        buttonClick(QUIT_BUTTON_LOCATOR);
        waitForPageView();
        return this;
    }
}
