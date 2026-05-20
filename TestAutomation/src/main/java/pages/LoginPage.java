package pages;

import base.BasePage;

import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage extends BasePage {
    public LoginPage(WebDriver driver, WebDriverWait wait){
        super(driver, wait);
    }

    public By EMAIL = By.id("login-email");
    public By PASSWORD = By.id("login-password");
    public By REMEMBER_ME = By.id("login-remember");
    public By LOGIN_BUTTON = By.id("login-button");
    public By ADMIN_FIRSTNAME = By.id("admin-firstName");
    public By ADMIN_LASTNAME = By.id("admin-lastName");
    public By ADMIN_EMAIL = By.id("admin-email");
    public By ADMIN_PASSWORD = By.id("admin-password");
    public By ADMIN_BUTTON = By.id("admin-button");

    @Step("İlk admin kurulum formu açıksa admin oluştur: {email}")
    public boolean registerFirstAdminIfSetupOpen(String firstName, String lastName, String email, String password) {
        wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(ADMIN_BUTTON),
                ExpectedConditions.visibilityOfElementLocated(LOGIN_BUTTON)
        ));

        if (driver.findElements(ADMIN_BUTTON).isEmpty()) {
            return false;
        }

        clearAndSendKeys(ADMIN_FIRSTNAME, firstName);
        clearAndSendKeys(ADMIN_LASTNAME, lastName);
        clearAndSendKeys(ADMIN_EMAIL, email);
        clearAndSendKeys(ADMIN_PASSWORD, password);
        buttonClick(ADMIN_BUTTON);
        validateUrlContains("/main");
        return true;
    }

    @Step("Giriş yap: {email}")
    public LoginPage fillLoginForm(String email, String password, boolean rememberMe) {
        clearAndSendKeys(EMAIL, email);
        clearAndSendKeys(PASSWORD, password);
        if (rememberMe) {
            buttonClick(REMEMBER_ME);
        }
        buttonClick(LOGIN_BUTTON);
        validateUrlContains("/main");
        return this;
    }

}
