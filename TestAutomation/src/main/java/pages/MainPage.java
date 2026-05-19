package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MainPage extends BasePage {
    public MainPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public By REJECT_LEAVE_BUTTON = By.id("reject-leave-button");
    public By APPROVE_LEAVE_BUTTON = By.id("approve-leave-button");
    public By CONFIRM_REJECT_LEAVE_BUTTON = By.id("confirm-leave-reject-button");
    public By CONFIRM_APPROVE_LEAVE_BUTTON = By.id("confirm-leave-approve-button");
    public By PERSONAL_DASHBOARD_TAB = By.id("personal-dashboard-tab");
    public By TEAM_DASHBOARD_TAB = By.id("team-dashboard-tab");
    public By POPUP_CLOSE_BUTTON = By.id("popup-close-button");

    public MainPage rejectLeaveByReason(String reason) {
        buttonClick(By.id("pending-leave-" + reason));
        buttonClick(REJECT_LEAVE_BUTTON);
        buttonClick(CONFIRM_REJECT_LEAVE_BUTTON);
        waitForPageView();
        return this;
    }

    public MainPage approveLeaveByReason(String reason) {
        buttonClick(By.id("pending-leave-" + reason));
        buttonClick(APPROVE_LEAVE_BUTTON);
        buttonClick(CONFIRM_APPROVE_LEAVE_BUTTON);
        waitForPageView();
        return this;
    }

    public MainPage openPersonalLeaveByReason(String reason) {
        buttonClick(PERSONAL_DASHBOARD_TAB);
        buttonClick(By.id("my-leave-" + reason));
        buttonClick(POPUP_CLOSE_BUTTON);
        buttonClick(TEAM_DASHBOARD_TAB);
        waitForPageView();
        return this;
    }

    public MainPage goToPersonalDashboard() {
        buttonClick(PERSONAL_DASHBOARD_TAB);
        waitForPageView();
        return this;
    }

    public MainPage goToTeamDashboard() {
        buttonClick(TEAM_DASHBOARD_TAB);
        waitForPageView();
        return this;
    }
}
