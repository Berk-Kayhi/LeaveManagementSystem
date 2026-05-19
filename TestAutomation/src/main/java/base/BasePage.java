package base;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BasePage {
    private static final int QA_VIEW_DELAY_MS = 500;
    private static final int PAGE_VIEW_DELAY_MS = 1000;

    protected WebDriver driver ;
    protected WebDriverWait wait ;

    public BasePage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    protected void sendKeys (By locator, String data){
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).sendKeys(data);
        waitForQaView();
    }

    protected void clearAndSendKeys(By locator, String data){
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
        element.clear();
        element.sendKeys(data);
        waitForQaView();
    }

    protected void buttonClick (By locator){
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
        waitForQaView();
    }

    protected void waitForQaView() {
        waitForQaView(QA_VIEW_DELAY_MS);
    }

    protected void waitForPageView() {
        waitForQaView(PAGE_VIEW_DELAY_MS);
    }

    protected void waitForQaView(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
