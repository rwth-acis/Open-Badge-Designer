package i5.obd.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.Request;
import okhttp3.Response;
import okhttp3.OkHttpClient;

import java.util.Map;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import jdk.nashorn.internal.runtime.JSONListAdapter;

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
        
        Response response = sendXAPIRequest(url, "/data/xAPI/statements"+"?since=2018-07-28T00:01:00.360Z&limit=2", auth);
        
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
        
        // TODO:: handle error message in Frontend
        if(url.equals("EMPTYURL") || auth.equals("EMPTYAUTH"))
            return "Insufficient Parameters";
        
        // Split up constraints into separate Strings and use them to build a query for the LRS
        String[] separateConstraints = constraints.split(",");
        String attachment = "";
        if (separateConstraints.length > 0){
            attachment = attachment + "?";
            for(String constraint: separateConstraints){
                if(!attachment.substring(attachment.length() - 1).equals("?"))
                    attachment=attachment+"&";
                attachment=attachment+constraint.replaceFirst(":","=");
            }
        }
        
        // add path to statements to attachment
        attachment = "/data/xAPI/statements" + attachment;
        
        System.out.println("attachment: "+attachment);
        
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("javascript");
        
        Response response;
        
        do{
            response = sendXAPIRequest(url, attachment, auth);
            if(response == null)
                break;
            try{
                // JSON is turned into a Java Map using a Javascript call to avoid unnecessary dependancies.
                String javascript = "Java.asJSONCompatible(" + response.body().string() + ")";
                Map body = (Map) engine.eval(javascript);
            
                System.out.println("more: " + body.get("more"));
                
                /*
                    The parsed JSON turns into a format where Lists are handled as JSONListAdapter Objects
                    and JSON Objects are handled as Objects which are essentially Maps, though not automatically
                    recognized (thus the casting).
                    
                    To go deeper into JSON (not necessary in this version) it may be helpful to proceed
                    recursively and check for each Object whether it's a JSON Object or a JSONListAdapter
                */
                JSONListAdapter statements = (JSONListAdapter)body.get("statements");
                for(Object statement : statements.values()){
                    Map stmtmap = (Map) statement;
                    System.out.println("statement: " + stmtmap.get("timestamp"));
                }
                
                System.out.println("============================================");
                
                if(body.get("more") == null || body.get("more").equals("")){
                    System.out.println("more block is empty. exiting loop.");
                    break;
                }
                
                attachment = body.get("more").toString();
            }catch(IOException|ScriptException se){
                System.out.println("JSON Parsing failed!");
                return "JSON Parsing failed!";
            }
        }while(true);
        
        
        return "Everything seems to have worked.";
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
