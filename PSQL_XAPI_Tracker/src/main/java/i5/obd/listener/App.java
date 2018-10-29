package i5.obd.listener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

public class App 
{
    private static Connection conn;
    private static org.postgresql.PGConnection pgconn;
    public static void main(String[] args) throws SQLException{

        String url = "jdbc:postgresql://localhost:5432/gamification_obd";
        String user = "gamification";
        String password = "gamification";
        
        conn = DriverManager.getConnection(url, user, password);
        pgconn = (org.postgresql.PGConnection)conn;
        Statement stmt = conn.createStatement();
        stmt.execute("LISTEN mymessage");
        stmt.close();
        
        while(true){
            try{
                stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT 1");
                rs.close();
                stmt.close();
                
                org.postgresql.PGNotification notifications[] = pgconn.getNotifications();
                if(notifications != null) {
                    for (int i=0; i<notifications.length; i++){
                        System.out.println("Got notification: " + notifications[i].getName());
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
}
