package i5.obd.backend;

/**
* A class to keep a value of the X axis and it's corresponding Y value.
*
* (Author's comment:) There is probably something in the standard libraries with the same properties,
* but I wanted to be able to change implementation details easily, so I made my own. Currently only
* Integer values are supported, but in particular for the X-Axis it may be useful in future to adapt
* to also allow String values.
*/
public class Pair{
    
    /** The X value to store. */
    private Integer valueX;
    
    /** The Y value to store. */
    private Integer valueY;
    
    /** Constructor.
    * @param valueX the X value to store.
    * @param valueY the Y value to store.
    */
    public Pair(Integer valueX, Integer valueY){
        this.valueX = valueX;
        this.valueY = valueY;
    }
    
    /** Getter.
    * @return the X value of this Pair
    */
    public Integer getValueX(){
        return valueX;
    }
    
    /** Getter.
    * @return the Y value of this Pair
    */
    public Integer getValueY(){
        return valueY;
    }
    
    /**
    * @param valueX the value for the X-Axis of this Pair
    * @param valueY the value for the Y-Axis of this Pair
    */
    public void setValues(Integer valueX, Integer valueY){
        this.valueX = valueX;
        this.valueY = valueY;
    }
    
    /**
    * @param valueX the value for the X-Axis of this Pair
    */
    public void setValueX(Integer valueX){
        this.valueX = valueX;
    }
    
    /**
    * @param valueY the value for the Y-Axis of this Pair
    */
    public void setValueY(Integer valueY){
        this.valueY = valueY;
    }
}
