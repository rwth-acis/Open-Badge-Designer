package i5.obd.backend;

import java.lang.Integer;

/**
 * @author Daniel Schruff
 * 
 * @version 0.1
 * 
 * A class to keep a value of the X axis and it's corresponding Y value.
 *
 * (Author's comment:) There is probably something in the standard libraries with the same properties,
 * but I wanted to be able to change implementation details easily, so I made my own. Currently only
 * Integer values are supported, but in particular for the X-Axis it may be useful in future to adapt
 * to also allow String values and other numbers.
 */
public class Pair{
    
    /** The X value to store. */
    private String valueX;
    
    /** The Y value to store. */
    private Integer valueY;
    
    /** Constructor with X as String as X-Axis contains data groups which may
     * not always be numeric values.
     * @param valueX the X value to store.
     * @param valueY the Y value to store.
     */
    public Pair(String valueX, Integer valueY){
        this.valueX = valueX;
        this.valueY = valueY;
    }
    
    /** Constructor with X as Integer. X will be transformed to String.
     * @param valueX the X value to store.
     * @param valueY the Y value to store.
     */
    public Pair(Integer valueX, Integer valueY){
        this.valueX = Integer.toString(valueX);
        this.valueY = valueY;
    }
    
    /**
     * Output data in JSON-style format
     * @return the JSON String
     */
    public String toJSONString(){
        return "[\""+valueX+"\","+valueY+"]";
    }
    
    /** Getter.
     * @return the X value of this Pair
     */
    public String getValueX(){
        return valueX;
    }
    
    /** Getter.
     * @return the Y value of this Pair
     */
    public Integer getValueY(){
        return valueY;
    }
    
    /** Setter for both values using an Integer X
     * @param valueX the value for the X-Axis of this Pair
     * @param valueY the value for the Y-Axis of this Pair
     */
    public void setValues(Integer valueX, Integer valueY){
        this.valueX = Integer.toString(valueX);
        this.valueY = valueY;
    }
    
    /** Setter for both values using a String X
     * @param valueX the value for the X-Axis of this Pair
     * @param valueY the value for the Y-Axis of this Pair
     */
    public void setValues(String valueX, Integer valueY){
        this.valueX = valueX;
        this.valueY = valueY;
    }
    
    /**
     * Setter
     * 
     * @param valueX the value for the X-Axis of this Pair as String
     */
    public void setValueX(String valueX){
        this.valueX = valueX;
    }
    
    /**
     * @param valueX the value for the X-Axis of this Pair as Integer
     */
    public void setValueX(Integer valueX){
        this.valueX = Integer.toString(valueX);
    }
    
    /**
     * Setter
     * 
     * @param valueY the value for the Y-Axis of this Pair
     */
    public void setValueY(Integer valueY){
        this.valueY = valueY;
    }
}
