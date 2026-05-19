package tests;

import base.BaseTest;
import org.testng.annotations.Test;

public class PositiveRoleBasedPageTourTest extends BaseTest {
    @Test
    public void positiveRoleBasedPageTourTest() {
        loginAsAdmin();
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToManagementPage()
                .goToHistoryLeavesPage()
                .goToAdminManagementPage()
                .clickNotificationButton()
                .clickNotificationButton()
                .clickQuitButton();

        loginPage.fillLoginForm(demoTeamLeadEmail, demoTeamLeadPassword, rememberMe);
        sidebarComponent.goToMainPage();
        mainPage
                .goToPersonalDashboard()
                .goToTeamDashboard();
        sidebarComponent
                .goToCalendarPage()
                .goToManagementPage()
                .goToHistoryLeavesPage()
                .goToRequestLeavePage()
                .clickNotificationButton()
                .clickNotificationButton()
                .clickQuitButton();

        loginPage.fillLoginForm(demoEmployeeEmail, demoEmployeePassword, rememberMe);
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToRequestLeavePage()
                .clickNotificationButton()
                .clickNotificationButton()
                .clickQuitButton();

        loginPage.fillLoginForm(demoSecondEmployeeEmail, demoSecondEmployeePassword, rememberMe);
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToRequestLeavePage()
                .clickNotificationButton()
                .clickNotificationButton();
    }
}
