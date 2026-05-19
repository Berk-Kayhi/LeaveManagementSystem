package pages;

import base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LeaveRequestPage extends BasePage {
    public LeaveRequestPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public By LEAVE_TYPE = By.id("leave-type");
    public By ANNUAL_LEAVE_TYPE = By.id("leave-type-annual");
    public By LEAVE_REASON = By.id("leave-reason");
    public By SUBMIT_LEAVE_REQUEST_BUTTON = By.id("submit-leave-request-button");
    public By DATE_PICKER_NEXT_MONTH = By.id("date-picker-next-month");

    public LeaveRequestPage createAnnualLeaveRequest(String startDate, String endDate, String reason) {
        buttonClick(LEAVE_TYPE);
        buttonClick(ANNUAL_LEAVE_TYPE);
        selectDate(startDate);
        selectDate(endDate);
        clearAndSendKeys(LEAVE_REASON, reason);
        buttonClick(SUBMIT_LEAVE_REQUEST_BUTTON);
        waitForPageView();
        return this;
    }

    private void selectDate(String date) {
        By dateButton = By.id("date-day-" + date);
        for (int i = 0; i < 12; i++) {
            if (!driver.findElements(dateButton).isEmpty()) {
                buttonClick(dateButton);
                return;
            }
            buttonClick(DATE_PICKER_NEXT_MONTH);
        }
        buttonClick(dateButton);
    }
}
