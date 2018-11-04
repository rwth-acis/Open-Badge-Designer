package i5.obd.listener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.io.Reader;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;

import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Class containing the PSQLtoXAPI listener application.
 * 
 * @author Daniel Schruff
 * 
 * @version 0.1
 */
public class App //TODO:: rename this
{   
    private static Connection conn;
    private static org.postgresql.PGConnection pgconn;
    
    private static final String MAIL_SERVER = "example.com";
    private static final String VERBS_URL = "http://example.com/verbs";
    private static final String ACTIVITIES_URL = "http://example.com/activities";
    private static final String LRS = "http://cloud18.dbis.rwth-aachen.de/data/xAPI/statements";
    private static final String AUTHENTICATION = "Basic MWJkMDM4Mjk3YjkwY2NhODc3NTQ4NjVlMDBlMGJjZTJmNTg4ZmNmMTozNmM3MmMzM2EwYzBkYWViMjNkNzA3NGU3MGZkNjUwYmFjMTkzYTlj";
    private static final String DB = "jdbc:postgresql://localhost:5432/gamification_obd";
    private static final String DBUSER = "gamification";
    private static final String DBPASS = "gamification";
    private static final String CHANNEL = "xapilistener";
    
    /**
     * Main method. Starts the application and contains the listening loop.
     * 
     * @param args arguments will be ignored
     * @throws SQLException
     */
    public static void main(String[] args) throws SQLException{

        String url = DB;
        String user = DBUSER;
        String password = DBPASS;
        
        conn = DriverManager.getConnection(url, user, password);
        pgconn = (org.postgresql.PGConnection)conn;
        Statement stmt = conn.createStatement();
        stmt.execute("LISTEN "+CHANNEL);
        stmt.close();
        
        // since the application is intended to keep running and checking for updates, no condition has been defined
        // to terminate it.
        while(true){
            try{
                stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT 1");
                rs.close();
                stmt.close();
                
                org.postgresql.PGNotification notifications[] = pgconn.getNotifications();
                if(notifications != null) {                    
                    for (int i=0; i<notifications.length; i++){
                        String gameID = "";
                        String userID = "";
                        String verb = "";
                        String key = "";
                        String value = "";
                        
                        
                        String param = notifications[i].getParameter();
                        System.out.println("Got notification: " + param);
                        
                        // input is a string of comma-separated key:value pairs.
                        String[] arr = param.split(",");
                        for(String s: arr){
                            String[] kv = s.split(":", 2);
                            // using switch to allow keys in any order. undefined keys will be ignored.
                            switch(kv[0]){
                                case "game": gameID = kv[1]; break;
                                case "user": userID = kv[1]; break;
                                case "action": verb = kv[1]; break;
                                case "key": key = kv[1]; break;
                                case "value": value = kv[1]; break;
                            }
                        }
                        
                        if(!gameID.equals("") && !userID.equals("") && !verb.equals("")){
                            try{
                                sendXAPIStatement(generateXAPIStatement(gameID, userID, verb, key, value));
                            }catch(Exception e){
                                e.printStackTrace();
                            }
                        }
                    }
                }
                Thread.sleep(500);
            }catch (SQLException sqle){
                sqle.printStackTrace();
            }catch (InterruptedException ie){
                ie.printStackTrace();
            }
            System.out.println("Still running...");
        }
    }
    
    /**
     * function to generate xAPI statements from the information provided by a psql notification
     * 
     * @param gameID the name identifying the game
     * @param userID the name identifying the user
     * @param verb the action that has been taken by the user
     * @param key an additional key to be stored in a result extension
     * @param value the value for the additional key
     * @return the generated xAPI statement as a String
     */
    public static String generateXAPIStatement(String gameID, String userID, String verb, String key, String value){
        
        String name = userID;
        String mail = userID + "@" + MAIL_SERVER;
        
        String verbName = verb;
        String verbURL = VERBS_URL + "/" + verbName;
        
        String activityName = gameID;
        String activityURL = ACTIVITIES_URL + "/" + activityName;
        
        
        String statement = 
            "{"
            +   "\"actor\" :"
            +   "{"
            +       "\"mbox\" : \"mailto:" + mail +"\" ,"
            +       "\"name\" : \"" + name + "\""
            +   "},"
            +   "\"verb\" :"
            +   "{"
            +       "\"id\" : \"" + verbURL + "\" ,"
            +       "\"display\" : {\"en-US\" : \"" + verbName +"\"}"
            +   "},"
            +   "\"object\" :"
            +   "{"
            +       "\"id\" : \"" + activityURL + "\" ,"
            +       "\"definition\" : {\"name\" : {\"en-US\" : \"" + activityName + "\"}}"
            +   "}";
        if(!key.equals("") && !value.equals("")){
            statement = statement
            +","
            +   "\"result\" :"
            +   "{"
            +       "\"completion\" : true,"
            +       "\"success\" : true,"
            +       "\"extensions\" : "
            +       "{"
            +           "\"http://example.com/" + key +"\" : \"" + value + "\""
            +       "}"
            +   "}";
        }
        statement= statement + "}";
            
        System.out.println(statement);
        return statement;
    }
    
    /**
     * function to upload an xAPI statment in string format to the preset Learning Record Store.
     * 
     * @param statement the statement to be uploaded
     * @throws Exception
     */
    public static void sendXAPIStatement(String statement) throws Exception{
        String lrs = LRS;
        String auth = AUTHENTICATION;
        byte[] bytes = statement.getBytes("UTF-8");
        System.out.println("bytes length: " + bytes.length);
        
        URL url = new URL(lrs);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        
        conn.setDoOutput(true);
        conn.setDoInput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setRequestProperty("X-Experience-API-Version","1.0.3");
        conn.setRequestProperty("Authorization", auth);
        conn.setRequestProperty("Cache-Control", "no-cache");
        conn.setUseCaches(false);
        
        OutputStream os = conn.getOutputStream();
        os.write(statement.getBytes("UTF-8"));
        os.close();
        
        Reader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

        for (int c; (c = reader.read()) >= 0;)
            System.out.print((char)c);
    }
}
