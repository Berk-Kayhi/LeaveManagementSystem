package base;

import components.SidebarComponent;
import data.MainData;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import pages.AdminManagementPage;
import pages.LeaveRequestPage;
import pages.LoginPage;
import pages.MainPage;

import java.time.Duration;

public class BaseTest extends MainData {
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected LoginPage loginPage;
    protected SidebarComponent sidebarComponent;
    protected AdminManagementPage adminManagementPage;
    protected LeaveRequestPage leaveRequestPage;
    protected MainPage mainPage;

    @BeforeMethod
    public void beforeTest() {
        driver = new SafariDriver();
        driver.manage().window().maximize();
        driver.manage().deleteAllCookies();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get(URL);
        loginPage = new LoginPage(driver, wait);
        sidebarComponent = new SidebarComponent(driver, wait);
        adminManagementPage = new AdminManagementPage(driver, wait);
        leaveRequestPage = new LeaveRequestPage(driver, wait);
        mainPage = new MainPage(driver, wait);
    }

    protected void loginAsAdmin() {
        boolean firstAdminCreated = loginPage.registerFirstAdminIfSetupOpen(firstName, lastName, email, password);

        if (!firstAdminCreated) {
            loginPage.fillLoginForm(email, password, rememberMe);
        }
    }

    @AfterMethod
    public void afterTest() {
        if (driver != null) {
            try {
                Thread.sleep(2500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            driver.quit();
        }
    }
}
