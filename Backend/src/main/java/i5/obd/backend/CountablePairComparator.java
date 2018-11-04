package i5.obd.backend;

import java.util.Comparator;

/**
 * @author Daniel Schruff
 * 
 * @version 0.1
 *
 */
public class CountablePairComparator implements Comparator<Pair>{
    /* (non-Javadoc)
     * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
     */
    @Override
    public int compare(Pair a, Pair b){
        int i = getInteger(a.getValueX());
        int j = getInteger(b.getValueX());
        if(i == j)
            return 0;
        if(i < j)
            return -1;
        return 1;
    }
    
    /**
     * function to turn String to integer and return Integer.MAX_VALUE on error.
     * 
     * @param a the string to be parsed
     * @return
     */
    private int getInteger(String a){
        int out = Integer.MAX_VALUE;
        try{
            out = Integer.parseInt(a);
        } catch(NumberFormatException nfe){
            System.out.println("Compared String did not contain Integer!");
            System.out.println(a);
            return Integer.MAX_VALUE;
        }
        return out;
    }
}
