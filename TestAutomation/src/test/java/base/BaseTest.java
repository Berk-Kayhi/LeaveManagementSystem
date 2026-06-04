package base;

import components.SidebarComponent;
import data.MainData;
import io.qameta.allure.Attachment;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.ITestResult;
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

    @BeforeMethod(alwaysRun = true)
    public void beforeTest() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get(System.getProperty("app.url", URL));
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

    @AfterMethod(alwaysRun = true)
    public void afterTest(ITestResult result) {
        if (driver != null) {
            if (!result.isSuccess()) {
                takeFailureScreenshot();
            }
            driver.quit();
        }
    }

    @Attachment(value = "Hata Anı Ekran Görüntüsü", type = "image/png")
    public byte[] takeFailureScreenshot() {
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }
}
