package i5.obd.backend;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;

/**
* Result Objects are used to hold all values which are supposed to be returned to the Frontend.
* The values can be extracted using toJSONString() to put it into a format that is easily readable
* by any Frontend instance.
*/
public class Result{
    /** Messages about Success/Failure to return to the Frontend. */
    private String status;
    
    /** the key used for the X-Axis on Frontend Graphs */
    private String keyX;
    
    /** the key used for the Y-Axis on Frontend Graphs */
    private String keyY;
    
    /** This List holds pairs of values which may be used for graphs in the Frontend. */
    private List<Pair> values;
    
    /** Empty Constructor. Only prepares empty values for everything. */
    public Result(){
        status = "";
        keyX = "";
        keyY = "";
        values = new ArrayList<Pair>();
    }
    
    /**
    * method to turn the data of this Object into a JSON-Style String.
    * @return a JSON style String containing this Objects information.
    */
    public String toJSONString(){
        String out = "{";
        
        out = out + "\"status\":\"" + status +"\",";
        out = out + "\"keyX\":\"" + keyX + "\",";
        out = out + "\"keyY\":\"" + keyY + "\",";
        out = out + "\"values\":" + "[";
        for(Pair pair: values){
            out = out + pair.toJSONString() + ",";
        }
        if(values.size() > 0)
            out = out.substring(0, out.length() - 1);
        out = out + "]";
        out = out + "}";
        return out;
    }
    
    /** Getter.  
    * @return Returns the status.
    */
    public String getStatus(){
        return status;
    }
    
    /** Getter. 
    * @return Returns the X-Axis key 
    */
    public String getKeyX(){
        return keyX;
    }
    
    /** Getter. 
    * @return Returns the Y-Axis key 
    */
    public String getKeyY(){
        return keyY;
    }
    
    /** Getter. 
    * @return Returns the values array. 
    */
    public List<Pair> getValues(){
        return values;
    }
    
    /** Setter. 
    * @param status the text to use as status message. 
    */
    public void setStatus(String status){
        this.status = status;
    }
    
    /** Setter.
    * @param keyX the key to use for values on the X-Axis
    * @param keyY the key to use for values on the Y-Axis
    */
    public void setKeys(String keyX, String keyY){
        this.keyX = keyX;
        this.keyY = keyY;
    }
    
    /** Setter.
    * @param keyX the key to use for values on the X-Axis
    */
    public void setKeyX(String keyX){
        this.keyX = keyX;
    }
    
    /** Setter.
    * @param keyY the key to use for values on the Y-Axis
    */
    public void setKeyY(String keyY){
        this.keyY = keyY;
    }
    
    /** Setter. Depending on use it may be recommended to have no duplicate X-Values.
    * @param values the ArrayList containing values
    */
    public void setValues(ArrayList<Pair> values){
        this.values = values;
    }
    
    /** Adds a pair to the values List. Depending on use it may be recommended to have no duplicate X-Values.
    * @param valuePair the Pair to add to the List
    */
    public void addPair(Pair valuePair){
        values.add(valuePair);
    }
    
    /** Adds a pair to the values List with X as Integer. Depending on use it may be recommended to have no duplicate X-Values.
    * @param valueX the value for the X-Axis
    * @param valueY the value for the Y-Axis
    */
    public void addPair(Integer valueX, Integer valueY){
        values.add(new Pair(valueX, valueY));
    }
    
    /** Adds a pair to the values List with X as String. Depending on use it may be recommended to have no duplicate X-Values.
    * @param valueX the value for the X-Axis
    * @param valueY the value for the Y-Axis
    */
    public void addPair(String valueX, Integer valueY){
        values.add(new Pair(valueX, valueY));
    }

}
