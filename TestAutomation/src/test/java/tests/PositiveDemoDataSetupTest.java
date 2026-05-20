package tests;

import base.BaseTest;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.annotations.Test;

@Epic("Leave Management UI Automation")
@Feature("Demo Data Setup")
public class PositiveDemoDataSetupTest extends BaseTest {
    @Test
    @Story("Demo veri hazırlama")
    @Description("Admin, takım lideri, iki çalışan, takım ve farklı durumlarda izin talepleri oluşturur.")
    public void positiveDemoDataSetupTest() {
        loginAsAdmin();
        sidebarComponent.goToAdminManagementPage();

        adminManagementPage
                .createUser(demoTeamLeadFirstName, demoTeamLeadLastName, demoTeamLeadEmail, demoTeamLeadPassword)
                .createUser(demoEmployeeFirstName, demoEmployeeLastName, demoEmployeeEmail, demoEmployeePassword)
                .createUser(demoSecondEmployeeFirstName, demoSecondEmployeeLastName, demoSecondEmployeeEmail, demoSecondEmployeePassword)
                .createTeam(demoTeamName, demoTeamLeadEmail)
                .openManageTeamMembers()
                .selectTeamMemberByEmail(demoEmployeeEmail)
                .selectTeamMemberByEmail(demoSecondEmployeeEmail)
                .saveTeamMembers();

        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(demoTeamLeadEmail, demoTeamLeadPassword, rememberMe);
        sidebarComponent.goToRequestLeavePage();
        createDemoLeaveRequests(demoLeadLeaveStartDates, demoLeadLeaveEndDates, demoLeadLeaveReasons);
        sidebarComponent.clickQuitButton();

        loginAsAdmin();
        mainPage
                .approveLeaveByReason(demoLeadLeaveReasons[0])
                .rejectLeaveByReason(demoLeadLeaveReasons[1]);
        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(demoEmployeeEmail, demoEmployeePassword, rememberMe);
        sidebarComponent.goToRequestLeavePage();
        createDemoLeaveRequests(demoEmployeeLeaveStartDates, demoEmployeeLeaveEndDates, demoEmployeeLeaveReasons);
        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(demoSecondEmployeeEmail, demoSecondEmployeePassword, rememberMe);
        sidebarComponent.goToRequestLeavePage();
        createDemoLeaveRequests(demoSecondEmployeeLeaveStartDates, demoSecondEmployeeLeaveEndDates, demoSecondEmployeeLeaveReasons);
        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(demoTeamLeadEmail, demoTeamLeadPassword, rememberMe);
        mainPage
                .openPersonalLeaveByReason(demoLeadLeaveReasons[0])
                .approveLeaveByReason(demoEmployeeLeaveReasons[0])
                .rejectLeaveByReason(demoEmployeeLeaveReasons[1]);

        sidebarComponent.goToManagementPage();
        mainPage
                .approveLeaveByReason(demoSecondEmployeeLeaveReasons[0])
                .rejectLeaveByReason(demoSecondEmployeeLeaveReasons[1]);
    }

    private void createDemoLeaveRequests(String[] startDates, String[] endDates, String[] reasons) {
        for (int i = 0; i < reasons.length; i++) {
            leaveRequestPage.createAnnualLeaveRequest(startDates[i], endDates[i], reasons[i]);
        }
    }
}
