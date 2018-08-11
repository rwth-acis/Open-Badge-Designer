package i5.obd.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
* The Application class does not contain any code, it is simply used to allow
* Spring to boot the code via a main method.
*/
@SpringBootApplication
public class Application {

    /**
    * The main method used to launch the Application.
    * @param args any attached arguments will be passed to Spring
    */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
