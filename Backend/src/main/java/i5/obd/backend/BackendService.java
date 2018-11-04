package i5.obd.backend;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import java.net.HttpURLConnection;
import java.net.URL;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import java.lang.NumberFormatException;
import java.lang.Integer;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import jdk.nashorn.internal.runtime.JSONListAdapter;

import java.time.ZonedDateTime;

/**
 * main class of this Service.
 * 
 * 
 * @author Daniel Schruff
 * 
 * @version 0.1
 */
@Path("")
public class BackendService {
	/*
	    unused test API methods. leaving them here for now in case someone wants to see
	    the most basic form of these methods.
	
	@GET
	@Path("/{name}")
	public Response getMsg(@PathParam("name") String name) {
		String output = "Welcome : " + name;
		return corsResponseBuilder(200, output);
	}
	@GET
	@Path("/ttest")
	public Response getTest() {
		String output = "TestTestTest";
		return corsResponseBuilder(200,output);
	}*/
	
	/////////////////////////////////////////////////////////////////
	
	
	
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
    @GET
    @Path("/checkconnection")
    public Response checkConnection(@DefaultValue("Connection confirmed!") @QueryParam("msg") String result) {
        System.out.println("External Component has made a connection check.");
        return corsResponseBuilder(200, result);
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
    @GET
    @Path("/checkxapiconnection")
    public Response checkXAPIConnection(@DefaultValue("EMPTYURL") @QueryParam("url") String url,
            @DefaultValue("EMPTYAUTH") @QueryParam("auth") String auth){

        System.out.println(url);
        System.out.println(auth);
        if(url.equals("EMPTYURL") || auth.equals("EMPTYAUTH"))
            return corsResponseBuilder(200, "Insufficient Parameters");
        System.out.println("External Component has made an xAPI connection check.");
        
        String response;
		try {
			response = sendXAPIRequest(url, "/data/xAPI/statements"+"?since=2018-07-28T00:01:00.360Z&limit=2", auth);
			System.out.println("response received, attempting to return.");
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("sendXAPIRequest failed.");
			return corsResponseBuilder(200, "sendXAPIRequest failed.");
		}
        
	    System.out.println(response);
        
        return corsResponseBuilder(200, "Everything seems to have worked.");
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
    @GET
    @Path("/analysexapi")
    public Response analyseXAPI(
            @DefaultValue("EMPTY") @QueryParam("key") String key,
            @DefaultValue("EMPTY") @QueryParam("objectid") String objectID,
            @DefaultValue("EMPTY") @QueryParam("actionid") String actionID,
            @DefaultValue("EMPTY") @QueryParam("constraints") String constraints,
            @DefaultValue("EMPTY") @QueryParam("url") String url,
            @DefaultValue("EMPTY") @QueryParam("auth") String auth,
            @DefaultValue("EMPTY") @QueryParam("recommend") String recommend){
            
        System.out.println("External Component has made an xAPI analysation request.");
        System.out.println("url: "+url);
        System.out.println("auth: "+auth);
        System.out.println("key: "+key);
        System.out.println("constraints: "+constraints);
        
        // TODO:: handle error message in Frontend
        if(url.equals("EMPTYURL") || auth.equals("EMPTYAUTH"))
            return corsResponseBuilder(200, "Insufficient Parameters");
        
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
        
        // add statements path to attachment
        attachment = "/data/xAPI/statements" + attachment;
        
        System.out.println("attachment: "+attachment);
        
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("javascript");
        
        String response;
        
        List<String> values = new ArrayList<String>();
        
        do{
            try {
				response = sendXAPIRequest(url, attachment, auth);
			} catch (IOException e) {
				e.printStackTrace();
				return corsResponseBuilder(200, "sendXAPIRequest failed.");
			}
            System.out.println("Response: " + response);
            if(response == null)
                break;
            try{
                // JSON is turned into a Java Map using a Javascript call to avoid unnecessary dependancies.
                String javascript = "Java.asJSONCompatible(" + response + ")";
                Object evaluation = engine.eval(javascript);
                if(!(evaluation instanceof Map))
                	System.out.println("JSON could not be parsed");
                // On proper use, the evaluation should ALWAYS return a Map.
                @SuppressWarnings("rawtypes") 
				Map body = (Map) evaluation;
            
                System.out.println("more: " + body.get("more"));
                
                /* 
                 * 
                 *   The parsed JSON turns into a format where Lists are handled as JSONListAdapter Objects
                 *   and JSON Objects are handled as Objects which are essentially Maps, though not automatically
                 *   recognized (thus the casting).
                 *   
                 *   Caution: In this prototype any key is assumed to be either a timestamp variation, or a score extension.
                 *   
                 *   To go deeper into the JSON of a statement automatically (not necessary in this version) 
                 *   it will be needed to adapt getValuesAtKeys() to proceed recursively and check for each 
                 *   Object whether it's a JSON Object (Map) or a JSONListAdapter or specify dedicated locations 
                 *   to check for (such as the extensions section of the results which can be part of a statement).
                */
                JSONListAdapter statements = (JSONListAdapter)body.get("statements");
                
                if (key.equals("hour") || key.equals("day") || key.equals("month")){
                    values.addAll(getValuesAtKey(statements, "timestamp"));
                }else{
                    values.addAll(getValuesAtKey(statements, key));
                    /* TODO:: Real statements only have limited data at the surface level JSON.
                     * 
                     * This should in future check for more cases (presets for score, etc) 
                     * and custom xAPI extensions as well.
                     */
                }
                System.out.println(statements);
                
                if(body.get("more") == null || body.get("more").equals("")){
                    System.out.println("more block is empty. exiting loop.");
                    break;
                }
                
                attachment = body.get("more").toString();
            }catch(ScriptException se){
                System.out.println("JSON Parsing failed!");
                return corsResponseBuilder(200, "JSON Parsing failed. This probably means the LRS could not be reached. Please check your connection.");
            }
        }while(true);
        
        Result result = compileResults(values, key, actionID, objectID);
        System.out.println("received and updated results. returning JSON String...");
        return corsResponseBuilder(200, result.toJSONString());
    }
    
    /**
    * This method was implemented as an early test to send an xAPI request and receive a result.
    * it is essentially a simpler version of the checkXAPIConnection() method which does not
    * receive any parameters. It is not currently used by the Frontend.
    *
    * @return the success state determined by the LRS or an error message.
    *
    */
    @GET
    @Path("/xapitest")
    public String xAPItest(){
    
        String response;
		try {
			response = this.sendXAPIRequest("http://localhost/data/xAPI/statements", "?since=2018-07-28T00:01:00.360Z",
			        "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy");
		} catch (IOException e) {
			e.printStackTrace();
			return "xAPI Test failed.";
		}
	    
        return response;
    }
    
    /**
    * This method implements the sending of queries to the LRS.
    * It builds an HTTP Request out of the URL and query information and adds
    * headers needed for access.
    *
    * @param url the URL at which the used LRS is hosted
    * @param query the URL attachment specifying exactly where in the LRS which xAPI data should be returned
    * @param auth the authentication needed to access the LRS 
    * @return String containing information on the HTTP Response by the LRS
     * @throws IOException 
    */
    private String sendXAPIRequest(String url, String query, String auth) throws IOException{
    	
    	System.out.println("attempting to send request to LRS");
    	
    	URL urlObject = new URL(url+query);
    	HttpURLConnection connection = (HttpURLConnection) urlObject.openConnection();
    	
    	// transmit headers
    	connection.setRequestMethod("GET");  // probably not necessary for GET requests as it is the default(?)
    	connection.setRequestProperty("X-Experience-API-Version", "1.0.3");
    	connection.setRequestProperty("Authorization", auth);
    	connection.setRequestProperty("Cache-Control", "no-cache");
    	
    	// receive and compute the response
    	int code = connection.getResponseCode();
    	
    	System.out.println("GET request sent to : " + url + query);
    	System.out.println("with response code : " + code);
    	
    	BufferedReader reader = new BufferedReader( new InputStreamReader(connection.getInputStream()));
    	String line;
    	StringBuffer buffer = new StringBuffer();
    	
    	while((line = reader.readLine()) != null)
    		buffer.append(line);
    	
    	reader.close();
    	
    	// this works fine without the disconnect, but may interfere with GC(?)
    	connection.disconnect();
    	
    	return buffer.toString();
    }
	
	/////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	/**
    * This is a helper method to simplify received statements into
    * the actual needed values.
    * Currently only String values are supported, so numbers should be stored as Strings.
    * 
    * Caution: This prototype interprets timestamp varieties as being surface-level statement fields.
    * 		   Any other keys are interpreted as result extensions.
    * 		   To access any other fields, this needs to be modified:
    * 				- Using a search algorithm a specific key could be found in each tree-like statement
    * 				- Alternatively additional input parameters could be used to specify where the
    * 					application should look.
    *
    * @param statements the JSONListAdapter containing a Collection of xAPI statements
    * @param key the key to look for in each JSON-encoded (now turned into a Map) xAPI statement
    * @return ArrayList<String> of all found values.
    */
    private List<String> getValuesAtKey(JSONListAdapter statements, String key){
        List<String> result = new ArrayList<String>();
    
        for(Object statement : statements.values()){
        	if(key.equals("timestamp")) {
        		@SuppressWarnings("unchecked") 
        		Map<String, Object> stmtmap = (Map<String, Object>) statement;
                result.add((String) stmtmap.get(key));
        	}else {
				// for non-timestamps, check result extensions.
	        	@SuppressWarnings("unchecked")
				Map<String, Object> stmtMap = (Map<String, Object>) statement;
	        	@SuppressWarnings("unchecked")
				Map<String, Object> stmtResult = (Map<String, Object>) stmtMap.get("result");
	        	@SuppressWarnings("unchecked")
				Map<String, Object> stmtResExt = (Map<String, Object>) stmtResult.get("extensions");
				// check type, non-Strings should be transformed into Strings
	        	Object val = stmtResExt.get(key);
				if(val instanceof String)
					result.add((String) val);
				else
					result.add(String.valueOf(val));
        	}
			
        }
        
        return result;
    }
    
    /**
     * function to collect the results which will be returned to the front-end
     * 
     * @param in input list of values to be used for data extraction.
     * @param key the xAPI statement key specified by the request.
     * @param actionID the action (verb) specified by the request.
     * @param objectID the object (activity) specified by the request.
     * @return
     */
    private Result compileResults(List<String> in, String key, String actionID, String objectID){
        Result res = new Result();
        
        int min_groups = 2;
        int max_groups = 500;
        int min_value = Integer.MAX_VALUE;
        int max_value = Integer.MIN_VALUE;
        boolean countable = true; // are values countable (currently only integers supported as countable)
        boolean groupable = false;
        
        System.out.println("finding min/max values if possible");
        
        // find min/max values if all values can be parsed as Integer
        int min_temp = Integer.MAX_VALUE;
        int max_temp = Integer.MIN_VALUE;
        for (String s : in){
            try{
                int val = Integer.parseInt(s);
                if (val < min_temp)
                    min_temp = val;
                if (val > max_temp)
                    max_temp = val;
            }catch(NumberFormatException nfe){
                System.out.println("values not automatically recognised as countable");
                countable = false;
                break;
            }
        }
        
        // switch applies presets for custom values.
        System.out.println("key right before switch: " + key);
        if(key.equals("timestamp")){
            System.out.println("Key 'timestamp' replaced with 'hour'");
            key = "hour";
        }
        switch(key){
            case "hour":
                countable = true;
                min_value = 0;
                max_value = 23;
                
                in.replaceAll(timestamp -> Integer.toString(ZonedDateTime.parse(timestamp).getHour()));
                
                System.out.println("key recognised as hour. Edited input list: "+in.toString());
                break;
            case "day":
                countable = true;
                min_value = 1;
                max_value = 7;
                
                in.replaceAll(timestamp -> Integer.toString(ZonedDateTime.parse(timestamp).getDayOfWeek().getValue()));
                
                System.out.println("key recognised as day");
                break;
            case "month":
                countable = true;
                min_value = 1;
                max_value = 12;
                
                in.replaceAll(timestamp -> Integer.toString(ZonedDateTime.parse(timestamp).getMonth().getValue()));
                
                System.out.println("key recognised as month");
                break;
            default:
                if (countable){
                    min_value = min_temp;
                    max_value = max_temp;
                }
        }
        
        System.out.println("building HashMap to count entries per default Group...");
        // count occurrences per value
        HashMap<String, Integer> groupCount = new HashMap<String, Integer>();
        for(String s: in){
            groupCount.put(s , 1 + (groupCount.containsKey(s) ? groupCount.get(s) : 0));
        }
        
        // group elements on datasets with too many distinct values
        if(countable && groupCount.size() > max_groups){
            System.out.println("too many distinct groups, attempting to merge");
            int div = max_groups;
            int size = groupCount.size();
            while (size % div != 0){
                div--;
                if(div < min_groups)
                    break;
            }
            if (div >= min_groups){
                HashMap<String, Integer> tempMap = new HashMap<String, Integer>();
                int group_width = size / div;
                // group up keys of the groupCount HashMap and sum up their values
                for (Map.Entry<String, Integer> entry: groupCount.entrySet()){
                    Integer eKey = Integer.parseInt(entry.getKey());
                    Integer eValue = entry.getValue();
                    
                    int keyGroupStart = (int) (Math.floor((eKey - min_value) / group_width) * group_width + 1);
                    int keyGroupEnd = keyGroupStart + group_width - 1;
                    String keyGroup = Integer.toString((int) (keyGroupStart + keyGroupEnd / 2));
                    tempMap.put(keyGroup, eValue + (tempMap.containsKey(keyGroup) ? tempMap.get(keyGroup) : 0));
                }
                groupCount = tempMap;
                groupable = true;
            }else{
                // no grouping could be found.
                groupable = false;
            } 
        }else{
            groupable = true;
        }
        System.out.println("Adding key-value pairs to results");
        // add results to res to return them (possibly temporary?)
        for(Map.Entry<String, Integer> entry: groupCount.entrySet()){
            res.addPair(entry.getKey(), entry.getValue());
        }
        
        System.out.println("Attempting to generate Badge Recommendations");
        
        BadgeGenerator gen = new BadgeGenerator();
        gen.generateBadges(res.getValues(), key, actionID, objectID, groupable, countable, min_value, max_value);
        List<Badge> badges = gen.getBadges();
        
        for (Badge badge: badges){
        	res.addBadge(badge);
            System.out.println(badge.getCriteriaMachineReadable());
        }
        
        res.setStatus("Status OK.");
        res.setKeys(key,"occurences");
        
        System.out.println("Returning results");
        return res;
    }
    
    /**
     * function to generate the HTTP Response containing the cross origin response headers 
     * to allow cross origin requests.
     * 
     * @param status the respone status
     * @param entity the results to return to the front-end
     * @return
     */
    private Response corsResponseBuilder(int status, String entity) {
    	
    	return Response.status(status).entity(entity)
    			.header("Access-Control-Allow-Origin", "*")
    			.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS").build();
    }
    
}
