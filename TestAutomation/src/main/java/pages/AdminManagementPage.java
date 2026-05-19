package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminManagementPage extends BasePage {
    public AdminManagementPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public By USER_FIRSTNAME = By.id("user-firstName");
    public By USER_LASTNAME = By.id("user-lastName");
    public By USER_EMAIL = By.id("user-email");
    public By USER_PASSWORD = By.id("user-password");
    public By CREATE_USER_BUTTON = By.id("create-user-button");
    public By TEAM_NAME = By.id("team-name");
    public By TEAM_LEAD = By.id("team-lead");
    public By CREATE_TEAM_BUTTON = By.id("create-team-button");
    public By MANAGE_TEAM_MEMBERS_BUTTON = By.id("manage-team-members-button");
    public By SAVE_TEAM_MEMBERS_BUTTON = By.id("save-team-members-button");
    public By DELETE_TEAM_BUTTON = By.id("delete-team-button");
    public By CONFIRM_DELETE_TEAM_BUTTON = By.id("confirm-delete-team-button");
    public By DELETE_USER_BUTTON = By.id("delete-user-button");
    public By CONFIRM_DELETE_USER_BUTTON = By.id("confirm-delete-user-button");
    public By CANCEL_DELETE_USER_BUTTON = By.id("cancel-delete-user-button");
    public By POPUP_CLOSE_BUTTON = By.id("popup-close-button");

    public AdminManagementPage createUser(String firstName, String lastName, String email, String password) {
        clearAndSendKeys(USER_FIRSTNAME, firstName);
        clearAndSendKeys(USER_LASTNAME, lastName);
        clearAndSendKeys(USER_EMAIL, email);
        clearAndSendKeys(USER_PASSWORD, password);
        buttonClick(CREATE_USER_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage createTeam(String teamName, String teamLeadEmail) {
        clearAndSendKeys(TEAM_NAME, teamName);
        buttonClick(TEAM_LEAD);
        buttonClick(By.id("team-lead-option-" + teamLeadEmail));
        buttonClick(CREATE_TEAM_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage openManageTeamMembers() {
        buttonClick(MANAGE_TEAM_MEMBERS_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage selectTeamMemberByEmail(String email) {
        buttonClick(By.id("team-member-" + email));
        return this;
    }

    public AdminManagementPage saveTeamMembers() {
        buttonClick(SAVE_TEAM_MEMBERS_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage deleteSelectedTeam() {
        buttonClick(DELETE_TEAM_BUTTON);
        buttonClick(CONFIRM_DELETE_TEAM_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage selectTeamByName(String teamName) {
        buttonClick(By.id("team-row-" + teamName));
        waitForPageView();
        return this;
    }

    public AdminManagementPage deleteUserByEmail(String email) {
        buttonClick(By.id("user-row-" + email));
        buttonClick(DELETE_USER_BUTTON);
        buttonClick(CONFIRM_DELETE_USER_BUTTON);
        waitForPageView();
        return this;
    }

    public AdminManagementPage tryDeleteTeamLeadUserByEmail(String email) {
        buttonClick(By.id("user-row-" + email));
        buttonClick(DELETE_USER_BUTTON);
        buttonClick(CANCEL_DELETE_USER_BUTTON);
        buttonClick(POPUP_CLOSE_BUTTON);
        waitForPageView();
        return this;
    }
}
