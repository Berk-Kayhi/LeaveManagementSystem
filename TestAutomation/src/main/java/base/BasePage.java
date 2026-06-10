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
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        waitHalfSecond();
        element.sendKeys(data);
    }

    protected void clearAndSendKeys(By locator, String data){
        waitForAppReady();
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        waitHalfSecond();
        element.clear();
        element.sendKeys(data);
    }

    protected void buttonClick (By locator){
        waitForAppReady();
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", element);
        waitHalfSecond();
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
        waitHalfSecond();
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected void validateUrlContains(String path) {
        wait.until(ExpectedConditions.urlContains(path));
        waitForAppReady();
        waitHalfSecond();
    }

    protected void validateElementVisible(By locator) {
        waitForAppReady();
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        waitHalfSecond();
    }

    protected void validateElementInvisible(By locator) {
        waitUntilInvisible(locator);
        waitForAppReady();
        waitHalfSecond();
    }

    protected void waitHalfSecond() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Attachment(value = "Test Adımı Ekran Görüntüsü", type = "image/png")
    protected byte[] takeScreenshot() {
        waitForAppReady();
        waitHalfSecond();
        return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
    }

    protected void waitForAppReady() {
        wait.until(webDriver -> {
            try {
                return ((JavascriptExecutor) webDriver)
                        .executeScript("return document.readyState").equals("complete");
            } catch (WebDriverException e) {
                return false;
            }
        });
        waitUntilInvisible(By.cssSelector("[data-testid='page-loader']"));
        waitUntilInvisible(By.xpath("//*[normalize-space()='Veriler hazırlanıyor...']"));
        waitUntilInvisible(By.xpath("//*[normalize-space()='Kaydediliyor...']"));
    }

    private void waitUntilInvisible(By locator) {
        wait.until(webDriver -> {
            try {
                return webDriver.findElements(locator).stream().noneMatch(WebElement::isDisplayed);
            } catch (WebDriverException e) {
                return false;
            }
        });
    }

}
