package base;

import io.qameta.allure.Attachment;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePage {
    protected WebDriver driver ;
    protected WebDriverWait wait ;

    public BasePage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    protected void sendKeys (By locator, String data){
        waitForAppReady();
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).sendKeys(data);
    }

    protected void clearAndSendKeys(By locator, String data){
        waitForAppReady();
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        element.clear();
        element.sendKeys(data);
    }

    protected void buttonClick (By locator){
        waitForAppReady();
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", element);
        try {
            element.click();
        } catch (WebDriverException e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    protected void javascriptClick(By locator) {
        waitForAppReady();
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", element);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected void validateUrlContains(String path) {
        wait.until(ExpectedConditions.urlContains(path));
        waitForAppReady();
    }

    protected void validateElementVisible(By locator) {
        waitForAppReady();
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void validateElementInvisible(By locator) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
        waitForAppReady();
    }

    protected void waitForVisualTransition(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Attachment(value = "Test Adımı Ekran Görüntüsü", type = "image/png")
    protected byte[] takeScreenshot() {
        waitForAppReady();
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }

    protected void waitForAppReady() {
        wait.until(webDriver -> ((JavascriptExecutor) webDriver)
                .executeScript("return document.readyState").equals("complete"));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[data-testid='page-loader']")));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[normalize-space()='Veriler hazırlanıyor...']")));
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[normalize-space()='Kaydediliyor...']")));
    }

}
