package data;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class MainData {
    private final long uniqueSuffix = System.currentTimeMillis();

    protected String URL = "http://localhost:5173";
    protected String firstName = "Admin";
    protected String lastName = "Test";
    protected String email = "admin@test.com";
    protected String password = "Admin123!";
    protected boolean rememberMe = true;

    protected String teamLeadFirstName = "User";
    protected String teamLeadLastName = "Lead";
    protected String teamLeadEmail = "lead" + uniqueSuffix + "@test.com";
    protected String teamLeadPassword = "Lead123!";
    protected String employeeFirstName = "User";
    protected String employeeLastName = "Employee";
    protected String employeeEmail = "employee" + uniqueSuffix + "@test.com";
    protected String employeePassword = "Employee123!";
    protected String teamName = "Automation Team " + uniqueSuffix;
    protected String rejectLeaveReason = "automation-reject-" + uniqueSuffix;
    protected String approveLeaveReason = "automation-approve-" + uniqueSuffix;
    protected String rejectLeaveDate = nextBusinessDay(LocalDate.now().plusDays(1)).toString();
    protected String approveLeaveDate = nextBusinessDay(LocalDate.parse(rejectLeaveDate).plusDays(1)).toString();
    protected String teamLeadFlowLeaveReason = "automation-lead-flow-" + uniqueSuffix;
    protected String employeeFlowLeaveReason = "automation-employee-flow-" + uniqueSuffix;
    protected String teamLeadFlowLeaveStartDate = nextBusinessDay(LocalDate.parse(approveLeaveDate).plusDays(1)).toString();
    protected String teamLeadFlowLeaveEndDate = nextBusinessDay(LocalDate.parse(teamLeadFlowLeaveStartDate).plusDays(1)).toString();
    protected String employeeFlowLeaveStartDate = nextBusinessDay(LocalDate.parse(teamLeadFlowLeaveEndDate).plusDays(1)).toString();
    protected String employeeFlowLeaveEndDate = nextBusinessDay(LocalDate.parse(employeeFlowLeaveStartDate).plusDays(1)).toString();

    protected String demoTeamLeadFirstName = "Demo";
    protected String demoTeamLeadLastName = "Lead";
    protected String demoTeamLeadEmail = "demo.lead@test.com";
    protected String demoTeamLeadPassword = "DemoLead123!";
    protected String demoEmployeeFirstName = "Demo";
    protected String demoEmployeeLastName = "Employee";
    protected String demoEmployeeEmail = "demo.employee@test.com";
    protected String demoEmployeePassword = "DemoEmployee123!";
    protected String demoSecondEmployeeFirstName = "Demo";
    protected String demoSecondEmployeeLastName = "Member";
    protected String demoSecondEmployeeEmail = "demo.member@test.com";
    protected String demoSecondEmployeePassword = "DemoMember123!";
    protected String demoTeamName = "Demo Team";
    protected String[] demoLeadLeaveReasons = createDemoLeaveReasons("demo-lead");
    protected String[] demoEmployeeLeaveReasons = createDemoLeaveReasons("demo-employee");
    protected String[] demoSecondEmployeeLeaveReasons = createDemoLeaveReasons("demo-member");
    protected String[] demoLeadLeaveStartDates = createDemoLeaveStartDates(0);
    protected String[] demoLeadLeaveEndDates = createDemoLeaveEndDates(0);
    protected String[] demoEmployeeLeaveStartDates = createDemoLeaveStartDates(5);
    protected String[] demoEmployeeLeaveEndDates = createDemoLeaveEndDates(5);
    protected String[] demoSecondEmployeeLeaveStartDates = createDemoLeaveStartDates(10);
    protected String[] demoSecondEmployeeLeaveEndDates = createDemoLeaveEndDates(10);

    private LocalDate nextBusinessDay(LocalDate date) {
        while (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY || isHoliday(date)) {
            date = date.plusDays(1);
        }
        return date;
    }

    private String[] createDemoLeaveReasons(String prefix) {
        return new String[]{
                prefix + "-1-" + uniqueSuffix,
                prefix + "-2-" + uniqueSuffix,
                prefix + "-3-" + uniqueSuffix,
                prefix + "-4-" + uniqueSuffix,
                prefix + "-5-" + uniqueSuffix
        };
    }

    private String[] createDemoLeaveStartDates(int offset) {
        String[] dates = new String[5];
        for (int i = 0; i < dates.length; i++) {
            dates[i] = demoLeaveStartDate(offset + i).toString();
        }
        return dates;
    }

    private String[] createDemoLeaveEndDates(int offset) {
        String[] dates = new String[5];
        for (int i = 0; i < dates.length; i++) {
            LocalDate startDate = demoLeaveStartDate(offset + i);
            dates[i] = nextBusinessDay(startDate.plusDays(1)).toString();
        }
        return dates;
    }

    private LocalDate demoLeaveStartDate(int offset) {
        LocalDate date = nextBusinessDay(LocalDate.now().plusDays(1));
        for (int i = 0; i < offset; i++) {
            LocalDate endDate = nextBusinessDay(date.plusDays(1));
            date = nextBusinessDay(endDate.plusDays(1));
        }
        return date;
    }

    private boolean isHoliday(LocalDate date) {
        String dateText = date.toString();
        return dateText.equals("2026-01-01")
                || dateText.equals("2026-03-19")
                || dateText.equals("2026-03-20")
                || dateText.equals("2026-03-21")
                || dateText.equals("2026-03-22")
                || dateText.equals("2026-04-23")
                || dateText.equals("2026-05-01")
                || dateText.equals("2026-05-19")
                || dateText.equals("2026-05-26")
                || dateText.equals("2026-05-27")
                || dateText.equals("2026-05-28")
                || dateText.equals("2026-05-29")
                || dateText.equals("2026-05-30")
                || dateText.equals("2026-07-15")
                || dateText.equals("2026-08-30")
                || dateText.equals("2026-10-28")
                || dateText.equals("2026-10-29");
    }

}
