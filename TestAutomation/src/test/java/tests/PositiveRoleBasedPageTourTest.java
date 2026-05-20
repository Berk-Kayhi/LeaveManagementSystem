package tests;

import base.BaseTest;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.annotations.Test;

@Epic("Leave Management UI Automation")
@Feature("Role Based Page Tour")
public class PositiveRoleBasedPageTourTest extends BaseTest {
    @Test
    @Story("Rol bazlı sayfa turu")
    @Description("Admin, takım lideri ve çalışan rollerinde erişilebilir sayfaları ve bildirim panelini gezer.")
    public void positiveRoleBasedPageTourTest() {
        loginAsAdmin();
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToManagementPage()
                .goToHistoryLeavesPage()
                .goToAdminManagementPage()
                .openNotificationPanel()
                .closeNotificationPanel()
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
                .openNotificationPanel()
                .closeNotificationPanel()
                .clickQuitButton();

        loginPage.fillLoginForm(demoEmployeeEmail, demoEmployeePassword, rememberMe);
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToRequestLeavePage()
                .openNotificationPanel()
                .closeNotificationPanel()
                .clickQuitButton();

        loginPage.fillLoginForm(demoSecondEmployeeEmail, demoSecondEmployeePassword, rememberMe);
        sidebarComponent
                .goToMainPage()
                .goToCalendarPage()
                .goToRequestLeavePage()
                .openNotificationPanel()
                .closeNotificationPanel();
    }
}
