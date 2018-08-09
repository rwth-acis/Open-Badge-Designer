package i5.obd.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.OkHttpClient;

@RestController
public class ApplicationController {

    ApplicationController(){
    
    }

    @CrossOrigin()
    @GetMapping("/checkconnection")
    public String checkConnection(@RequestParam(name="msg",required=false, defaultValue="Connection confirmed!") String result) {
        System.out.println("External Component has made a connection check.");
        return result;
    }

    @CrossOrigin()
    @GetMapping("/checkxapiconnection")
    public String checkXAPIConnection(@RequestParam(name="url",required=false, defaultValue="EMPTYURL") String url, 
            @RequestParam(name="auth",required=false, defaultValue="EMPTYAUTH") String auth){
        System.out.println(url);
        System.out.println(auth);
        if(url.equals("EMPTYURL") || auth.equals("EMPTYAUTH"))
            return "Insufficient Parameters";
        System.out.println("External Component has made an xAPI connection check.");
        
        Response response = sendXAPIRequest(url+"/statements", "?since=2018-07-28T00:01:00.360Z&limit=2", auth);
        
        String body = "uninitialized";
	    try{
	        body = response.body().string();
	        System.out.println(body);
	    }catch(Exception e){
	        System.out.println("String of body could not be determined.");
	    }
        
        System.out.println(response.toString());
        System.out.println(response.message());
        
        return response.message();
    }
    
    @CrossOrigin()
    @GetMapping("/analysexapi")
    public String analyseXAPI(@RequestParam(name="functionparam1",required=true) String functionParam1,
            @RequestParam(name="functionparam2",required=true) String functionParam2,
            @RequestParam(name="key",required=true) String key,
            @RequestParam(name="constraints",required=true) String constraints,
            @RequestParam(name="url",required=false, defaultValue="EMPTYURL") String url, 
            @RequestParam(name="auth",required=false, defaultValue="EMPTYAUTH") String auth){
        System.out.println("External Component has made an xAPI analysation request.");
        System.out.println("url: "+url);
        System.out.println("auth: "+auth);
        System.out.println("key: "+key);
        System.out.println("constraints: "+constraints);
        if(url.equals("EMPTYURL") || auth.equals("EMPTYAUTH"))
            return "Insufficient Parameters";
        
        String[] separateConstraints = constraints.split(",");
        String attachment = "";
        if (separateConstraints.length > 0){
            attachment = attachment + "?";
            //int counter = 0;
            for(String constraint: separateConstraints){
                //if(counter == 3)
                //    break;
                //counter += 1;
                if(!attachment.substring(attachment.length() - 1).equals("?"))
                    attachment=attachment+"&";
                attachment=attachment+constraint.replaceFirst(":","=");
            }
        }
        
        System.out.println("attachment: "+attachment);
        Response response = sendXAPIRequest(url+"/statements", attachment, auth);
        
        String body = "uninitialized";
	    try{
	        body = response.body().string();
	        System.out.println(body);
	    }catch(Exception e){
	        System.out.println("String of body could not be determined.");
	    }
        
        System.out.println(response.toString());
        System.out.println(response.message());
        
        return response.message();
    }
    
    @CrossOrigin()
    @GetMapping("/xapitest")
    public String xAPItest(){
    
        Response response = this.sendXAPIRequest("http://localhost/data/xAPI/statements", "?since=2018-07-28T00:01:00.360Z",
                "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy");
	    String body = "uninitialized";
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
    
    private Response sendXAPIRequest(String url, String query, String auth){
        OkHttpClient client = new OkHttpClient();
        System.out.println("Attempting to send xAPI request: "+query);
        Request request = new Request.Builder()
            .url(url+query)
            .get()
            .addHeader("X-Experience-API-Version", "1.0.1")
            .addHeader("Authorization", auth)
            .addHeader("Cache-Control", "no-cache")
            .build();
        try{
            return client.newCall(request).execute();
        }catch(Exception e){
            e.printStackTrace();
        }
        return null;
        
    }

}
