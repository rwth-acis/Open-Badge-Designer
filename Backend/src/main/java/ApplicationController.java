package hello;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.OkHttpClient;

@RestController
public class ApplicationController {

    @CrossOrigin()
    @GetMapping("/checkconnection")
    public String checkConnection(@RequestParam(required=false, defaultValue="Connection confirmed!") String result) {
        System.out.println("External Component has made a connection check.");
        return result;
    }

    @CrossOrigin()
    @GetMapping("/checkxapiconnection")
    public String checkXAPIConnection(@RequestParam(required=false, defaultValue="") String url, 
            @RequestParam(required=false, defaultValue="") String auth){
            
        if(url == "" || auth == "")
            return "Insufficient Parameters";
        System.out.println("External Component has made an xAPI connection check.");
        
        Response response = sendXPIRequest(url, "", auth);
        
        if(response == null){
            return "Connection Failed.";
        }else{
            return "Connection Succeeded.";
        }
    }
    
    @CrossOrigin()
    @GetMapping("/xapitest")
    public String xAPItest(){
    
        Response response = sendXAPIRequest("http://localhost/data/xAPI/statements", "?since=2018-07-28T00:01:00.360Z",
                "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy");
	    String body = "uninitialized";
	    try{
	        response = client.newCall(request).execute();
	    }catch(Exception e){
	        System.out.println("Something went wrong");
	        response = null;
	    }
	    try{
	        body = response.body().string();
	    }catch(Exception e){
	        System.out.println("String of body could not be determined.");
	    }
	    try{
	        return body;
	    }catch(Exception e){
	        return "Failed.";
	    }
    }
    
    public static Response sendXAPIRequest(String url, String query, String auth){
        OkHttpClient client = new OkHttpClient();
        System.out.println("Attempting to send xAPI request.");
        Request request = new Request.Builder()
            .url(url+query)
            .get()
            .addHeader("X-Experience-API-Version", "1.0.1")
            .addHeader("Authorization", auth)
            .addHeader("Cache-Control", "no-cache")
            .build();
        try{
            return client.newCall(request).execute();
        catch(Exception e){
            e.printStckTrace();
            return null;
        }
        
    }

}
