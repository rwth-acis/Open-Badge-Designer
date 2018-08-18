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
import java.util.List;
import java.util.ArrayList;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import jdk.nashorn.internal.runtime.JSONListAdapter;

import java.time.ZonedDateTime;


/**
* The RestController which handles all Requests to this Backend Application.
* At the time of writing this, all methods in this class are either only used
* internally (private) or accessible via HTTP GET calls from any source (CrossOrigin).
*/
@RestController
public class ApplicationController {


    /**
    * This method implements a simple connection check, allowing a Frontend instance
    * to request an answer from the Backend.
    *
    * The Frontend can optionally attach a custom message which will be returned to it
    * instead of the default, which allows to assure that sending data to the Backend
    * instance works as intended.
    *
    * @param msg (Optional) the custom message to return to sender.
    * @return the custom message if chosen in the Frontend or the default message
    */
    @CrossOrigin()
    @GetMapping("/checkconnection")
    public String checkConnection(@RequestParam(name="msg",required=false, defaultValue="Connection confirmed!") String result) {
        System.out.println("External Component has made a connection check.");
        return result;
    }
    
    
    /**
    * This method implements a connection check between this Backend instance and
    * the Learning Record Store (LRS) used to handle xAPI data.
    * The used LRS during the writing of the thesis this code is part of was Learning Locker,
    * but due to following the xAPI pathways a different LRS should function as well.
    *
    * While the parameters are tagged as optional to allow returning custom errors in
    * this case, they are required to actually connect to an LRS.
    *
    * @param url (Optional) the URL at which the used LRS is hosted
    * @param auth (Optional) the HTTP authentication string used to access the LRS
    * @return the success status of the connection
    */
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
    /**
    * This method handles any actual requests.
    * It is used to retrieve xAPI statements fitting the query and
    * simplify them into datasets which can be visualized in the Frontend.
    *
    * It also generates recommendations used to design Open Badges in the Frontend.
    *
    * @param functionParam1 value of the first dropdown menu in the Frontend
    * @param functionParam2 value of the second dropdown menu in the Frontend
    * @param key the key to look for in each JSON-encoded xAPI statement
    * @param constraints string of comma-separated key:value pairs used as constraints in the query to the LRS
    * @param url (OPTIONAL) the URL at which the used LRS is hosted
    * @param auth (OPTIONAL) the HTTP authentication string used to access the LRS
    * @return a String containing either an Error Message or a JSON-style collection of the results to be displayed by the Frontend
    */
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
        
        List<String> values = new ArrayList<String>();
        
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
                    
                    To go deeper into the JSON of a statement (not necessary in this version) it may be helpful to 
                    adapt getValuesAtKeys() to proceed recursively and check for each Object whether it's a 
                    JSON Object or a JSONListAdapter
                */
                JSONListAdapter statements = (JSONListAdapter)body.get("statements");
                values.addAll(getValuesAtKey(statements, key));
                System.out.println(statements);
                
                if(body.get("more") == null || body.get("more").equals("")){
                    System.out.println("more block is empty. exiting loop.");
                    break;
                }
                
                attachment = body.get("more").toString();
            }catch(IOException|ScriptException se){
                System.out.println("JSON Parsing failed!");
                return "JSON Parsing failed. This probably means the LRS could not be reached. Please check your connection.";
            }
        }while(true);
        
        Result result = compileResults(values, key);
        result.setStatus("If this arrives things worked.");
        result.setKeys("time","occurences");
        
        return result.toJSONString();
    }
    
    /**
    * This method was implemented as an early test to send an xAPI request and receive a result.
    * it is essentially a simpler version of the checkXAPIConnection() method which does not yet
    * receive any parameters. It is not currently used by the Frontend.
    *
    * @return the success state determined by the LRS or an error message.
    *
    */
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
    
    /**
    * This method implements the sending of queries to the LRS.
    * It builds an HTTP Request out of the URL and query information and adds
    * headers needed for access.
    *
    * @param url the URL at which the used LRS is hosted
    * @param query the URL attachment specifying exactly where in the LRS which xAPI data should be returned
    * @param auth the authentication needed to access the LRS 
    * @return an OkHTTP3.Response Object containing information on the HTTP Response by the LRS
    */
    private Response sendXAPIRequest(String url, String query, String auth){
        OkHttpClient client = new OkHttpClient();
        System.out.println("Attempting to send xAPI request: "+query);
        Request request = new Request.Builder()
            .url(url+query)
            .get()
            .addHeader("X-Experience-API-Version", "1.0.3")
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
    
    /**
    * This is a helper method to simplify received statements into
    * the actual needed values.
    * Currently only String values are supported.
    *
    * @param statements the JSONListAdapter containing a Collection of xAPI statements
    * @param key the key to look for in each JSON-encoded (now turned into a Map) xAPI statement
    * @return ArrayList<String> of all found values.
    */
    private List<String> getValuesAtKey(JSONListAdapter statements, String key){
        List<String> result = new ArrayList<String>();
    
        for(Object statement : statements.values()){
            Map stmtmap = (Map) statement;
            result.add((String) stmtmap.get(key));
        }
        
        return result;
    }
    
    private Result compileResults(List<String> in, String key){
        Result res = new Result();
        if(key.equals("timestamp")){
            int[] counter = new int[24];
            for(String timestamp : in){
                System.out.println("timestamp: "+timestamp);
                ZonedDateTime time = ZonedDateTime.parse(timestamp);
                counter[time.getHour()]++;
            }
            for(int i=0; i<counter.length; i++){
                res.addPair(i, counter[i]);
            }
        }
        return res;
    }

}
