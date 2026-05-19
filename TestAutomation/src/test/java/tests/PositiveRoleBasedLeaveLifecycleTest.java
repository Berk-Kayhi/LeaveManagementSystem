package tests;

import base.BaseTest;
import org.testng.annotations.Test;

public class PositiveRoleBasedLeaveLifecycleTest extends BaseTest {
    @Test
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
