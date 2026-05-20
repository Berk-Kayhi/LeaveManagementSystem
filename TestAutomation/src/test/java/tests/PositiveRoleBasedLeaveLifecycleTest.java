package tests;

import base.BaseTest;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;
import org.testng.annotations.Test;

@Epic("Leave Management UI Automation")
@Feature("Role Based Leave Lifecycle")
public class PositiveRoleBasedLeaveLifecycleTest extends BaseTest {
    @Test
    @Story("Uçtan uca izin onay akışı")
    @Description("Admin, takım lideri ve çalışan rolleriyle kullanıcı, takım, izin talebi, onay/red ve temizlik akışını doğrular.")
    public void positiveRoleBasedLeaveLifecycleTest() {
        loginAsAdmin();
        sidebarComponent.goToAdminManagementPage();

        adminManagementPage
                .createUser(teamLeadFirstName, teamLeadLastName, teamLeadEmail, teamLeadPassword)
                .createUser(employeeFirstName, employeeLastName, employeeEmail, employeePassword)
                .createTeam(teamName, teamLeadEmail)
                .openManageTeamMembers()
                .selectTeamMemberByEmail(employeeEmail)
                .saveTeamMembers();

        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(teamLeadEmail, teamLeadPassword, rememberMe);
        sidebarComponent.goToRequestLeavePage();
        leaveRequestPage.createAnnualLeaveRequest(teamLeadFlowLeaveStartDate, teamLeadFlowLeaveEndDate, teamLeadFlowLeaveReason);
        sidebarComponent.clickQuitButton();

        loginAsAdmin();
        mainPage.approveLeaveByReason(teamLeadFlowLeaveReason);
        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(employeeEmail, employeePassword, rememberMe);
        sidebarComponent.goToRequestLeavePage();
        leaveRequestPage.createAnnualLeaveRequest(employeeFlowLeaveStartDate, employeeFlowLeaveEndDate, employeeFlowLeaveReason);
        sidebarComponent.clickQuitButton();

        loginPage.fillLoginForm(teamLeadEmail, teamLeadPassword, rememberMe);
        mainPage
                .openPersonalLeaveByReason(teamLeadFlowLeaveReason)
                .approveLeaveByReason(employeeFlowLeaveReason);
        sidebarComponent.clickQuitButton();

        loginAsAdmin();
        sidebarComponent.goToAdminManagementPage();
        adminManagementPage
                .selectTeamByName(teamName)
                .deleteSelectedTeam()
                .deleteUserByEmail(employeeEmail)
                .deleteUserByEmail(teamLeadEmail);
    }
}
